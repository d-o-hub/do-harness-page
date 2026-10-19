import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/site/theme-provider'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-sg',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jb',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'do-harness: agents that prove their work',
  description:
    'A compiled agent-execution harness CLI. Feedforward guides plus feedback sensors that agents and CI must pass before code ships.',
  keywords: [
    'do-harness',
    'AI agents',
    'verification',
    'CI',
    'developer tools',
    'Rust CLI',
  ],
  authors: [{ name: 'd-o-hub contributors' }],
  openGraph: {
    title: 'do-harness: agents that prove their work',
    description:
      'Feedforward guides plus feedback sensors that agents and CI must pass.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9f5' },
    { media: '(prefers-color-scheme: dark)', color: '#151b16' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
