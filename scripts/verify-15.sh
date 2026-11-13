#!/usr/bin/env bash
# Task 15 verification (continuation session): mobile detector scan + visual
# crops of the new checksum row + atomic SSR-vs-upstream cross-check.
# One process: sandbox reaps background servers between tool calls.
set -u
cd /home/z/my-project
PORT=3104
cleanup() { pkill -f "standalone/server.js" 2>/dev/null; }
trap cleanup EXIT
setsid nohup env PORT=$PORT NODE_ENV=production bun .next/standalone/server.js </dev/null > /tmp/verify15-server.log 2>&1 &
for i in $(seq 1 20); do curl -s -o /dev/null --max-time 2 http://localhost:$PORT && break; sleep 0.5; done
curl -s -o /dev/null --max-time 5 http://localhost:$PORT || { echo "FATAL: server not up"; exit 1; }
echo "== server up on $PORT =="

IMPECCABLE=".agents/skills/impeccable/scripts/impeccable"
export IMPECCABLE_BROWSER=/home/z/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome
echo "== detector re-scan: rendered mobile =="
$IMPECCABLE detect --json --viewport 390x844 http://localhost:$PORT > /tmp/verify-mobile.json; echo "mobile exit=$?"
python3 - << 'EOF'
import json
with open("/tmp/verify-mobile.json") as f:
    data = json.load(f)
findings = data if isinstance(data, list) else data.get("findings", [])
for x in findings:
    print(x.get("selector", "?"), "|", x.get("severity"), "|", x.get("snippet"))
EOF

echo "== atomic cross-check: SSR-displayed hex vs fresh upstream sha256 =="
HEX_SSR=$(curl -s http://localhost:$PORT | rg -o 'd9612f0f8a39c802a28c5b7b902a97ae321c31859175cf7e946765f92c05ebc2' | head -1)
HEX_UP=$(curl -sS --max-time 30 https://raw.githubusercontent.com/d-o-hub/do-harness/main/scripts/install.sh | sha256sum | cut -d' ' -f1)
echo "ssr     : $HEX_SSR"
echo "upstream: $HEX_UP"
if [ -n "$HEX_SSR" ] && [ "$HEX_SSR" = "$HEX_UP" ]; then echo "MATCH"; else echo "MISMATCH"; fi

echo "== visual: install row crops =="
AB() { agent-browser "$@"; }
mkdir -p /tmp/verify15
AB set viewport 1440 900
AB open "http://localhost:$PORT#install"
sleep 3
AB eval "(async () => { const de = document.documentElement; de.style.scrollBehavior='auto'; const el = document.getElementById('install'); el.scrollIntoView(); await new Promise(r => setTimeout(r, 800)); return 'at install'; })()"
sleep 1
AB screenshot /tmp/verify15/install-desktop-light.png
AB set media dark
sleep 1
AB screenshot /tmp/verify15/install-desktop-dark.png
AB set media light
AB set viewport 390 844
sleep 1
AB eval "(async () => { const de = document.documentElement; de.style.scrollBehavior='auto'; const el = document.getElementById('install'); el.scrollIntoView(); await new Promise(r => setTimeout(r, 800)); return 'at install mobile'; })()"
sleep 1
AB screenshot /tmp/verify15/install-mobile.png
AB errors
echo DONE-VERIFY-15
