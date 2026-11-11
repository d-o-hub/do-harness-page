'use client'

import { motion } from 'framer-motion'
import { RotateCw } from 'lucide-react'
import { RESUME_MS, useInteractiveLoop } from './use-loop-stage'

/* ----------------------------------------------------------------
   Hero architecture panel: the harness loop, live. Four stages on
   a 2x2 ring, a signal dot riding whichever edge is active, and a
   one-line caption that explains the active stage.

   The ring is explorable: hovering, focusing, or clicking a node
   pins that stage (the caption explains it, the cycle pauses) and
   the loop resumes after RESUME_MS of idle.
----------------------------------------------------------------- */

const NODES = [
  { n: '01', label: 'guides' },
  { n: '02', label: 'agent' },
  { n: '03', label: 'sensors' },
  { n: '04', label: 'state' },
]

const CAPTIONS = [
  'the contract and one skill load before the code',
  'the agent edits; the harness records every command',
  'verify gates the change: exit 0 or exit 1',
  'results become evidence, then new skills',
]

const IDLE_CAPTION = 'one loop: guides in, verdicts out'

function Node({
  n,
  label,
  active,
  onPin,
}: {
  n: string
  label: string
  active: boolean
  onPin: () => void
}) {
  return (
    <button
      type="button"
      onMouseEnter={onPin}
      onFocus={onPin}
      onClick={onPin}
      aria-label={`Stage ${n}: ${label}`}
      aria-pressed={active}
      className={`flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors duration-500 ${
        active ? 'border-signal/50 bg-signal-tint' : 'border-border bg-background'
      }`}
    >
      <span
        className={`font-mono text-[11px] tracking-[0.14em] transition-colors duration-500 ${
          active ? 'text-signal-ink' : 'text-muted-foreground'
        }`}
      >
        {n}
      </span>
      <span className="font-mono text-[13px] leading-none text-foreground">
        {label}
      </span>
    </button>
  )
}

function EdgeX({
  active,
  reverse = false,
}: {
  active: boolean
  reverse?: boolean
}) {
  return (
    <div
      className={`relative flex w-full items-center ${active ? 'flow-signal' : ''}`}
      aria-hidden="true"
    >
      <div className="flow-line h-[2px] w-full rounded-full" />
      {active && (
        <span className={`flow-dot ${reverse ? 'flow-dot-x-rev' : 'flow-dot-x'}`} />
      )}
      <svg
        className={`flow-arrow absolute ${reverse ? 'left-0 rotate-180' : 'right-0'}`}
        width="8"
        height="10"
        viewBox="0 0 8 10"
      >
        <path d="M0 0 8 5 0 10Z" fill="currentColor" />
      </svg>
    </div>
  )
}

function EdgeY({
  active,
  reverse = false,
}: {
  active: boolean
  reverse?: boolean
}) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center py-1.5 ${
        active ? 'flow-signal' : ''
      }`}
      aria-hidden="true"
    >
      {reverse && (
        <svg
          className="flow-arrow absolute top-0 -rotate-90"
          width="8"
          height="10"
          viewBox="0 0 8 10"
        >
          <path d="M0 0 8 5 0 10Z" fill="currentColor" />
        </svg>
      )}
      <div className="flow-line w-[2px] flex-1 rounded-full" />
      {!reverse && (
        <svg
          className="flow-arrow absolute bottom-0 rotate-90"
          width="8"
          height="10"
          viewBox="0 0 8 10"
        >
          <path d="M0 0 8 5 0 10Z" fill="currentColor" />
        </svg>
      )}
      {active && (
        <span className={`flow-dot ${reverse ? 'flow-dot-y-rev' : 'flow-dot-y'}`} />
      )}
    </div>
  )
}

export function LoopPanel() {
  const { stage, pin, reduce, containerRef } = useInteractiveLoop(4)
  const caption = stage >= 0 ? CAPTIONS[stage] : IDLE_CAPTION

  return (
    <div
      ref={containerRef}
      className="rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      {/* The ring: 01 guides -> 02 agent -> 03 sensors -> 04 state -> back. */}
      <div
        className="grid grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1fr)] items-stretch"
        title={`Hover or click a stage to pin it; the loop resumes after ${RESUME_MS / 1000}s.`}
      >
        <Node {...NODES[0]} active={stage === 0} onPin={() => pin(0)} />
        <div className="flex items-center px-1.5">
          <EdgeX active={stage === 0} />
        </div>
        <Node {...NODES[1]} active={stage === 1} onPin={() => pin(1)} />

        <div className="flex min-h-14 justify-center py-1">
          <EdgeY reverse active={stage === 3} />
        </div>
        <div className="flex items-center justify-center">
          <motion.div
            className="flex size-10 items-center justify-center rounded-full border border-border bg-background"
            animate={!reduce && stage >= 0 ? { rotate: 360 } : undefined}
            transition={
              !reduce && stage >= 0
                ? { repeat: Infinity, duration: 9, ease: 'linear' }
                : undefined
            }
          >
            <RotateCw className="size-4 text-signal" aria-hidden="true" />
          </motion.div>
        </div>
        <div className="flex min-h-14 justify-center py-1">
          <EdgeY active={stage === 1} />
        </div>

        <Node {...NODES[3]} active={stage === 3} onPin={() => pin(3)} />
        <div className="flex items-center px-1.5">
          <EdgeX reverse active={stage === 2} />
        </div>
        <Node {...NODES[2]} active={stage === 2} onPin={() => pin(2)} />
      </div>

      {/* The explanation line, bound to the active stage. */}
      <div className="mt-5 flex min-h-6 items-center gap-2.5 border-t border-border pt-4">
        <span
          className="size-1.5 shrink-0 animate-pulse rounded-full bg-signal motion-reduce:animate-none"
          aria-hidden="true"
        />
        <p
          key={caption}
          className="animate-in fade-in duration-300 motion-reduce:animate-none font-mono text-[12px] leading-snug text-muted-foreground"
        >
          {caption}
        </p>
      </div>
    </div>
  )
}
