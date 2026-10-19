'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { Github, Menu, Moon, Sun, X } from 'lucide-react'

const LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#install', label: 'Install' },
  { href: '#compliance', label: 'Compliance' },
]

const REPO_URL = 'https://github.com/d-o-hub/do-harness'

/** Brand mark: a single geometric glyph (square + verdict tick). */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="1.5"
        y="1.5"
        width="21"
        height="21"
        rx="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7.5 12.5l3 3 6-7.5"
        fill="none"
        stroke="var(--signal)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      className="icon-btn"
      aria-label="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Moon
        className="size-[18px] dark:hidden"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <Sun
        className="hidden size-[18px] dark:block"
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </button>
  )
}

export function Nav({ stars }: { stars: number | null }) {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const starLabel =
    stars === null
      ? null
      : stars >= 1000
        ? `${(stars / 1000).toFixed(1)}k`
        : `${stars}`

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8"
      >
        <a
          href="#top"
          className="flex items-center gap-2.5 font-semibold tracking-tight"
          aria-label="do-harness, back to top"
        >
          <BrandMark />
          <span className="text-[17px]">do-harness</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            aria-label="do-harness on GitHub"
          >
            <Github className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
          </a>
          {starLabel && (
            <span
              className="hidden font-mono text-xs text-muted-foreground sm:inline"
              aria-label={`${stars} GitHub stars`}
            >
              {starLabel}
            </span>
          )}
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            className="icon-btn md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-border md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col px-5 py-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="py-3 text-[15px] text-foreground"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
