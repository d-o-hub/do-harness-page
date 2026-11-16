import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './reveal'
import { CopyButton } from './copy-button'
import { VerdictPanel } from './verdict-panel'

const ADOPTION_URL =
  'https://github.com/d-o-hub/do-harness/blob/main/docs/adoption.md'

export function Cta() {
  return (
    <section aria-labelledby="cta-heading" className="scroll-mt-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <h2
            id="cta-heading"
            className="max-w-[14ch] text-balance text-[clamp(2.25rem,4.5vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.025em]"
          >
            Run init. Read the verdict.
          </h2>
          <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
            One command scaffolds the workspace and reports GREEN, RED, or
            VACUOUS on the spot.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3.5">
            <div
              className="cmd cmd-deck flex w-full items-center gap-3 py-2.5 pl-4 pr-2.5"
              data-copy-row
            >
              <span
                aria-hidden="true"
                className="select-none font-mono text-[13px] text-muted-foreground"
              >
                $
              </span>
              <code
                data-copy-text
                className="min-w-0 flex-1 truncate font-mono text-sm font-medium text-foreground"
              >
                npx do-harness init
              </code>
              <CopyButton command="npx do-harness init" variant="ink" />
            </div>
            <a
              href={ADOPTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 text-[15px] font-medium text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline"
            >
              Read the adoption guide
              <ArrowUpRight
                className="size-4"
                strokeWidth={2}
                aria-hidden="true"
              />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5">
          <VerdictPanel />
        </Reveal>
      </div>
    </section>
  )
}
