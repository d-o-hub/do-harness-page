'use client'

import { useEffect, useRef, useState } from 'react'
import { useVisibilityGate } from './use-loop-stage'
import { usePrefersReducedMotion } from './use-reduced-motion'

/* ----------------------------------------------------------------
   What a RED actually looks like. A scripted terminal replays the
   failure loop: three failing verifies, the sensor halt, then the
   pass. Every line is README-faithful: verify --record persists
   each sensor result as a beat and bumps the sensor's error
   signature; at 3 consecutive failures the sensor is halted (not
   executed, reported failed) until the underlying issue is fixed.

   The server renders the completed transcript, so the static page
   carries the whole story. With JS, the replay starts once the
   diagram is live, runs a single pass, and holds the GREEN verdict
   (peak-end). Reduced motion never starts it. The script chain is
   gated by the same visibility hook as the other diagrams.
----------------------------------------------------------------- */

type Tone = 'cmd' | 'body' | 'strike' | 'halt' | 'pass'

const SCRIPT: { text: string; tone: Tone; hold: number }[] = [
  { text: '$ do-harness verify --record', tone: 'cmd', hold: 520 },
  { text: 'fmt ✓  clippy ✓  test ✗', tone: 'body', hold: 340 },
  { text: 'exit 1 · test strike 1', tone: 'strike', hold: 420 },
  { text: '$ do-harness verify --record', tone: 'cmd', hold: 520 },
  { text: 'fmt ✓  clippy ✓  test ✗', tone: 'body', hold: 340 },
  { text: 'exit 1 · test strike 2', tone: 'strike', hold: 420 },
  { text: '$ do-harness verify --record', tone: 'cmd', hold: 520 },
  { text: 'fmt ✓  clippy ✓  test ✗', tone: 'body', hold: 340 },
  { text: 'exit 1 · test strike 3', tone: 'strike', hold: 620 },
  { text: 'halted: test skipped until the fix lands', tone: 'halt', hold: 1500 },
  { text: '$ do-harness verify --record', tone: 'cmd', hold: 520 },
  { text: 'fmt ✓  clippy ✓  test ✓', tone: 'body', hold: 340 },
  { text: 'exit 0 · GREEN', tone: 'pass', hold: 2100 },
]

const LINES = SCRIPT.length

/* Reserve the full transcript height up front so the card never
   jumps: 13 lines + a prompt-cursor row, 20px each, plus padding. */
const BODY_CLASS = 'h-[312px] px-4 py-4 font-mono text-[12px] leading-[20px]'

function TerminalLine({ text, tone }: { text: string; tone: Tone }) {
  if (tone === 'cmd') {
    const prompt = '$'
    const command = text.slice(2)
    return (
      <p>
        <span className="text-muted-foreground">{prompt} </span>
        <span className="text-foreground">{command}</span>
      </p>
    )
  }
  if (tone === 'body') {
    return (
      <p className="text-foreground">
        {text.split('  ').map((seg, i) => {
          const mark = seg.slice(-1)
          const name = seg.slice(0, -1)
          const ok = mark === '✓'
          return (
            <span key={seg} className={i > 0 ? 'ml-3' : undefined}>
              {name}
              <span className={ok ? 'text-signal-ink' : 'text-destructive'}>
                {mark}
              </span>
            </span>
          )
        })}
      </p>
    )
  }
  if (tone === 'strike') {
    const [, label] = text.split(' · ')
    return (
      <p>
        <span className="text-destructive">exit 1</span>
        <span className="text-muted-foreground"> · {label}</span>
      </p>
    )
  }
  if (tone === 'halt') {
    return (
      <p className="w-fit rounded-sm bg-destructive/10 px-1.5 text-destructive">
        {text}
      </p>
    )
  }
  return (
    <p className="w-fit rounded-sm bg-signal-tint px-1.5 font-medium text-signal-ink">
      {text}
    </p>
  )
}

export function RedTerminal() {
  const reduce = usePrefersReducedMotion()
  const { containerRef, live } = useVisibilityGate()
  // Server render and hydration both start from the completed
  // transcript; the replay then rewinds to line 1, exactly once.
  const [step, setStep] = useState(LINES)
  const beganRef = useRef(false)

  useEffect(() => {
    if (reduce || !live || beganRef.current) return
    const id = setTimeout(() => {
      beganRef.current = true
      setStep(1)
    }, 0)
    return () => clearTimeout(id)
  }, [live, reduce])

  useEffect(() => {
    if (reduce || !live || step >= LINES) return
    const delay = SCRIPT[step - 1].hold
    const id = setTimeout(() => setStep((s) => s + 1), delay)
    return () => clearTimeout(id)
  }, [step, live, reduce])

  const visible = reduce ? LINES : step
  const complete = visible >= LINES

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Terminal replay: three failing verifies strike out the test sensor, it halts, the fix lands, verify exits 0 GREEN."
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="size-2 rounded-full bg-muted-foreground/25" aria-hidden="true" />
        <span className="size-2 rounded-full bg-muted-foreground/25" aria-hidden="true" />
        <span className="size-2 rounded-full bg-muted-foreground/25" aria-hidden="true" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">
          do-harness · verify --record
        </span>
      </div>

      {/* Transcript. Decorative motion: the surrounding prose carries
          the same facts for assistive tech. */}
      <div className={`${BODY_CLASS} overflow-hidden`} aria-hidden="true">
        {SCRIPT.slice(0, visible).map((line, i) => (
          <TerminalLine key={i} text={line.text} tone={line.tone} />
        ))}
        {complete && (
          <p>
            <span className="inline-block h-3.5 w-[7px] animate-pulse bg-foreground/70 motion-reduce:animate-none" />
          </p>
        )}
      </div>
    </div>
  )
}
