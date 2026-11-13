'use client'

import { usePrefersReducedMotion } from './use-reduced-motion'
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

   The clock itself is gated: it only runs while the diagram is on
   screen (IntersectionObserver) and the tab is visible
   (visibilitychange). Offscreen or hidden, every interval stops.
----------------------------------------------------------------- */

export const STAGE_MS = 2200
export const RESUME_MS = 6000

/* One `live` flag fed by the observer and the tab listener. Callers
   attach `containerRef` to the diagram's root element; effects that
   depend on `live` are torn down while hidden and re-armed on
   return, so nothing ticks in the background. */
export function useVisibilityGate() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [live, setLive] = useState(true)

  useEffect(() => {
    let inView = true
    const sync = () => setLive(inView && !document.hidden)
    sync()
    document.addEventListener('visibilitychange', sync)
    let observer: IntersectionObserver | undefined
    const el = containerRef.current
    if (el && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        inView = entries[0]?.isIntersecting ?? true
        sync()
      })
      observer.observe(el)
    }
    return () => {
      document.removeEventListener('visibilitychange', sync)
      observer?.disconnect()
    }
  }, [])

  return { containerRef, live }
}

export function useInteractiveLoop(count: number) {
  const reduce = usePrefersReducedMotion()
  const [stage, setStage] = useState(-1)
  const pinnedRef = useRef(false)
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { containerRef, live } = useVisibilityGate()

  useEffect(() => {
    if (reduce || !live) return
    const id = setInterval(() => {
      if (!pinnedRef.current) setStage((s) => (s + 1) % count)
    }, STAGE_MS)
    return () => clearInterval(id)
  }, [reduce, count, live])

  useEffect(
    () => () => {
      if (resumeRef.current) clearTimeout(resumeRef.current)
    },
    [],
  )

  const pin = useCallback((s: number) => {
    pinnedRef.current = true
    setStage(s)
    if (resumeRef.current) clearTimeout(resumeRef.current)
    resumeRef.current = setTimeout(() => {
      pinnedRef.current = false
    }, RESUME_MS)
  }, [])

  return { stage, pin, reduce, containerRef }
}
