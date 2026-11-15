'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, X } from 'lucide-react'

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
 *
 * If the clipboard is blocked (private mode, hardened browsers), the button
 * flips to a "Copy failed" state, selects the row's command text so the user
 * can complete the copy manually with Ctrl-C / Cmd-C, and announces the
 * fallback through the same live region. Mark the selectable text with
 * data-copy-text inside an optional data-copy-row ancestor.
 */
export function CopyButton({
  command,
  label = 'Copy command',
}: {
  command: string
  label?: string
}) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const flash = (next: 'done' | 'failed', holdMs: number) => {
    setState(next)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), holdMs)
  }

  const selectRowText = () => {
    const target = buttonRef.current
      ?.closest('[data-copy-row]')
      ?.querySelector('[data-copy-text]')
    if (!target) return
    const sel = window.getSelection()
    if (!sel) return
    const range = document.createRange()
    range.selectNodeContents(target)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  const onCopy = async () => {
    const ok = await copyText(command)
    if (ok) {
      flash('done', 1600)
    } else {
      selectRowText()
      flash('failed', 4000)
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onCopy}
      title={
        state === 'failed'
          ? 'Clipboard blocked — command text selected, press Ctrl-C / Cmd-C'
          : undefined
      }
      className="relative inline-flex h-11 shrink-0 items-center gap-1.5 rounded-md border border-transparent px-3 font-mono text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
      aria-label={state === 'failed' ? `${label} — clipboard blocked` : label}
    >
      {state === 'done' ? (
        <Check className="size-4 text-signal-ink" strokeWidth={2} aria-hidden="true" />
      ) : state === 'failed' ? (
        <X className="size-4" strokeWidth={2} aria-hidden="true" />
      ) : (
        <Copy className="size-4" strokeWidth={2} aria-hidden="true" />
      )}
      <span aria-hidden="true">
        {state === 'done' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy'}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {state === 'done'
          ? 'Command copied to clipboard'
          : state === 'failed'
            ? 'Clipboard unavailable. The command text is now selected; press Ctrl-C or Cmd-C to copy it.'
            : ''}
      </span>
    </button>
  )
}
