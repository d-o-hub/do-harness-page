import { ArrowUp, ArrowUpRight, RotateCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { Reveal } from './reveal'

/* ----------------------------------------------------------------
   Diagram connectors. Pure CSS lines + SVG arrowheads so they
   inherit both themes. Labels mask the line with the section
   background, fieldset-legend style.
----------------------------------------------------------------- */

function ArrowRight({ label }: { label: string }) {
  return (
    <div className="relative flex w-full items-center" aria-hidden="true">
      <div className="flow-line h-[2px] w-full rounded-full" />
      <span className="flow-label left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
        {label}
      </span>
      <svg
        className="flow-arrow absolute right-0"
        width="8"
        height="10"
        viewBox="0 0 8 10"
      >
        <path d="M0 0 8 5 0 10Z" fill="currentColor" />
      </svg>
    </div>
  )
}

function ArrowLeft({ label }: { label: string }) {
  return (
    <div className="relative flex w-full items-center" aria-hidden="true">
      <div className="flow-line h-[2px] w-full rounded-full" />
      <span className="flow-label left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
        {label}
      </span>
      <svg
        className="flow-arrow absolute left-0 rotate-180"
        width="8"
        height="10"
        viewBox="0 0 8 10"
      >
        <path d="M0 0 8 5 0 10Z" fill="currentColor" />
      </svg>
    </div>
  )
}

function ArrowDown({
  label,
  className = 'min-h-20',
}: {
  label: string
  className?: string
}) {
  return (
    <div
      className={`relative flex w-full flex-col items-center ${className}`}
      aria-hidden="true"
    >
      <div className="flow-line w-[2px] flex-1 rounded-full" />
      <span className="flow-label left-1/2 top-1/2 max-w-[9.5rem] -translate-x-1/2 -translate-y-1/2">
        {label}
      </span>
      <svg
        className="flow-arrow absolute bottom-0 rotate-90"
        width="8"
        height="10"
        viewBox="0 0 8 10"
      >
        <path d="M0 0 8 5 0 10Z" fill="currentColor" />
      </svg>
    </div>
  )
}

function FlowArrowUp({
  label,
  signal = false,
  className = 'min-h-20',
}: {
  label: string
  signal?: boolean
  className?: string
}) {
  return (
    <div
      className={`relative flex w-full flex-col items-center ${
        signal ? 'flow-signal' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        className="flow-arrow absolute top-0 -rotate-90"
        width="8"
        height="10"
        viewBox="0 0 8 10"
      >
        <path d="M0 0 8 5 0 10Z" fill="currentColor" />
      </svg>
      <div className="flow-line w-[2px] flex-1 rounded-full" />
      <span className="flow-label left-1/2 top-1/2 max-w-[9.5rem] -translate-x-1/2 -translate-y-1/2">
        {label}
      </span>
    </div>
  )
}

/* ----------------------------------------------------------------
   Stage cards. Every fact below comes from the do-harness README:
   commands, flags, exit codes, the 3-strike halt, the append-only
   event log. No invented numbers.
----------------------------------------------------------------- */

type Item = { term: string; text: ReactNode }

function StageCard({
  n,
  kicker,
  title,
  items,
  footer,
}: {
  n: string
  kicker: string
  title: string
  items: Item[]
  footer?: ReactNode
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-[11px] text-muted-foreground">
          {n}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {kicker}
        </span>
      </div>
      <h3 className="mt-4 text-[17px] font-semibold tracking-tight">{title}</h3>
      <dl className="mt-4 flex-1 space-y-4">
        {items.map((it) => (
          <div key={it.term}>
            <dt className="font-mono text-[13px] text-foreground">{it.term}</dt>
            <dd className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
              {it.text}
            </dd>
          </div>
        ))}
      </dl>
      {footer}
    </div>
  )
}

const ENFORCED_AT = (
  <div className="mt-5 border-t border-border pt-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
    enforced at <span className="text-foreground">pre-commit</span> ·{' '}
    <span className="text-foreground">commit-msg</span> ·{' '}
    <span className="text-foreground">pre-push</span> ·{' '}
    <span className="text-foreground">CI --strict</span>
  </div>
)

const EXIT_CODES = (
  <span className="inline-flex flex-wrap items-center gap-1.5">
    <span className="chip chip-tinted h-7">0 GREEN</span>
    <span className="chip h-7">1 RED</span>
    <span className="chip h-7">2 config error</span>
  </span>
)

export function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      className="scroll-mt-24 border-t border-border"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2
            id="how-heading"
            className="max-w-[24ch] text-balance text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.12] tracking-[-0.02em]"
          >
            One contract, read in two directions.
          </h2>
          <p className="mt-5 max-w-[60ch] text-pretty text-[17px] leading-relaxed text-muted-foreground">
            Feedforward guides shape what the agent writes. Feedback sensors
            decide whether the result is done. Both live in your repo,
            versioned with the code they govern. init wires the loop once;
            every change after that travels the same circle.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          {/* Entry point: the one-time scaffold, kept visually apart from the loop. */}
          <div className="mt-10 flex flex-col gap-3 rounded-xl border border-dashed border-border bg-card/60 px-5 py-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex shrink-0 items-center gap-2.5">
              <code className="font-mono text-[13px] text-foreground">
                $ do-harness init
              </code>
              <span className="chip h-6 text-[11px] text-muted-foreground">
                one-time
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Detects the language pack, writes{' '}
              <span className="font-mono text-[12px] text-foreground">
                AGENTS.md
              </span>
              ,{' '}
              <span className="font-mono text-[12px] text-foreground">
                do-harness.toml
              </span>
              ,{' '}
              <span className="font-mono text-[12px] text-foreground">
                plans/invariants.json
              </span>{' '}
              and{' '}
              <span className="font-mono text-[12px] text-foreground">
                .agents/skills/
              </span>
              , seeds the libSQL state, and reports the first verdict.
            </p>
          </div>

          {/* The loop: 2x2 clockwise on desktop, vertical stack on mobile. */}
          <div className="mt-4 grid grid-cols-1 gap-x-6 lg:grid-cols-[minmax(0,1fr)_12rem_minmax(0,1fr)] lg:gap-y-0">
            {/* 01 feedforward */}
            <div className="lg:col-start-1 lg:row-start-1">
              <StageCard
                n="01"
                kicker="before the code"
                title="Feedforward"
                items={[
                  {
                    term: 'AGENTS.md',
                    text: 'The routing and completion contract, generated for the repo.',
                  },
                  {
                    term: '.agents/skills/',
                    text: 'Markdown guides with executable evals, versioned next to the code they govern.',
                  },
                  {
                    term: 'skills suggest',
                    text: 'Ranks skills by metadata so the agent loads exactly one body.',
                  },
                ]}
              />
            </div>
            <div className="lg:hidden">
              <ArrowDown label="agent loads the guide" />
            </div>

            {/* 02 agent execution */}
            <div className="mt-4 lg:col-start-3 lg:row-start-1 lg:mt-0">
              <StageCard
                n="02"
                kicker="during the change"
                title="Agent execution"
                items={[
                  {
                    term: 'task add / advance',
                    text: 'Work enters the board as tasks with sensor-gated completion.',
                  },
                  {
                    term: 'edit and run',
                    text: 'The agent codes in the repo; the harness never drives the editor.',
                  },
                  {
                    term: 'trace add',
                    text: 'Each executed command and its resolution is recorded per session.',
                  },
                ]}
              />
            </div>
            <div className="lg:hidden">
              <ArrowDown label="every change must pass" />
            </div>

            {/* 03 feedback */}
            <div className="mt-4 lg:col-start-3 lg:row-start-3 lg:mt-0">
              <StageCard
                n="03"
                kicker="after the code"
                title="Feedback sensors"
                items={[
                  {
                    term: 'do-harness verify',
                    text: 'Runs the sensor suite the pack selects: fmt, clippy, test, typecheck, build.',
                  },
                  { term: 'exit codes', text: EXIT_CODES },
                  {
                    term: '--record',
                    text: 'Every result becomes a beat; 3 consecutive failures halt a sensor.',
                  },
                ]}
                footer={ENFORCED_AT}
              />
            </div>
            <div className="lg:hidden">
              <ArrowDown label="results become evidence" />
            </div>

            {/* 04 state and learning */}
            <div className="mt-4 lg:col-start-1 lg:row-start-3 lg:mt-0">
              <StageCard
                n="04"
                kicker="between runs"
                title="State and learning"
                items={[
                  {
                    term: 'agent_state.db',
                    text: 'Tasks, the append-only workflow_events log, beats, and error signatures, in libSQL.',
                  },
                  {
                    term: '--evidence',
                    text: 'verify writes machine-readable proof that CI consumes in strict mode.',
                  },
                  {
                    term: 'distill, learn --draft',
                    text: 'Repeated failures become new skills, folded back into .agents/skills/.',
                  },
                ]}
              />
            </div>

            {/* Mobile loop-back strip. */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-signal/40 bg-signal-tint px-5 py-4 lg:hidden">
              <ArrowUp className="size-4 shrink-0 text-signal" aria-hidden="true" />
              <p className="font-mono text-[12px] leading-relaxed text-signal-ink">
                distilled skills fold back into .agents/skills/ · the loop
                closes
              </p>
            </div>

            {/* Desktop loop connectors. */}
            <div className="hidden lg:col-start-2 lg:row-start-1 lg:flex lg:items-center lg:px-1">
              <ArrowRight label="agent loads the guide" />
            </div>
            <div className="hidden lg:col-start-1 lg:row-start-2 lg:flex lg:py-3">
              <FlowArrowUp
                signal
                label="skills fold back in"
                className="min-h-28 flex-1"
              />
            </div>
            <div className="hidden lg:col-start-2 lg:row-start-2 lg:flex lg:items-center lg:justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-14 items-center justify-center rounded-full border border-border bg-card">
                  <RotateCw className="size-5 text-signal" aria-hidden="true" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  the loop
                </span>
              </div>
            </div>
            <div className="hidden lg:col-start-3 lg:row-start-2 lg:flex lg:py-3">
              <ArrowDown label="every change must pass" className="min-h-28 flex-1" />
            </div>
            <div className="hidden lg:col-start-2 lg:row-start-3 lg:flex lg:items-center lg:px-1">
              <ArrowLeft label="results become evidence" />
            </div>
          </div>

          {/* Caption + docs link. */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              fig. 1 · the harness loop
            </p>
            <a
              href="https://github.com/d-o-hub/do-harness/blob/main/docs/adoption.md"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground underline-offset-4 hover:underline"
            >
              Per-ecosystem quickstarts in docs/adoption.md
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
