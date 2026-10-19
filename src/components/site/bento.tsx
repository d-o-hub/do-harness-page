import Image from 'next/image'
import { Reveal } from './reveal'

const CELLS = [
  {
    title: 'Language packs',
    body: (
      <>
        <div className="flex flex-wrap gap-2">
          <span className="chip">rust</span>
          <span className="chip">node</span>
          <span className="chip">web</span>
          <span className="chip">generic</span>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          The web pack adds axe accessibility, console noise, performance,
          visual diff, and i18n sensors on top of Playwright and Lighthouse.
        </p>
      </>
    ),
    className: 'md:col-span-2',
  },
  {
    title: 'Git hooks',
    body: (
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        <code className="font-mono text-[13px] text-foreground">pre-commit</code>,{' '}
        <code className="font-mono text-[13px] text-foreground">commit-msg</code>,{' '}
        <code className="font-mono text-[13px] text-foreground">pre-push</code>.
        The fast set on commit, the full suite on push.
      </p>
    ),
    className: 'md:col-span-1',
  },
  {
    title: 'Evidence',
    body: (
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        <code className="font-mono text-[13px] text-foreground">
          verify --record
        </code>{' '}
        writes each sensor result into a libSQL store. Workflow events stay
        append-only, and{' '}
        <code className="font-mono text-[13px] text-foreground">
          audit-chain
        </code>{' '}
        recomputes the hash chain to report the first divergence.
      </p>
    ),
    className: 'md:col-span-2',
  },
  {
    title: 'Skills loop',
    body: (
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        skill-creator scaffolds, eval runs fixtures, overlap flags guidance
        that duplicates.
      </p>
    ),
    className: 'md:col-span-1',
  },
  {
    title: 'Metrics',
    body: (
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        <code className="font-mono text-[13px] text-foreground">dora</code>{' '}
        derives deployment metrics straight from git history, deterministic and
        read-only.{' '}
        <code className="font-mono text-[13px] text-foreground">metrics pr</code>{' '}
        reports time-to-green and pushes per green.
      </p>
    ),
    className: 'md:col-span-2',
  },
  {
    title: 'Compliance mapping',
    body: (
      <p className="text-[15px] leading-relaxed text-signal-ink">
        One command prints the mapping to OWASP Agentic Top 10 (2026), NIST AI
        RMF 1.0, the EU AI Act, and SOC 2.
      </p>
    ),
    className: 'md:col-span-2 bg-signal-tint border-transparent',
  },
]

export function Bento() {
  return (
    <section
      id="harness"
      aria-labelledby="harness-heading"
      className="scroll-mt-24 border-t border-border"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2
            id="harness-heading"
            className="max-w-[24ch] text-balance text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.12] tracking-[-0.02em]"
          >
            What init scaffolds
          </h2>
          <p className="mt-5 max-w-[60ch] text-pretty text-[17px] leading-relaxed text-muted-foreground">
            One command writes the contract, the skills, the sensors, and the
            state store into your repository. Existing files are left untouched
            unless you pass --force.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Reveal className="md:col-span-1 md:row-span-2">
            <div className="relative h-64 overflow-hidden rounded-xl border border-border md:h-full md:min-h-[21rem]">
              <Image
                src="/harness-macro.png"
                alt="Macro photograph of machined connector terminals with a green cap"
                fill
                sizes="(min-width: 768px) 25vw, 100vw"
                className="object-cover [filter:saturate(0.88)]"
              />
            </div>
          </Reveal>

          {CELLS.map((cell, i) => (
            <Reveal
              key={cell.title}
              delay={Math.min(i * 0.05, 0.25)}
              className={cell.className}
            >
              <div className="h-full rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm font-medium">{cell.title}</h3>
                <div className="mt-4">{cell.body}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
