'use client'

import { ArrowUp, ArrowUpRight, RotateCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { Reveal } from './reveal'
import { InitTree } from './init-tree'
import { useInteractiveLoop } from './use-loop-stage'

/* ----------------------------------------------------------------
   The technical loop, animated and explorable. A shared state
   machine cycles the stages; a traveling dot rides the active
   edge; the caption line explains the active stage. Hovering a
   card, or focusing/clicking its number badge, pins that stage
   and pauses the cycle until the visitor goes idle.
----------------------------------------------------------------- */

const EXPLAIN = [
  'feedforward: the agent loads one guide, not the whole corpus',
  'execution: the agent edits; the harness records the trail',
  'feedback: verify returns exit 0 GREEN or exit 1 RED',
  'learning: repeated failures distill into new skills',
]

const IDLE_EXPLAIN = 'guides in, verdicts out; the loop lives in your repo'

/* ----------------------------------------------------------------
   Diagram connectors. Pure CSS lines + SVG arrowheads so they
   inherit both themes. An active edge reuses the .flow-signal
   token styling and carries the traveling dot.
----------------------------------------------------------------- */

function ArrowRight({
  label,
  active = false,
}: {
  label: string
  active?: boolean
}) {
  return (
    <div
      className={`relative flex w-full items-center ${active ? 'flow-signal' : ''}`}
      aria-hidden="true"
    >
      <div className="flow-line h-[2px] w-full rounded-full" />
      {active && <span className="flow-dot flow-dot-x" />}
      <span className="flow-label left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
        {label}
      </span>
      <svg
        className="flow-arrow absolute right-0"
        width="8"
        height="10"
        viewBox="0 0 8 10"
      >
        <path d="M0 0 8 5 0 10Z" fill="currentColor" />
      </svg>
    </div>
  )
}

function ArrowLeft({
  label,
  active = false,
}: {
  label: string
  active?: boolean
}) {
  return (
    <div
      className={`relative flex w-full items-center ${active ? 'flow-signal' : ''}`}
      aria-hidden="true"
    >
      <div className="flow-line h-[2px] w-full rounded-full" />
      {active && <span className="flow-dot flow-dot-x-rev" />}
      <span className="flow-label left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
        {label}
      </span>
      <svg
        className="flow-arrow absolute left-0 rotate-180"
        width="8"
        height="10"
        viewBox="0 0 8 10"
      >
        <path d="M0 0 8 5 0 10Z" fill="currentColor" />
      </svg>
    </div>
  )
}

function ArrowDown({
  label,
  active = false,
  className = 'min-h-20',
}: {
  label: string
  active?: boolean
  className?: string
}) {
  return (
    <div
      className={`relative flex w-full flex-col items-center ${
        active ? 'flow-signal' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <div className="flow-line w-[2px] flex-1 rounded-full" />
      {active && <span className="flow-dot flow-dot-y" />}
      <span className="flow-label left-1/2 top-1/2 max-w-[9.5rem] -translate-x-1/2 -translate-y-1/2">
        {label}
      </span>
      <svg
        className="flow-arrow absolute bottom-0 rotate-90"
        width="8"
        height="10"
        viewBox="0 0 8 10"
      >
        <path d="M0 0 8 5 0 10Z" fill="currentColor" />
      </svg>
    </div>
  )
}

function FlowArrowUp({
  label,
  alwaysSignal = false,
  active = false,
  className = 'min-h-20',
}: {
  label: string
  alwaysSignal?: boolean
  active?: boolean
  className?: string
}) {
  return (
    <div
      className={`relative flex w-full flex-col items-center ${
        alwaysSignal || active ? 'flow-signal' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        className="flow-arrow absolute top-0 -rotate-90"
        width="8"
        height="10"
        viewBox="0 0 8 10"
      >
        <path d="M0 0 8 5 0 10Z" fill="currentColor" />
      </svg>
      <div className="flow-line w-[2px] flex-1 rounded-full" />
      {active && <span className="flow-dot flow-dot-y-rev" />}
      <span className="flow-label left-1/2 top-1/2 max-w-[9.5rem] -translate-x-1/2 -translate-y-1/2">
        {label}
      </span>
    </div>
  )
}

/* ----------------------------------------------------------------
   Stage cards. One term, one line: the diagram and the caption
   carry the explanation, the cards carry the artifacts. Every fact
   comes from the do-harness README. The number badge is a real
   button so keyboard users can pin a stage too.
----------------------------------------------------------------- */

function StageCard({
  n,
  kicker,
  title,
  term,
  value,
  footer,
  active = false,
  onPin,
}: {
  n: string
  kicker: string
  title: string
  term: string
  value: ReactNode
  footer?: ReactNode
  active?: boolean
  onPin: () => void
}) {
  return (
    <div
      onMouseEnter={onPin}
      className={`flex h-full flex-col rounded-xl border bg-card p-6 transition-colors duration-500 ${
        active ? 'border-signal/40 bg-signal-tint/20' : 'border-border'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPin}
          onFocus={onPin}
          aria-label={`Pin stage ${n}: ${title}`}
          aria-pressed={active}
          className={`flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md font-mono text-[11px] transition-colors duration-500 ${
            active ? 'bg-signal-tint text-signal-ink' : 'bg-muted text-muted-foreground'
          }`}
        >
          {n}
        </button>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {kicker}
        </span>
      </div>
      <h3 className="mt-4 text-[17px] font-semibold tracking-tight">{title}</h3>
      <dl className="mt-3 flex-1">
        <dt className="font-mono text-[13px] leading-relaxed text-foreground">
          {term}
        </dt>
        <dd className="mt-1.5 text-pretty text-[13.5px] leading-relaxed text-muted-foreground">
          {value}
        </dd>
      </dl>
      {footer}
    </div>
  )
}

const ENFORCED_AT = (
  <div className="mt-5 border-t border-border pt-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
    enforced at <span className="text-foreground">pre-commit</span> ·{' '}
    <span className="text-foreground">commit-msg</span> ·{' '}
    <span className="text-foreground">pre-push</span> ·{' '}
    <span className="text-foreground">CI --strict</span>
  </div>
)

const EXIT_CODES = (
  <span className="inline-flex flex-wrap items-center gap-1.5">
    <span className="chip chip-tinted h-7">0 GREEN</span>
    <span className="chip h-7">1 RED</span>
    <span className="chip h-7">2 VACUOUS</span>
  </span>
)

export function HowItWorks() {
  // 0..3 while animating; -1 when static (reduced motion, pre-mount).
  const { stage, pin, reduce, containerRef } = useInteractiveLoop(4)

  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      className="scroll-mt-24 border-t border-border"
    >
      <div
        ref={containerRef}
        className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28"
      >
        <Reveal>
          <h2
            id="how-heading"
            className="max-w-[24ch] text-balance text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.12] tracking-[-0.02em]"
          >
            One contract, read in two directions.
          </h2>
          <p className="mt-5 max-w-[56ch] text-pretty text-[17px] leading-relaxed text-muted-foreground">
            Feedforward guides shape what the agent writes. Feedback sensors
            decide whether the result is done.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          {/* Entry point: the one-time scaffold, kept visually apart from
              the loop. The tree assembles itself; facts per the README. */}
          <div className="mt-10">
            <InitTree />
          </div>

          {/* The loop: 2x2 clockwise on desktop, vertical stack on mobile. */}
          <div className="mt-4 grid grid-cols-1 gap-x-6 lg:grid-cols-[minmax(0,1fr)_12rem_minmax(0,1fr)] lg:gap-y-0">
            {/* 01 feedforward */}
            <div className="lg:col-start-1 lg:row-start-1">
              <StageCard
                n="01"
                kicker="before the code"
                title="Feedforward"
                active={stage === 0}
                onPin={() => pin(0)}
                term="AGENTS.md + .agents/skills/"
                value="The contract and the guides the agent reads before it codes."
              />
            </div>
            <div className="lg:hidden">
              <ArrowDown label="agent loads the guide" active={stage === 0} />
            </div>

            {/* 02 agent execution */}
            <div className="mt-4 lg:col-start-3 lg:row-start-1 lg:mt-0">
              <StageCard
                n="02"
                kicker="during the change"
                title="Agent execution"
                active={stage === 1}
                onPin={() => pin(1)}
                term="task add · task advance · trace add"
                value="Sensor-gated tasks; every executed command is recorded."
              />
            </div>
            <div className="lg:hidden">
              <ArrowDown
                label="every change must pass"
                active={stage === 1}
              />
            </div>

            {/* 03 feedback */}
            <div className="mt-4 lg:col-start-3 lg:row-start-3 lg:mt-0">
              <StageCard
                n="03"
                kicker="after the code"
                title="Feedback sensors"
                active={stage === 2}
                onPin={() => pin(2)}
                term="do-harness verify"
                value={EXIT_CODES}
                footer={ENFORCED_AT}
              />
            </div>
            <div className="lg:hidden">
              <ArrowDown
                label="results become evidence"
                active={stage === 2}
              />
            </div>

            {/* 04 state and learning */}
            <div className="mt-4 lg:col-start-1 lg:row-start-3 lg:mt-0">
              <StageCard
                n="04"
                kicker="between runs"
                title="State and learning"
                active={stage === 3}
                onPin={() => pin(3)}
                term="agent_state.db"
                value="Append-only events, beats, error signatures; failures distill into skills."
              />
            </div>

            {/* Mobile loop-back strip. */}
            <div
              className={`mt-4 flex items-center gap-3 rounded-xl border border-dashed bg-signal-tint px-5 py-4 transition-colors duration-500 lg:hidden ${
                stage === 3 ? 'border-signal/60' : 'border-signal/40'
              }`}
            >
              <ArrowUp
                className={`size-4 shrink-0 text-signal transition-opacity duration-500 ${
                  stage === 3 ? 'opacity-100' : 'opacity-60'
                }`}
                aria-hidden="true"
              />
              <p className="font-mono text-[12px] leading-relaxed text-signal-ink">
                skills fold back in · the loop closes
              </p>
            </div>

            {/* Desktop loop connectors. */}
            <div className="hidden lg:col-start-2 lg:row-start-1 lg:flex lg:items-center lg:px-1">
              <ArrowRight label="agent loads the guide" active={stage === 0} />
            </div>
            <div className="hidden lg:col-start-1 lg:row-start-2 lg:flex lg:py-3">
              <FlowArrowUp
                alwaysSignal
                label="skills fold back in"
                active={stage === 3}
                className="min-h-28 flex-1"
              />
            </div>
            <div className="hidden lg:col-start-2 lg:row-start-2 lg:flex lg:items-center lg:justify-center">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  className="flex size-14 items-center justify-center rounded-full border border-border bg-card"
                  animate={!reduce && stage >= 0 ? { rotate: 360 } : undefined}
                  transition={
                    !reduce && stage >= 0
                      ? { repeat: Infinity, duration: 9, ease: 'linear' }
                      : undefined
                  }
                >
                  <RotateCw className="size-5 text-signal" aria-hidden="true" />
                </motion.div>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  the loop
                </span>
              </div>
            </div>
            <div className="hidden lg:col-start-3 lg:row-start-2 lg:flex lg:py-3">
              <ArrowDown
                label="every change must pass"
                active={stage === 1}
                className="min-h-28 flex-1"
              />
            </div>
            <div className="hidden lg:col-start-2 lg:row-start-3 lg:flex lg:items-center lg:px-1">
              <ArrowLeft label="results become evidence" active={stage === 2} />
            </div>
          </div>

          {/* Live caption + docs link. The caption explains the active stage. */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-h-5 items-center gap-2.5">
              <span
                className="size-1.5 shrink-0 animate-pulse rounded-full bg-signal motion-reduce:animate-none"
                aria-hidden="true"
              />
              <p
                key={stage}
                className="animate-in fade-in duration-300 motion-reduce:animate-none font-mono text-[12px] leading-snug text-muted-foreground"
              >
                {stage >= 0 ? EXPLAIN[stage] : IDLE_EXPLAIN}
              </p>
            </div>
            <a
              href="https://github.com/d-o-hub/do-harness/blob/main/docs/adoption.md"
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-foreground underline-offset-4 hover:underline"
            >
              Per-ecosystem quickstarts in docs/adoption.md
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
