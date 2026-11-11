import { ArrowRight, Github } from 'lucide-react'
import { LoopPanel } from './loop-panel'

const REPO_URL = 'https://github.com/d-o-hub/do-harness'

/**
 * Hero entrance is CSS, not framer: the `.enter` class hides content
 * only under html.js and runs its animation on first paint, so the
 * no-JS page renders the full hero and the staggered entrance does
 * not wait for hydration. Delays mirror the old stagger (0 / 0.07 /
 * 0.14s left column, 0.15s right panel).
 */
const DELAY = (s: number) => ({ '--enter-delay': `${s}s` }) as React.CSSProperties

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-5 pb-16 pt-14 md:px-8 md:pt-20 lg:grid-cols-12 lg:gap-8 lg:pb-24">
        <div className="enter lg:col-span-7">
          <h1
            id="hero-heading"
            className="max-w-[13ch] text-balance text-[clamp(2.75rem,7vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
          >
            Agents that <span className="text-signal-ink">prove</span> their
            work.
          </h1>

          <p
            style={DELAY(0.07)}
            className="enter mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            A compiled CLI pairing feedforward guides with feedback sensors.
            Agents and CI pass the same checks before code ships.
          </p>

          <div
            style={DELAY(0.14)}
            className="enter mt-8 flex flex-wrap items-center gap-3"
          >
            <a href="#install" className="btn btn-primary">
              Install do-harness
              <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <Github className="size-4" strokeWidth={2} aria-hidden="true" />
              View on GitHub
            </a>
          </div>
        </div>

        <div
          style={{ ...DELAY(0.15), '--enter-duration': '0.45s' } as React.CSSProperties}
          className="enter lg:col-span-5 lg:mt-10"
        >
          <LoopPanel />
        </div>
      </div>
    </section>
  )
}
