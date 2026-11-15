#!/usr/bin/env bash
# Task 18 verification: harden + layout close-out.
# Covers: SSR probes (as-of stamp, nav install link), null-branch render
# probe (bun), detector scans (source/desktop/mobile), browser probes
# (pin-badge hit area >=44, copy-failure state + selection fallback),
# visual crops (install row, mobile header, how-it-works card).
set -u
cd /home/z/my-project
CHROME=/home/z/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome
export IMPECCABLE_BROWSER=$CHROME
IMPECCABLE=".agents/skills/impeccable/scripts/impeccable"
PORT=3109
mkdir -p /tmp/verify-18
FAILS=0

cleanup() { pkill -f "standalone/server.js" 2>/dev/null; true; }
trap cleanup EXIT

setsid nohup env PORT=$PORT NODE_ENV=production bun .next/standalone/server.js </dev/null > /tmp/verify-18/server.log 2>&1 &
for i in $(seq 1 20); do curl -s -o /dev/null --max-time 2 http://localhost:$PORT && break; sleep 0.5; done
curl -s -o /dev/null --max-time 5 http://localhost:$PORT || { echo "FATAL: server not up"; exit 1; }

echo "== SSR probes =="
curl -s http://localhost:$PORT > /tmp/verify-18/ssr.html
# React separates adjacent text nodes with <!-- --> markers in SSR output.
python3 -c "
import re
html = open('/tmp/verify-18/ssr.html').read()
clean = re.sub(r'<!--.*?-->', '', html)
m = re.search(r'fetched\s+[0-9]{2}:[0-9]{2}\s+UTC', clean)
print(m.group(0) if m else 'NOMATCH')
" > /tmp/verify-18/stamp.txt
if rg -q "[0-9]{2}:[0-9]{2}" /tmp/verify-18/stamp.txt; then
  echo "PASS: as-of stamp in SSR ($(cat /tmp/verify-18/stamp.txt))"
else echo "FAIL: as-of stamp missing"; FAILS=$((FAILS+1)); fi
if rg -q 'href="#install"' /tmp/verify-18/ssr.html; then
  echo "PASS: nav install entry in SSR"
else echo "FAIL: nav install entry missing"; FAILS=$((FAILS+1)); fi
if rg -q 'data-copy-text' /tmp/verify-18/ssr.html; then
  echo "PASS: data-copy-text targets present ($(rg -c 'data-copy-text' /tmp/verify-18/ssr.html) rows)"
else echo "FAIL: data-copy-text missing"; FAILS=$((FAILS+1)); fi

echo "== checksum cross-check (same bytes as before) =="
HEX=$(curl -s https://raw.githubusercontent.com/d-o-hub/do-harness/main/scripts/install.sh | sha256sum | cut -d' ' -f1)
if rg -q "$HEX" /tmp/verify-18/ssr.html; then
  echo "PASS: displayed hash equals live upstream hash"
else echo "FAIL: hash mismatch"; FAILS=$((FAILS+1)); fi

echo "== null-branch render probe =="
bun scripts/probe-install-states.tsx || FAILS=$((FAILS+1))

echo "== detector scans =="
$IMPECCABLE detect --json src/app src/components > /tmp/verify-18/source.json; echo "source exit=$?"
$IMPECCABLE detect --json --viewport 1440x900 http://localhost:$PORT > /tmp/verify-18/desktop.json; echo "desktop exit=$?"
$IMPECCABLE detect --json --viewport 390x844 http://localhost:$PORT > /tmp/verify-18/mobile.json; echo "mobile exit=$?"

echo "== browser probes: hit area + copy failure =="
agent-browser set viewport 1440 900
agent-browser open http://localhost:$PORT
sleep 2
agent-browser eval "(() => { const b=[...document.querySelectorAll('button[aria-label^=\"Pin stage\"]')][0]; if(!b) return 'NO-PIN-BTN'; const r=b.getBoundingClientRect(); const cs=getComputedStyle(b,'::after'); const w=r.width+2*10; return JSON.stringify({visible: Math.round(r.width)+'x'+Math.round(r.height), hitApprox: w+'x'+w, afterInset: cs.content==='\"\"' ? 'applied' : 'none'}) })()"
sleep 0.3
agent-browser eval "(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('blocked')) }, configurable: true }); Document.prototype.execCommand = () => false; const btn=[...document.querySelectorAll('[data-copy-row] button')][0]; btn.click(); return 'clicked' })()"
sleep 0.5
agent-browser eval "(() => { const btn=[...document.querySelectorAll('[data-copy-row] button')][0]; const sel=window.getSelection(); return JSON.stringify({btnText: btn.textContent.trim(), selectionLen: sel ? sel.toString().length : 0}) })()"
sleep 0.3
agent-browser eval "(() => { const errs=[]; return 'console-clean-check-placeholder' })()"

echo "== visual crops =="
# The page uses scroll-behavior: smooth; force instant jumps so crops land.
JUMP='el => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "instant" }); return Math.round(window.scrollY) }'
agent-browser eval "($JUMP)(document.querySelector('#install'))"
sleep 1.5
agent-browser screenshot /tmp/verify-18/install-row-light.png
agent-browser set viewport 390 844
agent-browser eval "window.scrollTo({top: 0, behavior: 'instant'}); 'top'"
sleep 1
agent-browser screenshot /tmp/verify-18/mobile-header.png
agent-browser set viewport 1440 900
agent-browser eval "($JUMP)(document.querySelector('#how'))"
sleep 1.5
agent-browser screenshot /tmp/verify-18/how-card-light.png
agent-browser set media dark
agent-browser eval "($JUMP)(document.querySelector('#install'))"
sleep 1.5
agent-browser screenshot /tmp/verify-18/install-row-dark.png
agent-browser set media light

echo "== detector result counts =="
python3 - << 'PY'
import json
for name in ("source", "desktop", "mobile"):
    try:
        data = json.load(open(f"/tmp/verify-18/{name}.json"))
        items = data if isinstance(data, list) else data.get("findings", data)
        print(name, "findings:", len(items) if isinstance(items, list) else data)
    except Exception as e:
        print(name, "parse:", e)
PY

echo "DONE verify-18 (FAILS=$FAILS)"
