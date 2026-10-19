import { BrandMark } from './nav'

const PROJECT_LINKS = [
  { href: 'https://github.com/d-o-hub/do-harness', label: 'Source on GitHub' },
  { href: 'https://github.com/d-o-hub/do-harness/releases', label: 'Releases' },
  {
    href: 'https://github.com/d-o-hub/do-harness/blob/main/LICENSE',
    label: 'MIT license',
  },
]

const DOC_LINKS = [
  {
    href: 'https://github.com/d-o-hub/do-harness/blob/main/docs/adoption.md',
    label: 'Adoption guide',
  },
  {
    href: 'https://github.com/d-o-hub/do-harness/blob/main/docs/skills.md',
    label: 'Skills catalog',
  },
  {
    href: 'https://github.com/d-o-hub/do-harness/blob/main/docs/compliance.md',
    label: 'Compliance mapping',
  },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-5 py-14 md:grid-cols-12 md:px-8">
        <div className="md:col-span-6">
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <span className="text-[17px] font-semibold tracking-tight">
              do-harness
            </span>
          </div>
          <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
            Feedforward guides plus feedback sensors for agent-driven
            development. MIT licensed, built in the open.
          </p>
        </div>

        <nav aria-label="Project" className="md:col-span-3">
          <h3 className="text-sm font-medium">Project</h3>
          <ul className="mt-4 space-y-3">
            {PROJECT_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Documentation" className="md:col-span-3">
          <h3 className="text-sm font-medium">Documentation</h3>
          <ul className="mt-4 space-y-3">
            {DOC_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-5 py-5 md:px-8">
          <p className="text-xs text-muted-foreground">
            Copyright 2026 d-o-hub contributors
          </p>
          <p className="text-xs text-muted-foreground">
            Rust and libSQL under the hood
          </p>
        </div>
      </div>
    </footer>
  )
}
