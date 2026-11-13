import { Reveal } from './reveal'
import { CopyButton } from './copy-button'

const METHODS = [
  {
    label: 'npx',
    desc: 'Zero install on Linux and macOS, Node 18 and up.',
    cmd: 'npx do-harness init',
  },
  {
    label: 'Shell',
    desc: 'Checksum-verified binary into ~/.local/bin.',
    cmd: 'curl -fsSL https://raw.githubusercontent.com/d-o-hub/do-harness/main/scripts/install.sh | sh',
  },
  {
    label: 'Cargo',
    desc: 'Prebuilt release through cargo-binstall.',
    cmd: 'cargo binstall do-harness',
  },
  {
    label: 'Source',
    desc: 'Build it yourself on a Rust 1.85+ toolchain.',
    cmd: 'cargo install do-harness --version 0.3.0 --locked',
  },
]

const WIRE_STEPS = [
  {
    cmd: 'do-harness init',
    note: 'Detects the pack, writes the contract, runs a first verification.',
  },
  {
    cmd: 'do-harness hook install',
    note: 'Gates commits and pushes through the sensors.',
  },
  {
    cmd: 'do-harness verify --set verification --changed --strict',
    note: 'The suite a change has to pass before it counts as done.',
  },
]

const CI_CMD =
  'do-harness verify --format json --evidence .do-harness/evidence.json --strict'

export function Install({
  scriptChecksum,
}: {
  scriptChecksum: string | null
}) {
  return (
    <section
      id="install"
      aria-labelledby="install-heading"
      className="scroll-mt-24 border-t border-border"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2
            id="install-heading"
            className="max-w-[24ch] text-balance text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.12] tracking-[-0.02em]"
          >
            Install
          </h2>
          <p className="mt-5 max-w-[60ch] text-pretty text-[17px] leading-relaxed text-muted-foreground">
            Prebuilt binaries for Linux, macOS, and Windows. The installer
            checks the SHA-256 checksum before anything lands on PATH.{' '}
            <a
              href="https://raw.githubusercontent.com/d-o-hub/do-harness/main/scripts/install.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Read install.sh before running it.
            </a>
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="divide-y divide-border border-y border-border">
              {METHODS.map((m, i) => (
                <Reveal key={m.label} delay={Math.min(i * 0.05, 0.2)}>
                  <div className="py-6">
                    <div className="flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between md:gap-6">
                      <h3 className="text-[15px] font-medium">{m.label}</h3>
                      <p className="text-pretty text-sm text-muted-foreground">
                        {m.desc}
                      </p>
                    </div>
                    <div className="cmd mt-3 flex items-center gap-1 py-2 pl-3.5 pr-1.5">
                      <code className="min-w-0 flex-1 break-words text-foreground">
                        {m.cmd}
                      </code>
                      <CopyButton command={m.cmd} label={`Copy ${m.label} command`} />
                    </div>
                    {m.label === 'Shell' && scriptChecksum !== null && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            install.sh &middot; sha256
                          </span>
                          <CopyButton
                            command={scriptChecksum}
                            label="Copy install.sh checksum"
                          />
                        </div>
                        <code className="mt-1 block break-all font-mono text-[12.5px] leading-relaxed text-foreground">
                          {scriptChecksum}
                        </code>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <p className="mt-6 max-w-[65ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                Windows installs from the{' '}
                <a
                  href="https://github.com/d-o-hub/do-harness/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                  release zip
                </a>
                . npm cannot carry the win32 package name, so the zip is the
                supported path.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-medium">Wire it in</h3>
              <ol className="mt-5 space-y-5">
                {WIRE_STEPS.map((s) => (
                  <li key={s.cmd}>
                    <div className="cmd overflow-x-auto px-3.5 py-2.5">
                      <code className="break-words text-foreground">{s.cmd}</code>
                    </div>
                    <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {s.note}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="mt-7 border-t border-border pt-6">
                <h4 className="text-sm font-medium">In CI</h4>
                <div className="cmd mt-3 overflow-x-auto px-3.5 py-2.5">
                  <code className="break-words text-foreground">{CI_CMD}</code>
                </div>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  Exit 0 passes, 1 fails, 2 reports VACUOUS: a workspace with
                  zero sensors proves nothing. No build step required.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
