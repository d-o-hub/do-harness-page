'use client'

import { useEffect, useState } from 'react'

/* SSR-safe prefers-reduced-motion flag — the last replacement for
   framer-motion's useReducedMotion after the de-framer pass.

   The lazy initializer reads the live media query on the client's very
   first render; on the server it is false, which matches every
   consumer's SSR contract: all proof diagrams server-render their
   COMPLETED state, and a reduced-motion visitor also renders the
   completed state, so hydration output is byte-identical in both
   cases. Gate effects early-return on `reduce`, so a reduced-motion
   session never starts a replay; a live listener picks up OS-level
   changes mid-session. */
export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return reduce
}
