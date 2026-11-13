#!/usr/bin/env bash
# Audit re-probes: proper contrast (oklch->srgb via canvas), reduced-motion emulation check, skip-link focus visibility.
set -u
cd /home/z/my-project
PORT=3103
cleanup() { pkill -f "standalone/server.js" 2>/dev/null; true; }
trap cleanup EXIT
setsid nohup env PORT=$PORT NODE_ENV=production bun .next/standalone/server.js </dev/null > /tmp/audit-server2.log 2>&1 &
for i in $(seq 1 20); do curl -s -o /dev/null --max-time 2 http://localhost:$PORT && break; sleep 0.5; done
curl -s -o /dev/null --max-time 5 http://localhost:$PORT || { echo "FATAL: server not up"; exit 1; }

AB() { agent-browser "$@"; }
AB set viewport 1440 900
AB open http://localhost:$PORT
sleep 2

CONTRAST_JS='(() => {
  const cv = document.createElement("canvas").getContext("2d");
  const toRGB = (c) => { cv.fillStyle = c; const v = cv.fillStyle; return v.startsWith("#") ? v : v; };
  const parse = (c) => { const s = toRGB(c); const m = s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/) || s.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i); if (!m) return null; if (s.startsWith("#")) return [parseInt(m[1],16), parseInt(m[2],16), parseInt(m[3],16), 1]; return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]]; };
  const lum = (rgba) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(rgba[0]) + 0.7152 * f(rgba[1]) + 0.0722 * f(rgba[2]); };
  const ratio = (fg, bg) => { const l1 = lum(fg), l2 = lum(bg); return ((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)).toFixed(2); };
  const probe = (name, sel) => {
    const el = document.querySelector(sel);
    if (!el) return name + ": MISSING";
    const cs = getComputedStyle(el);
    const fg = parse(cs.color);
    let bgEl = el, bg = null;
    while (bgEl) { const c = cs2(bgEl).backgroundColor; if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") { bg = parse(c); if (bg && bg[3] === 1) break; } bgEl = bgEl.parentElement; }
    if (!fg || !bg) return name + ": parse-fail";
    return name + ": " + ratio(fg, bg) + (parseFloat(ratio(fg,bg)) < 4.5 ? " LOW" : "") + " (" + cs.fontSize + ")";
  };
  const cs2 = (el) => getComputedStyle(el);
  return [probe("body-ink","main p"), probe("muted-lead",".enter.mt-6"), probe("muted-11px","p.font-mono.text-\\[11px\\]"), probe("cmd-code",".cmd code"), probe("chip-tinted",".chip-tinted"), probe("footer-xs","footer p.text-xs"), probe("flow-label",".flow-label"), probe("trust-label","section[aria-label=\"Compatible tooling\"] span.font-mono")].join(" | ");
})()'

echo "== contrast light (canvas-converted) =="
AB eval "$CONTRAST_JS"
AB set media dark; sleep 1
echo "== contrast dark (canvas-converted) =="
AB eval "$CONTRAST_JS"
AB set media light; sleep 1

echo "== reduced-motion emulation validity =="
AB set media reduce; sleep 1
AB eval '"matches reduce: " + matchMedia("(prefers-reduced-motion: reduce)").matches + " | matches dark: " + matchMedia("(prefers-color-scheme: dark)").matches'
AB eval '(async () => {
  const de = document.documentElement; de.style.scrollBehavior = "auto";
  const h = document.body.scrollHeight; for (let y = 0; y <= h; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
  window.scrollTo(0, 0); de.style.scrollBehavior = "";
  const dot = document.querySelector(".flow-dot");
  const probe = document.querySelector(".enter");
  const sm = getComputedStyle(probe);
  const cv = document.createElement("canvas").getContext("2d");
  cv.fillStyle = "oklch(0.5 0.1 150)";
  return ".flow-dot present=" + !!dot + " display=" + (dot ? getComputedStyle(dot).display : "n/a") + " | .enter animation=" + sm.animationName + " duration=" + sm.animationDuration + " | canvas-oklch-support=" + (cv.fillStyle.includes("oklch") ? "NO" : "yes");
})()'
AB set media no-preference; sleep 1

echo "== skip link focus visibility =="
AB eval '(() => {
  const s = document.querySelector("a[href=\"#top\"]");
  if (!s) return "no skip link";
  const cls = s.className;
  s.focus();
  const st = getComputedStyle(s);
  const r = s.getBoundingClientRect();
  return "skip classes=[" + cls.slice(0, 120) + "] focused rect=" + Math.round(r.width) + "x" + Math.round(r.height) + " left=" + Math.round(r.left) + " top=" + Math.round(r.top);
})()'
echo DONE-REPROBE
