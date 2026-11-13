'use client'

import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useVisibilityGate } from './use-loop-stage'
import { usePrefersReducedMotion } from './use-reduced-motion'

/* ----------------------------------------------------------------
   Live sensor suite: the five sensors the packs select run in
   sequence, each flips to a check, then the verdict lands on
   exit 0 GREEN. The server renders the all-pass verdict, so the
   static page shows the proof; with JS the suite rewinds and runs
   one pass, then holds the verdict. Reduced motion folds `reduce`
   into the all-pass frame and the chain never starts.
----------------------------------------------------------------- */

const SENSORS = ['fmt', 'clippy', 'test', 'typecheck', 'build']

const TICK_MS = 620
const TICKS_PER_SENSOR = 2 // one tick running, one tick settled
const ALL_PASS_AT = SENSORS.length * TICKS_PER_SENSOR // 10

export function SensorCell() {
  const reduce = usePrefersReducedMotion()
  const { containerRef, live } = useVisibilityGate()
  // Server render and hydration both start from the verdict; the
  // suite rewinds to tick 0, runs once, holds on GREEN.
  const [tick, setTick] = useState(ALL_PASS_AT)
  const beganRef = useRef(false)

  useEffect(() => {
    if (reduce || !live || beganRef.current) return
    const id = setTimeout(() => {
      beganRef.current = true
      setTick(0)
    }, 0)
    return () => clearTimeout(id)
  }, [live, reduce])

  useEffect(() => {
    if (reduce || !live || tick >= ALL_PASS_AT) return
    const id = setTimeout(() => setTick((t) => t + 1), TICK_MS)
    return () => clearTimeout(id)
  }, [tick, live, reduce])

  const allPass = Boolean(reduce) || tick >= ALL_PASS_AT

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col rounded-xl border border-border bg-card p-5"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        verify · sensor suite
      </p>

      <ul className="mt-4 flex-1 space-y-2.5" aria-label="sensor results">
        {SENSORS.map((name, i) => {
          const passed = Boolean(reduce) || tick >= (i + 1) * TICKS_PER_SENSOR
          const running = !reduce && !passed && tick >= i * TICKS_PER_SENSOR
          return (
            <li
              key={name}
              className="flex items-center justify-between font-mono text-[12.5px]"
            >
              <span
                className={`transition-colors duration-300 ${
                  passed || running ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {name}
              </span>
              {passed ? (
                <Check
                  className="size-3.5 text-signal"
                  strokeWidth={2.5}
                  aria-label="pass"
                />
              ) : running ? (
                <span
                  className="size-2 animate-pulse rounded-full bg-signal motion-reduce:animate-none"
                  aria-hidden="true"
                />
              ) : (
                <span
                  className="size-2 rounded-full border border-border"
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-4 border-t border-border pt-4">
        {allPass ? (
          <span
            key="green"
            className="chip chip-tinted h-7 w-full justify-center text-[11px] animate-in fade-in slide-in-from-top-1 duration-300 motion-reduce:animate-none"
          >
            exit 0 · GREEN
          </span>
        ) : (
          <span className="chip h-7 w-full justify-center text-[11px] text-muted-foreground">
            running
          </span>
        )}
      </div>
    </div>
  )
}
