import { Reveal } from './reveal'

const FEEDFORWARD = [
  {
    term: 'AGENTS.md',
    text: 'The routing and completion contract an agent loads first, generated for your repo.',
  },
  {
    term: '.agents/skills/',
    text: 'Markdown skills with executable evals, loaded before coding starts.',
  },
  {
    term: 'skills suggest',
    text: 'Ranks skills by metadata so the agent loads the right guide for the task.',
  },
  {
    term: 'learn and distill',
    text: 'Draft new skills from sensors that keep firing, then fold them back into the guides.',
  },
]

const FEEDBACK = [
  {
    term: 'Sensors',
    text: 'fmt, clippy, tests, typecheck, lint, build: selected for your stack by a language pack.',
  },
  {
    term: 'Git hooks',
    text: 'pre-commit runs the fast set, commit-msg checks the message, pre-push runs the full suite.',
  },
  {
    term: 'Strike discipline',
    text: 'A sensor that fails three times in a row is halted, not spammed, until the cause is fixed.',
  },
  {
    term: 'CI gates',
    text: 'Three cadences: per pull request, nightly, and on tag. Each runs verify in strict mode.',
  },
]

function Column({
  title,
  intro,
  items,
}: {
  title: string
  intro: string
  items: { term: string; text: string }[]
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <span className="font-mono text-xs text-signal-ink">{intro}</span>
      </div>
      <dl className="mt-6 space-y-6">
        {items.map((it) => (
          <div key={it.term}>
            <dt className="text-[15px] font-medium">{it.term}</dt>
            <dd className="mt-1 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">
              {it.text}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

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
            decide whether the result is done. Both live in your repo, versioned
            with the code they govern.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Column
              title="Before the code"
              intro="feedforward"
              items={FEEDFORWARD}
            />
          </Reveal>
          <Reveal delay={0.08}>
            <Column
              title="After the code"
              intro="feedback"
              items={FEEDBACK}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
