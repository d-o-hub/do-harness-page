'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

/**
 * Copy affordance with explicit label, success feedback, and a live region
 * for screen readers. Exits fast (150ms), holds the confirmation briefly.
 */
export function CopyButton({
  command,
  label = 'Copy command',
}: {
  command: string
  label?: string
}) {
  const [state, setState] = useState<'idle' | 'done'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const onCopy = async () => {
    const ok = await copyText(command)
    if (!ok) return
    setState('done')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), 1600)
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-md border border-transparent px-3 font-mono text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
      aria-label={label}
    >
      {state === 'done' ? (
        <Check className="size-4 text-signal-ink" strokeWidth={2} aria-hidden="true" />
      ) : (
        <Copy className="size-4" strokeWidth={2} aria-hidden="true" />
      )}
      <span aria-hidden="true">{state === 'done' ? 'Copied' : 'Copy'}</span>
      <span role="status" aria-live="polite" className="sr-only">
        {state === 'done' ? 'Command copied to clipboard' : ''}
      </span>
    </button>
  )
}
