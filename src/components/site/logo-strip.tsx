import { siGithubactions, siGit, siNpm, siRust } from 'simple-icons'
import { Reveal } from './reveal'

/**
 * Compatibility strip. Each row pairs a logo with a claim that is
 * checkable elsewhere on this page or in the upstream repo (install
 * methods, hook install, CI dogfood). No customer logos, no tooling
 * the repo does not document.
 */
const CLAIMS = [
  {
    icon: siNpm,
    label: 'zero-install via npx, node 18+',
    title: 'npm',
  },
  {
    icon: siRust,
    label: 'prebuilt binary, no runtime to install',
    title: 'Rust',
  },
  {
    icon: siGit,
    label: 'git hooks gate commits and pushes',
    title: 'Git',
  },
  {
    icon: siGithubactions,
    label: 'CI runs the same gates on every push',
    title: 'GitHub Actions',
  },
]

export function LogoStrip() {
  return (
    <Reveal>
      <section
        aria-label="Compatible tooling"
        className="border-y border-border bg-secondary/40"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-5 py-10 md:flex-row md:items-center md:gap-10 md:px-8">
          <p className="shrink-0 text-sm text-muted-foreground">
            Plugs into the stack you already run
          </p>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-4 text-muted-foreground">
            {CLAIMS.map((c) => (
              <li key={c.title} className="flex items-center gap-2">
                <svg
                  role="img"
                  aria-label={c.title}
                  viewBox="0 0 24 24"
                  className="size-5 shrink-0 fill-current"
                >
                  <path d={c.icon.path} />
                </svg>
                <span className="font-mono text-[12px] leading-snug">
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Reveal>
  )
}
