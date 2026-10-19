import {
  siRust,
  siNodedotjs,
  siTypescript,
  siGithubactions,
  siGitlab,
  siLighthouse,
} from 'simple-icons'
import { Reveal } from './reveal'

const LOGOS = [siRust, siNodedotjs, siTypescript, siGithubactions, siGitlab, siLighthouse]

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
          <ul className="flex flex-wrap items-center gap-x-9 gap-y-4 text-muted-foreground">
            {LOGOS.map((icon) => (
              <li key={icon.slug}>
                <svg
                  role="img"
                  aria-label={icon.title}
                  viewBox="0 0 24 24"
                  className="size-5 fill-current"
                >
                  <path d={icon.path} />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Reveal>
  )
}
