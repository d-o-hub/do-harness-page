import { Check } from 'lucide-react'

/* ----------------------------------------------------------------
   CTA verdict panel: the moment verify returns. A slowly rotating
   dashed ring around a green check, the command above, its exit
   code below. The rotation is a CSS keyframe; reduced motion stops
   it via the motion-reduce utility, so no JS flag is needed and the
   panel stays a server component.
----------------------------------------------------------------- */

export function VerdictPanel() {
  return (
    <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-6 rounded-xl border border-border bg-card p-8">
      <div className="relative flex size-24 items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full text-signal spin-continuous-24 motion-reduce:animate-none"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="2"
            strokeDasharray="10 14"
            strokeLinecap="round"
          />
        </svg>
        <span className="flex size-12 items-center justify-center rounded-full bg-signal-tint">
          <Check className="size-6 text-signal-ink" strokeWidth={2.5} aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <code className="font-mono text-[13px] text-foreground">
          $ do-harness verify
        </code>
        <span className="chip chip-tinted h-7">exit 0 · GREEN</span>
      </div>
    </div>
  )
}
