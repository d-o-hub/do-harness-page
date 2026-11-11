#!/usr/bin/env bash
set -u
cd /home/z/my-project
mkdir -p /tmp/critique-b
CHROME=/home/z/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome
export IMPECCABLE_BROWSER=$CHROME
IMPECCABLE=".agents/skills/impeccable/scripts/impeccable"
PORT=3102
cleanup() { pkill -f "standalone/server.js" 2>/dev/null; "$IMPECCABLE" live-server stop --keep-inject >/dev/null 2>&1; true; }
trap cleanup EXIT
if ! curl -s -o /dev/null --max-time 3 http://localhost:3102; then
  setsid nohup env PORT=$PORT NODE_ENV=production bun .next/standalone/server.js </dev/null > /tmp/critique-b-server.log 2>&1 &
  sleep 3
  curl -s -o /dev/null --max-time 5 http://localhost:$PORT || { echo "FATAL: server not up"; exit 1; }
fi
echo "== scan 1: source markup =="
$IMPECCABLE detect --json src/app src/components > /tmp/critique-b/source.json; echo "source exit=$?"
echo "== scan 2: rendered desktop 1440x900 =="
$IMPECCABLE detect --json --viewport 1440x900 http://localhost:$PORT > /tmp/critique-b/desktop.json; echo "desktop exit=$?"
echo "== scan 3: rendered mobile 390x844 =="
$IMPECCABLE detect --json --viewport 390x844 http://localhost:$PORT > /tmp/critique-b/mobile.json; echo "mobile exit=$?"
echo "== overlay attempt (best effort) =="
$IMPECCABLE live-server --background --port=8401 > /tmp/critique-b/live-server.json 2>&1 && echo "live-server started" || echo "live-server FAILED"
agent-browser set viewport 1440 900
agent-browser open http://localhost:$PORT
sleep 2
agent-browser eval "document.title = 'impeccable-preflight-ok'; const s = document.createElement('script'); s.src = 'http://localhost:8401/detect.js'; document.head.appendChild(s); 'mutation-ok'"
sleep 3
agent-browser console 2>&1 | rg -i impeccable > /tmp/critique-b/console.txt || echo "no impeccable console lines"
echo DONE-B-SCANS
