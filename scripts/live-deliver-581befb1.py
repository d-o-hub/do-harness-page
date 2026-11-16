#!/usr/bin/env python3
"""Deliver 3 live-mode variants for event 581befb1 (hero CTA hierarchy).

Splices preview CSS + 3 variant divs into the scaffold wrapperBlock at the
"Variants: insert below this line" marker, then replaces line 25 of
scripts/page-render.html with the result in ONE atomic edit.
"""
import json, sys

EVENT_ID = "581befb1"
POLL = "/tmp/live-poll.jsonl"
TARGET = "/home/z/my-project/scripts/page-render.html"
MARKER = "<!-- Variants: insert below this line -->"

ARROW = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>'
COPY = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>'
HREF = "https://github.com/d-o-hub/do-harness/blob/main/docs/adoption.md"

STYLE = '''<style data-impeccable-css="''' + EVENT_ID + '''">
  /* V1 - hierarchy swap: command primary, guide ghost */
  @scope ([data-impeccable-variant="1"]) {
    :scope > .v1-root .v1-cmd {
      background: var(--card);
      border-color: color-mix(in oklab, var(--foreground) calc(16% + var(--p-command-emphasis, 0.55) * 24%), var(--border));
      box-shadow:
        0 1px 2px oklch(0 0 0 / calc(var(--p-command-emphasis, 0.55) * 0.05)),
        0 6px 16px oklch(0 0 0 / calc(var(--p-command-emphasis, 0.55) * 0.08));
    }
    :scope > .v1-root .v1-copy {
      background: var(--primary);
      color: var(--primary-foreground);
      transition: background-color 150ms var(--ease-out-strong, ease-out);
    }
    :scope > .v1-root[data-p-guide-style="button"] .v1-guide {
      height: 2.75rem;
      padding: 0 1.25rem;
      border-radius: calc(var(--radius) - 2px);
      background: var(--background);
      color: var(--foreground);
      border: 1px solid var(--border);
      font-size: 0.9375rem;
    }
    @media (hover: hover) and (pointer: fine) {
      :scope > .v1-root .v1-copy:hover {
        background: color-mix(in oklab, var(--primary) 86%, var(--background));
      }
      :scope > .v1-root .v1-guide:hover { color: var(--foreground); }
      :scope > .v1-root[data-p-guide-style="button"] .v1-guide:hover {
        background: var(--muted);
        border-color: color-mix(in oklab, var(--foreground) 26%, var(--border));
      }
    }
  }

  /* V2 - stacked deck: full-width command bar, guide row below */
  @scope ([data-impeccable-variant="2"]) {
    :scope > .v2-root .v2-cmd {
      background: var(--card);
      border-color: color-mix(in oklab, var(--foreground) 30%, var(--border));
      box-shadow:
        0 1px 2px oklch(0 0 0 / 0.05),
        0 6px 16px oklch(0 0 0 / 0.07);
    }
    :scope > .v2-root .v2-copy {
      background: var(--primary);
      color: var(--primary-foreground);
      transition: background-color 150ms var(--ease-out-strong, ease-out);
    }
    :scope > .v2-root[data-p-command-size="lg"] .v2-cmd {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
    :scope > .v2-root[data-p-command-size="lg"] .v2-code { font-size: 0.9375rem; }
    :scope > .v2-root .v2-guide { text-underline-offset: 4px; }
    @media (hover: hover) and (pointer: fine) {
      :scope > .v2-root .v2-copy:hover {
        background: color-mix(in oklab, var(--primary) 86%, var(--background));
      }
      :scope > .v2-root .v2-guide:hover {
        color: var(--foreground);
        text-decoration: underline;
      }
    }
  }

  /* V3 - instrument strip: one segmented surface */
  @scope ([data-impeccable-variant="3"]) {
    :scope > .v3-root {
      background: var(--card);
      border: 1px solid var(--border);
      box-shadow:
        0 1px 2px oklch(0 0 0 / 0.04),
        0 6px 16px oklch(0 0 0 / 0.06);
    }
    :scope > .v3-root .v3-cmd {
      background: transparent;
      border: none;
      border-radius: 0;
    }
    :scope > .v3-root .v3-copy {
      background: var(--primary);
      color: var(--primary-foreground);
      transition: background-color 150ms var(--ease-out-strong, ease-out);
    }
    :scope > .v3-root .v3-guide {
      color: color-mix(in oklab, var(--muted-foreground) calc(100% - var(--p-guide-tone, 0.35) * 100%), var(--foreground));
      transition: color 150ms var(--ease-out-strong, ease-out), background-color 150ms var(--ease-out-strong, ease-out);
    }
    :scope > .v3-root[data-p-divider="hidden"] .v3-divider { display: none; }
    @media (hover: hover) and (pointer: fine) {
      :scope > .v3-root .v3-copy:hover {
        background: color-mix(in oklab, var(--primary) 86%, var(--background));
      }
      :scope > .v3-root .v3-guide:hover { background: var(--muted); }
    }
  }
</style>'''

