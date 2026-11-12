import type { Metadata } from 'next'
import { createHash } from 'node:crypto'
import { Nav } from '@/components/site/nav'
import { Hero } from '@/components/site/hero'
import { LogoStrip } from '@/components/site/logo-strip'
import { Thesis } from '@/components/site/thesis'
import { HowItWorks } from '@/components/site/how-it-works'
import { Bento } from '@/components/site/bento'
import { Install } from '@/components/site/install'
import { Compliance } from '@/components/site/compliance'
import { Cta } from '@/components/site/cta'
import { Footer } from '@/components/site/footer'

export const metadata: Metadata = {
  alternates: { canonical: './' },
}

const REPO_API = 'https://api.github.com/repos/d-o-hub/do-harness'
const REPO_URL = 'https://github.com/d-o-hub/do-harness'
const INSTALL_SCRIPT_URL =
  'https://raw.githubusercontent.com/d-o-hub/do-harness/main/scripts/install.sh'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'do-harness',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  codeRepository: REPO_URL,
  description:
    'A compiled agent-execution harness CLI. Feedforward guides plus feedback sensors that agents and CI must pass before code ships.',
  author: {
    '@type': 'Organization',
    name: 'd-o-hub',
    url: 'https://github.com/d-o-hub',
  },
}

async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(REPO_API, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as { stargazers_count?: unknown }
    return typeof data.stargazers_count === 'number'
      ? data.stargazers_count
      : null
  } catch {
    return null
  }
}

/**
 * SHA-256 of the exact bytes raw.githubusercontent serves for install.sh —
 * the content `curl | sh` executes. Same source as the pipe, same 1h
 * revalidate as the star count. null on any failure: the row degrades to
 * the read-the-script link instead of showing a stale or invented hash.
 */
async function getInstallScriptChecksum(): Promise<string | null> {
  try {
    const res = await fetch(INSTALL_SCRIPT_URL, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const body = await res.arrayBuffer()
    const hex = createHash('sha256').update(Buffer.from(body)).digest('hex')
    return /^[0-9a-f]{64}$/.test(hex) ? hex : null
  } catch {
    return null
  }
}

export default async function Home() {
  const [stars, scriptChecksum] = await Promise.all([
    getStars(),
    getInstallScriptChecksum(),
  ])

  return (
    <div className="flex min-h-svh flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-sm"
      >
        Skip to content
      </a>
      <Nav stars={stars} />
      <main id="main" className="flex-1">
        <Hero />
        <LogoStrip />
        <Thesis />
        <HowItWorks />
        <Bento />
        <Install scriptChecksum={scriptChecksum} />
        <Compliance />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
