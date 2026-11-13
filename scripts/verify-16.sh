#!/usr/bin/env bash
# Task 16 verification (optimize pass): motion probes + detector + visual
# crops of the changed surfaces (loop panel, how-it-works, verdict ring).
# One process: sandbox reaps background servers between tool calls.
set -u
cd /home/z/my-project
PORT=3106
CHROME=/home/z/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome
export IMPECCABLE_BROWSER=$CHROME
IMPECCABLE=".agents/skills/impeccable/scripts/impeccable"
cleanup() { pkill -f "standalone/server.js" 2>/dev/null; }
trap cleanup EXIT
setsid nohup env PORT=$PORT NODE_ENV=production bun .next/standalone/server.js </dev/null > /tmp/verify16-server.log 2>&1 &
for i in $(seq 1 20); do curl -s -o /dev/null --max-time 2 http://localhost:$PORT && break; sleep 0.5; done
curl -s -o /dev/null --max-time 5 http://localhost:$PORT || { echo "FATAL: server not up"; exit 1; }
echo "== server up on $PORT =="

AB() { agent-browser "$@"; }
AB set viewport 1440 900
AB open http://localhost:$PORT
sleep 3
echo "== console errors =="
AB errors

echo "== motion probes (loop state machine live, CSS animations) =="
AB eval "(async () => { const de = document.documentElement; de.style.scrollBehavior='auto';
  const out = {};
  // 1. flow-dot: mounts once the loop state machine starts (stage >= 0)
  await new Promise(r => setTimeout(r, 500));
  const dot = document.querySelector('.flow-dot');
  out.dotMounted = Boolean(dot);
  if (dot) {
    const cs = getComputedStyle(dot);
    out.dotAnimName = cs.animationName;
    out.dotLeft = cs.left;
    const t1 = cs.transform;
    await new Promise(r => setTimeout(r, 400));
    out.dotTransformChanges = getComputedStyle(dot).transform !== t1;
  }
  // 2. loop badge spin (hero loop panel)
  const badge = document.querySelector('.spin-continuous-9');
  out.badgeCount = document.querySelectorAll('.spin-continuous-9').length;
  if (badge) {
    out.badgeAnimName = getComputedStyle(badge).animationName;
    const m1 = getComputedStyle(badge).transform;
    await new Promise(r => setTimeout(r, 300));
    out.badgeTransformChanges = getComputedStyle(badge).transform !== m1;
  }
  // 3. verdict ring spin (CTA)
  const ring = document.querySelector('.spin-continuous-24');
  out.ringPresent = Boolean(ring);
  if (ring) out.ringAnimName = getComputedStyle(ring).animationName;
  return JSON.stringify(out);
})()"

echo "== detector re-scan: source =="
$IMPECCABLE detect --json src/app src/components > /tmp/verify16-source.json; echo "source exit=$?"
echo "== detector re-scan: rendered desktop =="
$IMPECCABLE detect --json --viewport 1440x900 http://localhost:$PORT > /tmp/verify16-desktop.json; echo "desktop exit=$?"
echo "== detector re-scan: rendered mobile =="
$IMPECCABLE detect --json --viewport 390x844 http://localhost:$PORT > /tmp/verify16-mobile.json; echo "mobile exit=$?"
python3 - << 'EOF'
import json
for name in ("verify16-source", "verify16-desktop", "verify16-mobile"):
    with open(f"/tmp/{name}.json") as f:
        data = json.load(f)
    findings = data if isinstance(data, list) else data.get("findings", [])
    from collections import Counter
    counts = Counter(x.get("snippet", x.get("rule", x.get("id", "?"))) for x in findings)
    print(name, "->", sum(counts.values()), "findings:", dict(counts))
EOF

echo "== visual crops =="
mkdir -p /tmp/verify16
AB eval "(async () => { document.getElementById('how').scrollIntoView(); await new Promise(r => setTimeout(r, 900)); return 'how'; })()"
sleep 1
AB screenshot /tmp/verify16/how-light.png
AB set media dark
sleep 1
AB eval "(async () => { window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 700)); const el = document.querySelector('[aria-label*=harness loop i]') || document.querySelector('main'); el.scrollIntoView(); await new Promise(r => setTimeout(r, 600)); return 'hero'; })()" 2>/dev/null || AB eval "(async () => { window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 700)); return 'top'; })()"
sleep 1
AB screenshot /tmp/verify16/hero-dark.png
AB set media light
AB eval "(async () => { const els = document.querySelectorAll('section'); els[els.length-1].scrollIntoView(); await new Promise(r => setTimeout(r, 900)); return 'cta'; })()"
sleep 1
AB screenshot /tmp/verify16/cta-verdict.png
AB set viewport 390 844
sleep 1
AB eval "(async () => { document.getElementById('how').scrollIntoView(); await new Promise(r => setTimeout(r, 900)); return 'how mobile'; })()"
sleep 1
AB screenshot /tmp/verify16/how-mobile.png
AB errors
echo DONE-VERIFY-16