V1_PARAMS = '[{"id":"command-emphasis","kind":"range","min":0,"max":1,"step":0.05,"default":0.55,"label":"Command emphasis"},{"id":"guide-style","kind":"steps","default":"ghost","label":"Guide style","options":[{"value":"ghost","label":"Ghost link"},{"value":"button","label":"Quiet button"}]}]'
V2_PARAMS = '[{"id":"command-size","kind":"steps","default":"md","label":"Command size","options":[{"value":"md","label":"Medium"},{"value":"lg","label":"Large"}]},{"id":"stack-gap","kind":"range","min":8,"max":24,"step":2,"default":14,"label":"Stack gap"}]'
V3_PARAMS = '[{"id":"guide-tone","kind":"range","min":0,"max":1,"step":0.05,"default":0.35,"label":"Guide tone"},{"id":"divider","kind":"steps","default":"shown","label":"Divider","options":[{"value":"shown","label":"Shown"},{"value":"hidden","label":"Hidden"}]}]'

V1 = f'''<div data-impeccable-variant="1" data-impeccable-params='{V1_PARAMS}'>
  <div class="v1-root mt-8 flex flex-wrap items-center gap-3">
    <div class="cmd v1-cmd flex items-center gap-2 py-2 pl-4 pr-2" data-copy-row="true">
      <code data-copy-text="true" class="whitespace-nowrap font-mono text-sm font-medium text-foreground">npx do-harness init</code>
      <button type="button" class="v1-copy relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-3 font-mono text-[13px] font-medium" aria-label="Copy command">{COPY}<span aria-hidden="true">Copy</span><span role="status" aria-live="polite" class="sr-only"></span></button>
    </div>
    <a href="{HREF}" target="_blank" rel="noopener noreferrer" class="v1-guide inline-flex items-center gap-1 text-[15px] font-medium text-muted-foreground transition-colors duration-150">Read the adoption guide {ARROW}</a>
  </div>
</div>'''

V2 = f'''<div data-impeccable-variant="2" style="display: none" data-impeccable-params='{V2_PARAMS}'>
  <div class="v2-root mt-8 flex w-full flex-col" style="gap: var(--p-stack-gap, 14px)">
    <div class="cmd v2-cmd flex w-full items-center gap-3 py-2.5 pl-4 pr-2.5" data-copy-row="true">
      <span class="select-none font-mono text-[13px] text-muted-foreground" aria-hidden="true">$</span>
      <code data-copy-text="true" class="v2-code min-w-0 flex-1 truncate font-mono text-sm font-medium text-foreground">npx do-harness init</code>
      <button type="button" class="v2-copy relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-3.5 font-mono text-[13px] font-medium" aria-label="Copy command">{COPY}<span aria-hidden="true">Copy</span><span role="status" aria-live="polite" class="sr-only"></span></button>
    </div>
    <a href="{HREF}" target="_blank" rel="noopener noreferrer" class="v2-guide inline-flex w-fit items-center gap-1 text-[15px] font-medium text-muted-foreground transition-colors duration-150">Read the adoption guide {ARROW}</a>
  </div>
</div>'''

V3 = f'''<div data-impeccable-variant="3" style="display: none" data-impeccable-params='{V3_PARAMS}'>
  <div class="v3-root mt-8 inline-flex items-stretch overflow-hidden rounded-[10px]">
    <div class="cmd v3-cmd flex items-center gap-2.5 py-2.5 pl-4 pr-3" data-copy-row="true">
      <code data-copy-text="true" class="whitespace-nowrap font-mono text-sm font-medium text-foreground">npx do-harness init</code>
      <button type="button" class="v3-copy relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2.5 font-mono text-xs font-medium" aria-label="Copy command">{COPY}<span aria-hidden="true">Copy</span><span role="status" aria-live="polite" class="sr-only"></span></button>
    </div>
    <div class="v3-divider w-px shrink-0" style="background: var(--border)" aria-hidden="true"></div>
    <a href="{HREF}" target="_blank" rel="noopener noreferrer" class="v3-guide inline-flex items-center gap-1.5 whitespace-nowrap px-4 font-mono text-[13px] font-medium">Adoption guide {ARROW}</a>
  </div>
</div>'''


def main():
    with open(POLL) as f:
        events = [json.loads(l) for l in f if l.strip().startswith("{")]
    ev = [e for e in events if e.get("type") == "generate" and e["id"] == EVENT_ID][-1]
    wb = ev["scaffold"]["wrapperBlock"]

    assert MARKER in wb, "marker not found in wrapperBlock"
    assert wb.count('data-impeccable-variant="original"') == 1
    head, tail = wb.split(MARKER, 1)
    block = head + MARKER + "\n" + STYLE + "\n" + V1 + "\n" + V2 + "\n" + V3 + tail

    with open(TARGET) as f:
        content = f.read()
    lines = content.split("\n")
    assert lines[24].startswith('})("class"'), "line 25 is not the page line: " + lines[24][:60]
    lines[24] = block
    with open(TARGET, "w") as f:
        f.write("\n".join(lines))

    check = open(TARGET).read()
    for probe in ['data-impeccable-variant="1"', 'data-impeccable-variant="2"',
                  'data-impeccable-variant="3"', f'data-impeccable-css="{EVENT_ID}"',
                  MARKER, 'data-impeccable-variants="' + EVENT_ID + '"']:
        assert probe in check, f"missing {probe}"
    n_variants = check.count('data-impeccable-variant="')
    print(f"OK: wrote {len(block)} chars to {TARGET}, variant attrs: {n_variants}")


if __name__ == "__main__":
    main()
