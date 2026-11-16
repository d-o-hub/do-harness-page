#!/usr/bin/env bash
# Publish: run the production standalone server on :3000 — the upstream
# the sandbox front proxy (:81) routes to. Idempotent: replaces any
# running instance, then verifies both the direct and the front-door
# path. Intentionally NO trap: the server must outlive this script.
set -u
cd /home/z/my-project

pkill -f "standalone/server.js" 2>/dev/null || true
pkill -f "bun server.js" 2>/dev/null || true
sleep 0.5

setsid nohup env NODE_ENV=production FORCE_PORT=3000 bun .next/standalone/server.js </dev/null > /tmp/publish-server.log 2>&1 &
for i in $(seq 1 20); do
  curl -s -o /dev/null --max-time 2 http://localhost:3000 && break
  sleep 0.5
done

OK=0
DIRECT=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000/)
FRONT=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:81/)
echo "direct :3000 -> $DIRECT"
echo "front  :81   -> $FRONT"
[ "$DIRECT" = "200" ] && [ "$FRONT" = "200" ] && OK=1

if [ "$OK" = "1" ]; then
  echo "PUBLISHED: production server live on :3000, fronted by :81"
else
  echo "PUBLISH FAILED - server log:"; tail -20 /tmp/publish-server.log
  exit 1
fi
