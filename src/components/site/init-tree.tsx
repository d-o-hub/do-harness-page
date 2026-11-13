'use client'

import { useEffect, useRef, useState } from 'react'
import { useVisibilityGate } from './use-loop-stage'
import { usePrefersReducedMotion } from './use-reduced-motion'

/* ----------------------------------------------------------------
   The one-time scaffold, assembled live. The tree lists exactly
   what `do-harness init` writes, per the README: do-harness.toml,
   AGENTS.md, USE_RESTRICTIONS.md, plans/invariants.json,
   .agents/skills/ (harness + skill-creator), and the local libSQL
   state at .do-harness/agent_state.db.

   The server renders the completed tree, so the static page shows
   the full scaffold. With JS the rows rewind and land one by one,
   once, and the tree holds (it matches the "one-time" chip).
   Gated by the shared visibility hook; reduced motion keeps the
   full tree statically. Rows are aria-hidden; the panel label
   carries the facts for assistive tech.
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

export function InitTree() {
  const reduce = usePrefersReducedMotion()
  const { containerRef, live } = useVisibilityGate()
  // Server render and hydration both start from the full tree; the
  // assembly rewinds to zero rows, exactly once, then holds.
  const [step, setStep] = useState(FILES.length)
  const beganRef = useRef(false)

  useEffect(() => {
    if (reduce || !live || beganRef.current) return
    const id = setTimeout(() => {
      beganRef.current = true
      setStep(0)
    }, 0)
    return () => clearTimeout(id)
  }, [live, reduce])

  useEffect(() => {
    if (reduce || !live || step >= FILES.length) return
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS)
    return () => clearTimeout(id)
  }, [step, live, reduce])

  const visible = reduce ? FILES.length : step

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
