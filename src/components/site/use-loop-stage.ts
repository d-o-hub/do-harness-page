'use client'

import { useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

/* ----------------------------------------------------------------
   Shared loop state machine for the animated diagrams.

   The stage index cycles 0..count-1 on an interval. A stage can be
   pinned (hover, click, keyboard focus): pinning stops the advance
   and arms a resume timer, so the loop picks up from the pinned
   stage after the visitor goes idle. State starts at -1 (idle),
   which matches the server render, keeping hydration clean and the
   diagram fully static under prefers-reduced-motion. Pinning still
   works under reduced motion: it only flips the highlight colors.
----------------------------------------------------------------- */

export const STAGE_MS = 2200
export const RESUME_MS = 6000

export function useInteractiveLoop(count: number) {
  const reduce = useReducedMotion()
  const [stage, setStage] = useState(-1)
  const pinnedRef = useRef(false)
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => {
      if (!pinnedRef.current) setStage((s) => (s + 1) % count)
    }, STAGE_MS)
    return () => {
      clearInterval(id)
      if (resumeRef.current) clearTimeout(resumeRef.current)
    }
  }, [reduce, count])

  const pin = useCallback((s: number) => {
    pinnedRef.current = true
    setStage(s)
    if (resumeRef.current) clearTimeout(resumeRef.current)
    resumeRef.current = setTimeout(() => {
      pinnedRef.current = false
    }, RESUME_MS)
  }, [])

  return { stage, pin, reduce }
}
