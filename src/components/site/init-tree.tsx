'use client'

import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useVisibilityGate } from './use-loop-stage'

/* ----------------------------------------------------------------
   The one-time scaffold, assembled live. The tree lists exactly
   what `do-harness init` writes, per the README: do-harness.toml,
   AGENTS.md, USE_RESTRICTIONS.md, plans/invariants.json,
   .agents/skills/ (harness + skill-creator), and the local libSQL
   state at .do-harness/agent_state.db.

   Rows land one by one, hold, and the scaffold replays. Gated by
   the shared visibility hook; reduced motion shows the full tree
   statically. Rows are aria-hidden; the panel label carries the
   facts for assistive tech.
----------------------------------------------------------------- */

const FILES = [
  { path: 'do-harness.toml', note: 'pack + sensor selection' },
  { path: 'AGENTS.md', note: 'the contract' },
  { path: 'USE_RESTRICTIONS.md', note: 'policy + approval gates' },
  { path: 'plans/invariants.json', note: 'seeded invariants' },
  { path: '.agents/skills/', note: 'harness + skill-creator' },
  { path: '.do-harness/agent_state.db', note: 'libSQL state' },
]

const STEP_MS = 240
const HOLD_STEPS = 10 // full tree stays up before the scaffold replays

export function InitTree() {
  const reduce = useReducedMotion()
  const { containerRef, live } = useVisibilityGate()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (reduce || !live) return
    const id = setInterval(() => {
      setStep((s) => (s >= FILES.length + HOLD_STEPS ? 0 : s + 1))
    }, STEP_MS)
    return () => clearInterval(id)
  }, [reduce, live])

  const visible = reduce ? FILES.length : Math.min(step, FILES.length)

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="do-harness init scaffolds do-harness.toml, AGENTS.md, USE_RESTRICTIONS.md, plans/invariants.json, .agents/skills/ with the harness and skill-creator skills, and the libSQL state at .do-harness/agent_state.db."
      className="rounded-xl border border-dashed border-border bg-card/60 px-5 py-4"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <code className="font-mono text-[13px] text-foreground">
          $ do-harness init
        </code>
        <span className="chip h-6 text-[11px] text-muted-foreground">
          one-time
        </span>
        <span className="hidden text-[12.5px] text-muted-foreground md:inline">
          scaffolds the workspace before the first task
        </span>
      </div>

      {/* Reserved height: 6 rows on mobile, 3 on sm+, so the strip
          never jumps while rows land. */}
      <div className="mt-2.5 h-[132px] overflow-hidden sm:h-[66px]">
        <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2" aria-hidden="true">
          {FILES.map((f, i) =>
            i < visible ? (
              <div
                key={f.path}
                className="flex items-baseline justify-between gap-4 animate-in fade-in duration-300 motion-reduce:animate-none"
              >
                <span className="font-mono text-[12px] leading-[22px] text-foreground">
                  {f.path}
                </span>
                <span className="hidden shrink-0 font-mono text-[11px] text-muted-foreground sm:block">
                  {f.note}
                </span>
              </div>
            ) : (
              <div key={f.path} className="leading-[22px]">
                <span className="invisible font-mono text-[12px]">.</span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
