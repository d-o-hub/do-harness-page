#!/usr/bin/env bash
# $impeccable audit / - evidence gathering. One process (sandbox reaps bg servers).
set -u
cd /home/z/my-project
mkdir -p /tmp/audit
PORT=3103
CHROME=/home/z/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome
export IMPECCABLE_BROWSER=$CHROME
IMPECCABLE=".agents/skills/impeccable/scripts/impeccable"
cleanup() { pkill -f "standalone/server.js" 2>/dev/null; true; }
trap cleanup EXIT

setsid nohup env PORT=$PORT NODE_ENV=production bun .next/standalone/server.js </dev/null > /tmp/audit-server.log 2>&1 &
for i in $(seq 1 20); do curl -s -o /dev/null --max-time 2 http://localhost:$PORT && break; sleep 0.5; done
curl -s -o /dev/null --max-time 5 http://localhost:$PORT || { echo "FATAL: server not up"; exit 1; }
echo "== server up on $PORT =="

echo "== detector: source / desktop / mobile =="
$IMPECCABLE detect --json src/app src/components > /tmp/audit/source.json; echo "source exit=$?"
$IMPECCABLE detect --json --viewport 1440x900 http://localhost:$PORT > /tmp/audit/desktop.json; echo "desktop exit=$?"
$IMPECCABLE detect --json --viewport 390x844 http://localhost:$PORT > /tmp/audit/mobile.json; echo "mobile exit=$?"

AB() { agent-browser "$@"; }
AB set viewport 1440 900
AB open http://localhost:$PORT
sleep 2

echo "== contrast: light =="
AB eval '(() => {
  const pairs = [];
  const lum = (rgb) => {
    const m = rgb.match(/[\d.]+/g).map(Number);
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]);
  };
  const ratio = (fg, bg) => { const l1 = lum(fg), l2 = lum(bg); return ((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)).toFixed(2); };
  const cs = (el) => getComputedStyle(el);
  const probe = (name, sel) => {
    const el = document.querySelector(sel);
    if (!el) { pairs.push(name + ": MISSING"); return; }
    let bgEl = el, bg = "transparent";
    while (bgEl && bgEl !== document.documentElement) {
      bg = cs(bgEl).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") break;
      bgEl = bgEl.parentElement;
    }
    pairs.push(name + ": " + ratio(cs(el).color, bg) + " (" + cs(el).fontSize + ")");
  };
  probe("body", "body");
  probe("muted-lead", ".enter.mt-6");
  probe("kicker", "p.font-mono.text-\\[11px\\]");
  probe("cmd-text", ".cmd code");
  probe("signal-ink-chip", ".chip-tinted");
  probe("footer-xs", "footer p.text-xs");
  probe("flow-label", ".flow-label");
  return pairs.join(" | ");
})()'

echo "== contrast: dark =="
AB set media dark; sleep 1
AB eval '(() => {
  const lum = (rgb) => { const m = rgb.match(/[\d.]+/g).map(Number); const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
  const ratio = (fg, bg) => { const l1 = lum(fg), l2 = lum(bg); return ((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)).toFixed(2); };
  const cs = (el) => getComputedStyle(el);
  const probe = (name, sel) => {
    const el = document.querySelector(sel);
    if (!el) { return name + ": MISSING"; }
    let bgEl = el, bg = "transparent";
    while (bgEl && bgEl !== document.documentElement) { bg = cs(bgEl).backgroundColor; if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") break; bgEl = bgEl.parentElement; }
    return name + ": " + ratio(cs(el).color, bg);
  };
  return [probe("body","body"), probe("muted-lead",".enter.mt-6"), probe("cmd-text",".cmd code"), probe("footer-xs","footer p.text-xs"), probe("signal-ink-chip",".chip-tinted")].join(" | ");
})()'
AB set media light; sleep 1

