#!/usr/bin/env bash
set -u
cd /home/z/my-project
mkdir -p /tmp/critique-a
PORT=3101
cleanup() { pkill -f "standalone/server.js" 2>/dev/null; }
trap cleanup EXIT
setsid nohup env PORT=$PORT NODE_ENV=production bun .next/standalone/server.js </dev/null > /tmp/critique-a-server.log 2>&1 &
sleep 3
for i in $(seq 1 60); do
  if curl -s -o /dev/null --max-time 10 http://127.0.0.1:$PORT; then break; fi
  sleep 1
done
curl -s -o /dev/null --max-time 10 http://127.0.0.1:$PORT || { echo "FATAL: server not up"; exit 1; }
AB() { agent-browser "$@"; }
warmup() {  # Reveal wrappers are once:true and never fire on a full-page capture; scroll through first
  AB eval "(async () => { const de = document.documentElement; const prev = de.style.scrollBehavior; de.style.scrollBehavior = 'auto'; const h = document.body.scrollHeight; for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } await new Promise(r => setTimeout(r, 300)); window.scrollTo(0, 0); de.style.scrollBehavior = prev; await new Promise(r => setTimeout(r, 300)); return 'warm: ' + h; })()"
}
AB set viewport 1440 900
AB open http://localhost:$PORT
sleep 3
AB errors
AB console 2>&1 | tail -5
AB screenshot /tmp/critique-a/hero-viewport.png
warmup
sleep 1
AB screenshot --full /tmp/critique-a/desktop-light.png
AB set media dark
warmup
sleep 1
AB screenshot --full /tmp/critique-a/desktop-dark.png
AB set media light
AB set viewport 390 844
sleep 1
warmup
sleep 1
AB screenshot --full /tmp/critique-a/mobile-light.png
AB errors
echo DONE-A-SHOTS
