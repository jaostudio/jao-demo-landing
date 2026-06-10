import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '../components/layout/Navbar'
import { IndustryController } from '../components/industry/IndustryController'
import { IndustrySwitcher } from '../components/industry/IndustrySwitcher'
import { MobileBottomDock } from '../components/layout/MobileBottomDock'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://jaostudio.com'),
  title: 'Portfolio Showcase — Three Bespoke Business Websites',
  description:
    'A conversion-focused landing page architecture with swappable industry verticals.',
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', url: '/favicon.svg' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <Providers>
          <IndustryController>
            <Navbar />
            <div className="pt-16">{children}</div>
            <MobileBottomDock>
              <IndustrySwitcher embedded />
            </MobileBottomDock>
          </IndustryController>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
