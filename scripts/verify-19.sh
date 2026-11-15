#!/usr/bin/env bash
# Task 19 verification: distill (bento 7 -> 5 cards, re-glossed bodies)
# + minors (themeColor exact conversions, 28px one-time chip, #top anchor,
# exit-codes anchor). Covers: SSR probes, detector scans (source/desktop/
# mobile), browser probes (grid tiling geometry, chip height, anchor
# navigation), visual crops (bento light/dark/mobile).
set -u
cd /home/z/my-project
CHROME=/home/z/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome
export IMPECCABLE_BROWSER=$CHROME
IMPECCABLE=".agents/skills/impeccable/scripts/impeccable"
PORT=3111
mkdir -p /tmp/verify-19
FAILS=0

cleanup() { pkill -f "standalone/server.js" 2>/dev/null; true; }
trap cleanup EXIT

setsid nohup env PORT=$PORT NODE_ENV=production bun .next/standalone/server.js </dev/null > /tmp/verify-19/server.log 2>&1 &
for i in $(seq 1 20); do curl -s -o /dev/null --max-time 2 http://localhost:$PORT && break; sleep 0.5; done
curl -s -o /dev/null --max-time 5 http://localhost:$PORT || { echo "FATAL: server not up"; exit 1; }

echo "== SSR probes =="
curl -s http://localhost:$PORT > /tmp/verify-19/ssr.html
# React separates adjacent text nodes with <!-- --> markers in SSR output.
python3 - << 'PY' || FAILS=$((FAILS+1))
import re, sys
html = open('/tmp/verify-19/ssr.html').read()
clean = re.sub(r'<!--.*?-->', '', html)
checks = [
    ('themeColor light #f8faf7', '#f8faf7' in clean, True),
    ('themeColor dark #0c100d', '#0c100d' in clean, True),
    ('old light #f8f9f5 gone', '#f8f9f5' not in clean, True),
    ('old dark #151b16 gone', '#151b16' not in clean, True),
    ('id=top present', 'id="top"' in clean, True),
    ('id=exit-codes present', 'id="exit-codes"' in clean, True),
    ('cell: Language packs', 'Language packs' in clean, True),
    ('cell: Git hooks', 'Git hooks' in clean, True),
    ('cell: Evidence and metrics', 'Evidence and metrics' in clean, True),
    ('cell: Compliance mapping', 'Compliance mapping' in clean, True),
    ('Skills loop card gone', 'Skills loop' not in clean, True),
    ('packs body re-glossed', 'Each pack selects the sensors' in clean, True),
    ('hooks body re-glossed', 'A fast sensor set on commit' in clean, True),
    ('evidence reuses thesis terms', 'writes each sensor result into' in clean and 'agent_state.db' in clean, True),
    ('old libSQL wording gone', 'into a libSQL store' not in clean, True),
    ('metrics fact kept', 'time-to-green and pushes per green' in clean, True),
]
bad = [name for name, ok, _ in checks if not ok]
for name, ok, _ in checks:
    print(('PASS: ' if ok else 'FAIL: ') + name)
sys.exit(1 if bad else 0)
PY

echo "== detector scans =="
$IMPECCABLE detect --json src/app src/components > /tmp/verify-19/source.json; echo "source exit=$?"
$IMPECCABLE detect --json --viewport 1440x900 http://localhost:$PORT > /tmp/verify-19/desktop.json; echo "desktop exit=$?"
$IMPECCABLE detect --json --viewport 390x844 http://localhost:$PORT > /tmp/verify-19/mobile.json; echo "mobile exit=$?"

echo "== browser probes: bento tiling + chip + anchors =="
agent-browser set viewport 1440 900
agent-browser open http://localhost:$PORT
sleep 2
# 1) Grid geometry: 5 cards, two rows, compliance right after evidence, no holes.
agent-browser eval "(() => { const grid=document.querySelector('#harness .grid'); if(!grid) return 'NO-GRID'; const cards=[...grid.children].map(c=>{const r=c.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}}); return JSON.stringify({n:cards.length,cards}) })()" > /tmp/verify-19/grid.json
cat /tmp/verify-19/grid.json
# 2) one-time chip height
agent-browser eval "(() => { const chip=[...document.querySelectorAll('.chip')].find(c=>c.textContent.trim()==='one-time'); return chip ? getComputedStyle(chip).height : 'NO-CHIP' })()"
# 3) anchors exist + scroll-mt
agent-browser eval "(() => { const ec=document.getElementById('exit-codes'); return JSON.stringify({topLink: !!document.querySelector('a[href=\"#top\"]'), topEl: !!document.getElementById('top'), exitCodes: !!ec, scrollMt: ec ? getComputedStyle(ec).scrollMarginTop : null}) })()"
# 4) live hash navigation: #exit-codes scrolls the card under the sticky nav
agent-browser eval "document.documentElement.style.scrollBehavior='auto'; location.hash='exit-codes'; 'set'"
sleep 1
agent-browser eval "(() => { const r=document.getElementById('exit-codes').getBoundingClientRect(); return JSON.stringify({scrollY: Math.round(window.scrollY), cardTop: Math.round(r.top)}) })()"
agent-browser eval "location.hash='top'; 'set'"
sleep 1
agent-browser eval "Math.round(window.scrollY)"

echo "== visual crops =="
JUMP='el => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "instant" }); return Math.round(window.scrollY) }'
agent-browser set media light
agent-browser eval "($JUMP)(document.querySelector('#harness'))"
sleep 1.5
agent-browser screenshot /tmp/verify-19/bento-light.png
agent-browser set media dark
agent-browser eval "($JUMP)(document.querySelector('#harness'))"
sleep 1.5
agent-browser screenshot /tmp/verify-19/bento-dark.png
agent-browser set viewport 390 844
agent-browser set media light
agent-browser eval "($JUMP)(document.querySelector('#harness'))"
sleep 1.5
agent-browser screenshot /tmp/verify-19/bento-mobile.png
agent-browser set viewport 1440 900

echo "== detector result counts =="
python3 - << 'PY'
import json
for name in ("source", "desktop", "mobile"):
    try:
        data = json.load(open(f"/tmp/verify-19/{name}.json"))
        items = data if isinstance(data, list) else data.get("findings", data)
        print(name, "findings:", len(items) if isinstance(items, list) else data)
    except Exception as e:
        print(name, "parse:", e)
PY

echo "DONE verify-19 (FAILS=$FAILS)"
