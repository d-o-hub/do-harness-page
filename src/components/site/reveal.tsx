'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Scroll reveal wrapper. Content is server-rendered fully visible;
 * the stylesheet hides it only under html.js (the bootstrap script
 * in layout.tsx adds the class before first paint), so a no-JS page
 * never blanks. With JS, an IntersectionObserver releases each block
 * once, when it is 80px inside the viewport; the transition is
 * opacity-only under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const id = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(id)
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '-80px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal=""
      data-reveal-shown={shown ? '' : undefined}
      style={
        delay
          ? ({ '--reveal-delay': `${delay}s` } as React.CSSProperties)
          : undefined
      }
      className={className}
    >
      {children}
    </div>
  )
}
