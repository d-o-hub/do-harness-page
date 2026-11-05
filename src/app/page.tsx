import type { Metadata } from 'next'
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

export default async function Home() {
  const stars = await getStars()

  return (
    <div className="flex min-h-svh flex-col">
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
        <Install />
        <Compliance />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
