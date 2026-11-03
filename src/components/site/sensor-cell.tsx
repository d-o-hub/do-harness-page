'use client'

import { Check } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

/* ----------------------------------------------------------------
   Live sensor suite: the five sensors the packs select run in
   sequence, each flips to a check, then the verdict lands on
   exit 0 GREEN. The cycle restarts. Tick 0 matches the server
   render; under prefers-reduced-motion the render folds `reduce`
   into the all-pass frame and the interval never starts.
----------------------------------------------------------------- */

const SENSORS = ['fmt', 'clippy', 'test', 'typecheck', 'build']

const TICK_MS = 620
const TICKS_PER_SENSOR = 2 // one tick running, one tick settled
const ALL_PASS_AT = SENSORS.length * TICKS_PER_SENSOR // 10
const HOLD_TICKS = 5 // verdict stays on screen, then the cycle restarts
const CYCLE = ALL_PASS_AT + HOLD_TICKS

export function SensorCell() {
  const reduce = useReducedMotion()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setTick((t) => (t + 1) % CYCLE), TICK_MS)
    return () => clearInterval(id)
  }, [reduce])

  const allPass = Boolean(reduce) || tick >= ALL_PASS_AT

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
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
          <motion.span
            key="green"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="chip chip-tinted h-7 w-full justify-center text-[11px]"
          >
            exit 0 · GREEN
          </motion.span>
        ) : (
          <span className="chip h-7 w-full justify-center text-[11px] text-muted-foreground">
            running
          </span>
        )}
      </div>
    </div>
  )
}
