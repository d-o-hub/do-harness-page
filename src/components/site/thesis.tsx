import { Reveal } from './reveal'

const EXIT_CODES = [
  { code: '0', label: 'All sensors passed' },
  { code: '1', label: 'A sensor failed' },
  { code: '2', label: 'Usage, config, or discovery error' },
]

/**
 * Thesis section: editorial statement on the left, the real exit-code
 * contract on the right. Rows use a single divider convention (divide-y).
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
                  <dt className="w-6 shrink-0 font-mono text-sm text-signal-ink">
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
      </div>
    </section>
  )
}
