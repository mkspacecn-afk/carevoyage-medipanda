import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CareVoyage - Premium Medical Tourism in China',
  description: 'Experience China\'s world-class medical care with personalized service. From precision health screening to specialized treatments.',
  keywords: 'medical tourism, china healthcare, west china hospital, health screening, dental implant, TCM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}