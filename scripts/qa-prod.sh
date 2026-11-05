#!/usr/bin/env bash
# Production-mode QA sweep: boots the standalone server, runs every
# functional check via agent-browser, captures the final screenshot
# tour, then shuts the server down. Must run in ONE process because
# the sandbox reaps background processes between tool calls.
set -u
cd /home/z/my-project

PORT=3100
FAIL=0

cleanup() { pkill -f "standalone/server.js" 2>/dev/null; }
trap cleanup EXIT

setsid nohup env PORT=$PORT NODE_ENV=production bun .next/standalone/server.js </dev/null > server-qa.log 2>&1 &
sleep 3
curl -s -o /dev/null --max-time 5 http://localhost:$PORT || { echo "FATAL: server not up"; exit 1; }
echo "== server up on $PORT =="

AB() { agent-browser "$@" || FAIL=1; }
EV() { AB eval "$1"; }

# Scroll-triggered Reveal wrappers fire on intersection with margin
# -80px; a full-page screenshot never intersects them, so warm the
# page up by scrolling through it once (reveals are once:true) and
# returning to the top before any full-page capture.
warmup() {
  EV "(async () => { const de = document.documentElement; const prev = de.style.scrollBehavior; de.style.scrollBehavior = 'auto'; const h = document.body.scrollHeight; for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } await new Promise(r => setTimeout(r, 300)); window.scrollTo(0, 0); de.style.scrollBehavior = prev; await new Promise(r => setTimeout(r, 300)); return 'warm: ' + h; })()"
}

AB set viewport 1440 900
AB open http://localhost:$PORT
sleep 3

echo "== page errors =="
AB errors
echo "== console (tail) =="
AB console 2>&1 | tail -4

echo "== overflow @1440 =="
EV "document.documentElement.scrollWidth + ' vs ' + window.innerWidth"

echo "== meta tags =="
EV "JSON.stringify({og: document.querySelector('meta[property=\"og:image\"]')?.content, tw: document.querySelector('meta[name=\"twitter:card\"]')?.content, canon: document.querySelector('link[rel=\"canonical\"]')?.href ?? 'none'})"
EV "({sm: document.querySelector('meta[name=\"twitter:image\"]')?.content ?? 'none'})"

echo "== init tree cycles =="
EV "document.querySelector('[aria-label^=\"do-harness init scaffolds\"]').scrollIntoView({block:'center'}); 'ok'"
sleep 1.2
EV "(() => { const g = document.querySelector('[aria-label^=\"do-harness init scaffolds\"] .grid'); return 'rows@t0: ' + Array.from(g.children).filter(r => r.className.includes('justify-between')).length; })()"
sleep 1.6
EV "(() => { const g = document.querySelector('[aria-label^=\"do-harness init scaffolds\"] .grid'); return 'rows@t1: ' + Array.from(g.children).filter(r => r.className.includes('justify-between')).length; })()"

echo "== red terminal cycles =="
EV "document.querySelector('[aria-label^=\"Terminal replay\"]').scrollIntoView({block:'center'}); 'ok'"
sleep 1.2
EV "(() => { const t = document.querySelector('[aria-label^=\"Terminal replay\"] div[aria-hidden=\"true\"]'); return 'lines@t0: ' + t.children.length; })()"
sleep 1.6
EV "(() => { const t = document.querySelector('[aria-label^=\"Terminal replay\"] div[aria-hidden=\"true\"]'); return 'lines@t1: ' + t.children.length + ' | last: ' + (t.lastElementChild?.textContent ?? '').slice(0, 40); })()"

echo "== hero loop cycles =="
EV "window.scrollTo(0, 0); 'ok'"
sleep 2.5
EV "(() => { const b = document.querySelector('[aria-pressed=\"true\"]'); return 'pinned/active node: ' + (b ? b.getAttribute('aria-label') : 'none'); })()"
sleep 2.6
EV "(() => { const b = document.querySelector('[aria-pressed=\"true\"]'); return 'pinned/active node: ' + (b ? b.getAttribute('aria-label') : 'none'); })()"

echo "== full-page light =="
warmup
sleep 1
AB screenshot --full scripts/tour-desktop-light.png

echo "== dark theme =="
AB set media dark
warmup
sleep 1
AB screenshot --full scripts/tour-desktop-dark.png
AB set media light

echo "== tablet 768 =="
AB set viewport 768 900
sleep 1
EV "document.documentElement.scrollWidth + ' vs ' + window.innerWidth"

echo "== mobile 390 =="
AB set viewport 390 844
sleep 1
EV "document.documentElement.scrollWidth + ' vs ' + window.innerWidth"
warmup
sleep 1
AB screenshot --full scripts/tour-mobile-light.png

echo "== final error check =="
AB errors
AB console 2>&1 | tail -3

echo "== done (FAIL=$FAIL) =="
