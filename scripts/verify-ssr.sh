#!/usr/bin/env bash
# Post-fix verification: SSR/no-JS state assertions + detector re-scan.
# One process (sandbox reaps background servers between tool calls).
set -u
cd /home/z/my-project
PORT=3102
CHROME=/home/z/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome
export IMPECCABLE_BROWSER=$CHROME
IMPECCABLE=".agents/skills/impeccable/scripts/impeccable"
FAIL=0

cleanup() { pkill -f "standalone/server.js" 2>/dev/null; }
trap cleanup EXIT

setsid nohup env PORT=$PORT NODE_ENV=production bun .next/standalone/server.js </dev/null > /tmp/verify-server.log 2>&1 &
for i in $(seq 1 20); do curl -s -o /dev/null --max-time 2 http://localhost:$PORT && break; sleep 0.5; done
curl -s -o /dev/null --max-time 5 http://localhost:$PORT || { echo "FATAL: server not up"; exit 1; }
echo "== server up on $PORT =="

HTML=$(curl -s http://localhost:$PORT)
assert() { # name, haystack
  if echo "$1" | rg -q "$2"; then echo "PASS: $3"; else echo "FAIL: $3"; FAIL=1; fi
}
assert "$HTML" "classList.add\('js'\)" "bootstrap script adds html.js"
assert "$HTML" "halted: test skipped until the fix lands" "terminal SSR: halt line present"
assert "$HTML" "exit 0 · GREEN" "terminal SSR: GREEN verdict present"
assert "$HTML" "agent_state.db" "init tree SSR: last row present"
assert "$HTML" "plans/invariants.json" "init tree SSR: row 4 present"
assert "$HTML" "typecheck" "sensor cell SSR: full suite listed"
assert "$HTML" "Read install.sh before running it." "install: read-the-script link"
assert "$HTML" "install.sh" "install: raw script URL present"
assert "$HTML" "2 reports VACUOUS: a workspace with" "install: VACUOUS exit copy"
assert "$HTML" "RED · a sensor failed" "thesis: RED label"
assert "$HTML" "VACUOUS · zero sensors, nothing proven" "thesis: VACUOUS label"
assert "$HTML" "2 VACUOUS" "how-it-works: VACUOUS chip"
if echo "$HTML" | rg -q "2 config error"; then echo "FAIL: old '2 config error' still present"; FAIL=1; else echo "PASS: old exit-2 copy gone"; fi
N=$(echo "$HTML" | rg -o 'style="opacity:0' | wc -l)
if [ "$N" -eq 0 ]; then echo "PASS: no inline opacity:0 in SSR HTML (no-JS renders visible)"; else echo "FAIL: $N inline opacity:0 styles in SSR HTML"; FAIL=1; fi
N=$(echo "$HTML" | rg -o 'data-reveal' | wc -l)
echo "INFO: $N data-reveal blocks (CSS-gated, no inline styles)"

echo "== detector re-scan: source =="
$IMPECCABLE detect --json src/app src/components > /tmp/verify-source.json; echo "source exit=$?"
echo "== detector re-scan: rendered desktop =="
$IMPECCABLE detect --json --viewport 1440x900 http://localhost:$PORT > /tmp/verify-desktop.json; echo "desktop exit=$?"

python3 - << 'EOF'
import json
for name in ("verify-source", "verify-desktop"):
    with open(f"/tmp/{name}.json") as f:
        data = json.load(f)
    findings = data if isinstance(data, list) else data.get("findings", [])
    from collections import Counter
    counts = Counter(x.get("rule", x.get("id", "?")) for x in findings)
    print(name, "->", sum(counts.values()), "findings:", dict(counts))
EOF

echo "== done (FAIL=$FAIL) =="
