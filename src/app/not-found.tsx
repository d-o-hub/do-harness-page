import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'do-harness: page not found',
}

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-20">
      <div className="w-full max-w-[560px] rounded-xl border border-border bg-card p-8 shadow-sm md:p-10">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 font-mono text-[12px] font-medium tracking-wide text-destructive-ink">
            exit 1
          </span>
          <span className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            404 · not found
          </span>
        </div>
        <h1 className="mt-6 text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.02em] md:text-4xl">
          Nothing runs here.
        </h1>
        <p className="mt-4 max-w-[48ch] text-pretty leading-relaxed text-muted-foreground">
          No page lives at this address. The home page is one click
          away, and every install path starts there.
        </p>
        <div className="mt-8">
          <a href="/" className="btn btn-primary">
            <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
            Back to the home page
          </a>
        </div>
      </div>
    </main>
  )
}
