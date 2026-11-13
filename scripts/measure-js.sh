#!/usr/bin/env bash
# Measure client JS transfer for / : decoded (gzip-served) byte total of
# every script tag in the SSR HTML + the HTML document itself.
# Usage: bash scripts/measure-js.sh [port]
set -u
PORT="${1:-3105}"
cleanup() { pkill -f "standalone/server.js" 2>/dev/null; }
trap cleanup EXIT
cd /home/z/my-project
setsid nohup env PORT=$PORT NODE_ENV=production bun .next/standalone/server.js </dev/null > /tmp/measure-server.log 2>&1 &
for i in $(seq 1 20); do curl -s -o /dev/null --max-time 2 http://localhost:$PORT && break; sleep 0.5; done
curl -s -o /dev/null --max-time 5 http://localhost:$PORT || { echo "FATAL: server not up"; exit 1; }

python3 - "$PORT" << 'EOF'
import subprocess, re, sys, os, gzip
port = sys.argv[1]
html = subprocess.run(
    ["curl", "-s", f"http://localhost:{port}/"],
    capture_output=True, text=True).stdout
srcs = re.findall(r'<script[^>]+src="(/_next/static/[^"]+\.js)"', html)
total_raw = total_gz = 0
framer_gz = 0.0
for s in sorted(set(srcs)):
    subprocess.run(
        ["curl", "-s", "-o", "/tmp/_chunk.js",
         f"http://localhost:{port}{s}"],
        capture_output=True)
    with open("/tmp/_chunk.js", "rb") as f:
        data = f.read()
    total_raw += len(data)
    gz = len(gzip.compress(data, 9))
    total_gz += gz
    if "framer" in data.decode("utf8", "ignore").lower() or "MotionConfig" in data.decode("utf8", "ignore"):
        framer_gz += gz
html_size = len(html.encode())
print(f"scripts: {len(set(srcs))} unique")
print(f"JS total raw:  {total_raw/1024:.1f} KB")
print(f"JS total gzip: {total_gz/1024:.1f} KB")
print(f"framer-bearing chunks (gzip): {framer_gz/1024:.1f} KB")
print(f"HTML document: {html_size/1024:.1f} KB")
EOF
echo DONE-MEASURE
