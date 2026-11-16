#!/usr/bin/env python3
"""Build a static variant board for event 581befb1 served from public/.

Extracts the original row + scoped CSS + 3 variant divs from
scripts/page-render.html and writes public/variant-board.html which reuses
the dev server's compiled Tailwind CSS (fonts + tokens included).
"""
import re

SRC = "/home/z/my-project/scripts/page-render.html"
OUT = "/home/z/my-project/public/variant-board.html"

content = open(SRC).read()
style = re.search(r'(<style data-impeccable-css="581befb1">.*?</style>)', content, re.S).group(1)
orig = re.search(r'<div data-impeccable-variant="original">\n\s*(.*?)\n\s*</div>\n\s*<!-- Variants', content, re.S).group(1)
after_style = content.split('<!-- Variants: insert below this line -->', 1)[1]
after_style = after_style.split('<!-- impeccable-variants-end', 1)[0]
after_style = re.sub(r'^\s*</style>', '', after_style.strip())
parts = re.split(r'(?=<div data-impeccable-variant="[123]")', after_style)
parts = [p.strip() for p in parts if p.strip().startswith('<div data-impeccable-variant=')]
assert len(parts) == 3, f"expected 3 variant divs, got {len(parts)}"
# board shows all variants stacked: strip the preview's display:none
parts = [re.sub(r'(<div data-impeccable-variant="[123]") style="display:\s*none"', r'\1', p) for p in parts]

LABELS = [
    ("Original", "the shipped hero CTA row", orig),
    ("V1 · Hierarchy swap", "command first with ink-fill Copy, guide demoted to ghost link — knobs: command emphasis, guide style", parts[0]),
    ("V2 · Stacked topology", "full-width command deck with $ prompt, guide row below — knobs: command size, stack gap", parts[1]),
    ("V3 · Instrument strip", "one segmented surface: command | copy | guide — knobs: guide tone, divider", parts[2]),
]

rows = []
for title, desc, html in LABELS:
    rows.append(f'''
  <section style="margin: 0 0 56px">
    <div style="max-width: 1100px; margin: 0 auto 18px">
      <div style="font-size: 15px; font-weight: 600; letter-spacing: -0.01em">{title}</div>
      <div style="font-family: var(--font-mono); font-size: 12px; color: var(--muted-foreground); margin-top: 4px">{desc}</div>
    </div>
    <div style="max-width: 1100px; margin: 0 auto; border: 1px dashed var(--border); border-radius: 14px; padding: 44px 40px; background: var(--background)">
      {html.replace('mt-8', 'mt-0')}
    </div>
  </section>''')

page = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>CTA hierarchy — variant board</title>
<link rel="stylesheet" href="./_next/static/css/__CSS__">
{style}
<style>
  body {{ background: var(--background); color: var(--foreground); padding: 56px 24px; }}
  .board-title {{ max-width: 1100px; margin: 0 auto 8px; font-size: 22px; font-weight: 600; letter-spacing: -0.02em; }}
  .board-sub {{ max-width: 1100px; margin: 0 auto 44px; font-family: var(--font-mono); font-size: 12px; color: var(--muted-foreground); }}
</style>
</head>
<body>
  <div class="board-title">Hero CTA hierarchy — 3 variants</div>
  <div class="board-sub">event 581befb1 · identity-locked to "instrument report" · signal green untouched (verdicts only)</div>
  {''.join(rows)}
</body>
</html>'''

# resolve the compiled css href from the dev server index
import urllib.request
html = urllib.request.urlopen("http://127.0.0.1:3000/").read().decode()
m = re.search(r'href="(/_next/static/chunks/[^"]+\.css)"', html)
assert m, "no css link found in dev page"
page = page.replace('<link rel="stylesheet" href="./_next/static/css/__CSS__">',
                    f'<link rel="stylesheet" href="{m.group(1)}">')

open(OUT, "w").write(page)
print(f"board written: {OUT} ({len(page)} chars), css: {m.group(1)}")
