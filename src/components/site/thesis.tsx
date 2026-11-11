import { RedTerminal } from './red-terminal'
import { Reveal } from './reveal'

const EXIT_CODES = [
  { code: '0', label: 'GREEN · all sensors passed', tone: 'text-signal-ink' },
  { code: '1', label: 'RED · a sensor failed', tone: 'text-destructive' },
  { code: '2', label: 'VACUOUS · zero sensors, nothing proven', tone: 'text-muted-foreground' },
]

/**
 * Thesis section: editorial statement on the left, the real exit-code
 * contract on the right, and below both a scripted terminal that
 * replays the RED loop (strikes, halt, fix, GREEN) with README facts.
 */
export function Thesis() {
  return (
    <section aria-labelledby="thesis-heading" className="scroll-mt-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <h2
            id="thesis-heading"
            className="max-w-[20ch] text-balance text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.12] tracking-[-0.02em]"
          >
            Agents don&rsquo;t fail at writing code. They fail at proving
            it&rsquo;s done.
          </h2>
          <div className="mt-7 max-w-[65ch] space-y-5 text-[17px] leading-relaxed text-muted-foreground">
            <p>
              A chat message that says done is a claim. do-harness turns it
              into evidence: the agent reads guides before it codes, then runs
              computational sensors that the code itself has to pass. Exit code
              0, or the work is not finished.
            </p>
            <p>
              The harness is equally honest about its own limits. A workspace
              with zero sensors produces a vacuous pass, and the CLI reports
              VACUOUS rather than green, because a check that cannot fail
              proves nothing.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium">Exit codes</h3>
            <dl className="mt-4 divide-y divide-border">
              {EXIT_CODES.map((e) => (
                <div key={e.code} className="flex items-baseline gap-4 py-3">
                  <dt className={`w-6 shrink-0 font-mono text-sm ${e.tone}`}>
                    {e.code}
                  </dt>
                  <dd className="text-sm text-muted-foreground">{e.label}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
              <code className="font-mono text-[13px] text-foreground">init</code>{' '}
              reports GREEN, RED, or VACUOUS, and exits non-zero on RED.
            </p>
          </div>
        </Reveal>

        {/* What a RED looks like, replayed. The terminal carries the
            story; one short paragraph anchors it. */}
        <Reveal delay={0.08} className="lg:col-span-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                what red looks like
              </p>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
                A failing run is data. With{' '}
                <code className="font-mono text-[13px] text-foreground">
                  --record
                </code>
                , every sensor result is written to{' '}
                <span className="font-mono text-[12.5px] text-foreground">
                  agent_state.db
                </span>{' '}
                as a beat and bumps that sensor&rsquo;s error signature. Three
                consecutive failures and the sensor is halted: it stops
                running and reports failed until the fix lands. The agent
                cannot argue with a strike counter.
              </p>
            </div>
            <div className="lg:col-span-8">
              <RedTerminal />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