echo "== touch targets at 390 =="
AB set viewport 390 844; sleep 1
AB eval '(() => {
  const bad = [];
  document.querySelectorAll("a, button").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    if (r.width < 24 || r.height < 24) bad.push((el.getAttribute("aria-label") || el.textContent.trim().slice(0, 18)) + " " + Math.round(r.width) + "x" + Math.round(r.height));
  });
  return bad.length ? bad.join(" | ") : "all >= 24px (WCAG 2.5.8)";
})()'

echo "== horizontal scroll at widths =="
AB eval '(() => {
  const out = [];
  const check = () => out.push(document.documentElement.clientWidth + ":" + (document.documentElement.scrollWidth > document.documentElement.clientWidth ? "OVERFLOW " + document.documentElement.scrollWidth : "ok"));
  check();
  return out.join(" | ");
})()'
AB set viewport 320 700; sleep 1
AB eval '"320w: " + (document.documentElement.scrollWidth > document.documentElement.clientWidth ? "OVERFLOW " + document.documentElement.scrollWidth : "ok")'
AB set viewport 768 900; sleep 1
AB eval '"768w: " + (document.documentElement.scrollWidth > document.documentElement.clientWidth ? "OVERFLOW " + document.documentElement.scrollWidth : "ok")'

echo "== 200% text zoom =="
AB set viewport 1440 900; sleep 1
AB eval '(() => {
  document.documentElement.style.zoom = "2";
  const over = document.documentElement.scrollWidth > document.documentElement.clientWidth;
  const cmdOver = [...document.querySelectorAll(".cmd")].filter(c => c.scrollWidth > c.clientWidth + 2).length;
  document.documentElement.style.zoom = "";
  return "zoom200: html" + (over ? " OVERFLOW" : " ok") + " | .cmd rows with inner scroll: " + cmdOver;
})()'

echo "== keyboard: skip link + tab order =="
AB eval '(() => {
  const skip = document.querySelector("a[href=\"#top\"], a.skip-link, a[href^=\"#\"]");
  const first = document.activeElement;
  const focusables = [...document.querySelectorAll("a, button")].filter(el => el.offsetParent !== null || el === first);
  const ring = getComputedStyle(document.documentElement).getPropertyValue("--ring");
  return "focusables:" + focusables.length + " | skip-link:" + (document.querySelector("[class*=skip], a[href=\"#top\"]") ? "present" : "MISSING") + " | --ring: " + (ring.trim() || "MISSING");
})()'
AB eval '(() => { const s = document.querySelector("a[href=\"#top\"]"); if (!s) return "no skip"; s.focus(); const st = getComputedStyle(s); return "skip-link focused opacity:" + st.opacity + " pos:" + st.position; })()'

echo "== reduced motion =="
AB eval '(async () => {
  const de = document.documentElement; de.style.scrollBehavior = "auto";
  const h = document.body.scrollHeight; for (let y = 0; y <= h; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
  window.scrollTo(0, 0);
  return "warm ok";
})()'
AB set media reduce; sleep 1
AB eval '(() => {
  const dot = document.querySelector(".flow-dot");
  const dotDisplay = dot ? getComputedStyle(dot).display : "no-dot-in-dom";
  const probe = document.querySelector(".enter, [data-reveal]");
  const anim = probe ? getComputedStyle(probe).animationName : "?";
  return "reduced-motion: .flow-dot display=" + dotDisplay + " | first enter/reveal animation-name=" + anim;
})()'
AB set media no-preference; sleep 1

echo "== will-change / framer / long tasks =="
AB eval '(() => {
  const wc = [...document.querySelectorAll("*")].filter(el => getComputedStyle(el).willChange && getComputedStyle(el).willChange !== "auto").length;
  return "elements with will-change: " + wc;
})()'
rg -l "framer-motion" src/ | head -5 || echo "framer-motion: not imported in src"
echo "== bundle: top chunks =="
du -k .next/static/chunks/*.js 2>/dev/null | sort -rn | head -5 || true
echo DONE-AUDIT-SCAN
