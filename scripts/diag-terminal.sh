#!/usr/bin/env bash
# Focused prod diagnostic for the RED terminal (thesis section).
set -u
cd /home/z/my-project
PORT=3100
cleanup() { pkill -f "standalone/server.js" 2>/dev/null; }
trap cleanup EXIT
setsid nohup env PORT=$PORT NODE_ENV=production bun .next/standalone/server.js </dev/null > server-qa.log 2>&1 &
sleep 3
agent-browser set viewport 1440 900
agent-browser open http://localhost:$PORT
sleep 3
agent-browser eval "window.matchMedia('(prefers-reduced-motion: reduce)').matches"
agent-browser eval "(() => { const p = document.querySelector('[aria-label^=\"Terminal replay\"]'); if (!p) return 'PANEL NOT FOUND'; return 'panel found, role=' + p.getAttribute('role'); })()"
agent-browser eval "(() => { const p = document.querySelector('[aria-label^=\"Terminal replay\"]'); const hidden = p.querySelectorAll('[aria-hidden=\"true\"]'); return 'aria-hidden nodes inside panel: ' + hidden.length; })()"
agent-browser eval "(() => { const p = document.querySelector('[aria-label^=\"Terminal replay\"]'); p.scrollIntoView({block:'center'}); const t = p.querySelector('[aria-hidden=\"true\"]'); return JSON.stringify({transcriptChildren: t ? t.children.length : -1, htmlLen: p.innerHTML.length, first80: t ? t.innerHTML.slice(0, 80) : ''}); })()"
sleep 2
agent-browser eval "(() => { const t = document.querySelector('[aria-label^=\"Terminal replay\"] [aria-hidden=\"true\"]'); return 'children after 2s: ' + t.children.length; })()"
