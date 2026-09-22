import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Courier_Prime } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _courierPrime = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"] });
const _ibmPlexSans = IBM_Plex_Sans({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ELVON — Hybrid Quantum Machine Learning Platform',
  description: 'End-to-end Hybrid Quantum Machine Learning platform for early disease detection. Benchmarks QSVM, VQC, and QNN against classical baselines on biomedical datasets.',
  keywords: ['quantum machine learning', 'QML', 'QSVM', 'VQC', 'QNN', 'biomedical AI', 'early disease detection', 'quantum computing healthcare', 'ELVON'],
  authors: [{ name: 'ELVON Team' }],
  openGraph: {
    title: 'ELVON — Quantum AI for Clinical Excellence',
    description: 'Benchmarks quantum vs classical ML on breast cancer, cardiovascular, diabetes, Parkinson\'s, and genomics datasets.',
    type: 'website',
    siteName: 'ELVON',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ELVON — Hybrid Quantum ML Platform',
    description: 'QSVM · VQC · QNN vs Classical ML on 5 biomedical datasets. Noise analysis, XAI, hardware readiness.',
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased relative min-h-screen`} suppressHydrationWarning>
        {/* Global Blurred Minimal Medical Pattern Background */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[-1]"
          style={{
            backgroundImage: "url('/medical-pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "320px 320px",
            opacity: 0.03,
            filter: "blur(8px)",
            transform: "scale(1.05)",
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
