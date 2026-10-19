'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Github } from 'lucide-react'

const REPO_URL = 'https://github.com/d-o-hub/do-harness'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] as const },
  },
}

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-5 pb-16 pt-14 md:px-8 md:pt-20 lg:grid-cols-12 lg:gap-8 lg:pb-24">
        <motion.div
          className="lg:col-span-7"
          variants={reduce ? undefined : container}
          initial={reduce ? { opacity: 0 } : 'hidden'}
          animate={reduce ? { opacity: 1 } : 'show'}
        >
          <motion.h1
            id="hero-heading"
            variants={reduce ? undefined : item}
            className="max-w-[13ch] text-balance text-[clamp(2.75rem,7vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
          >
            Agents that <span className="text-signal-ink">prove</span> their
            work.
          </motion.h1>

          <motion.p
            variants={reduce ? undefined : item}
            className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            A compiled CLI pairing feedforward guides with feedback sensors.
            Agents and CI pass the same checks before code ships.
          </motion.p>

          <motion.div
            variants={reduce ? undefined : item}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href="#install" className="btn btn-primary">
              Install do-harness
              <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <Github className="size-4" strokeWidth={2} aria-hidden="true" />
              View on GitHub
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-5 lg:mt-10"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
        >
          <Image
            src="/harness-hero.png"
            alt="Studio photograph of a braided cable harness with a green-marked connector"
            width={864}
            height={1152}
            priority
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="h-auto w-full rounded-xl border border-border [filter:saturate(0.88)]"
          />
        </motion.div>
      </div>
    </section>
  )
}
