import { Reveal } from './reveal'

const FRAMEWORKS = [
  'OWASP Agentic Top 10 (2026)',
  'NIST AI RMF 1.0',
  'EU AI Act',
  'SOC 2',
]

export function Compliance() {
  return (
    <section
      id="compliance"
      aria-labelledby="compliance-heading"
      className="scroll-mt-24 border-t border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Reveal className="mx-auto max-w-[46rem]">
          <h2
            id="compliance-heading"
            className="text-balance text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.12] tracking-[-0.02em]"
          >
            Built for regulated loops
          </h2>
          <div className="mt-7 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
            <p>
              do-harness enforces deterministic, computational controls over
              the agent development loop: build-time verification sensors,
              workflow gates, tamper-evident logs, and machine-readable
              evidence artifacts. It claims build-loop assurance, not runtime
              policy.
            </p>
            <p>
              The green path is dogfooded rather than assumed. CI runs init and
              verify on every push, and the test suite drives the real binary
              on fresh workspaces, asserting the pack goes green, then red once
              the crate is removed.
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Compliance frameworks">
            {FRAMEWORKS.map((f) => (
              <li key={f} className="chip">
                {f}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-muted-foreground">
            Run{' '}
            <code className="font-mono text-[13px] text-foreground">
              do-harness compliance
            </code>{' '}
            to print the full mapping.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
