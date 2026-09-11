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
  title: 'Hybrid Quantum ML Platform — SIH Problem Statement 26139',
  description: 'End-to-end Hybrid Quantum Machine Learning platform for early disease detection. Benchmarks QSVM, VQC, and QNN against classical baselines on biomedical datasets — Smart India Hackathon PS-26139.',
  keywords: ['quantum machine learning', 'QML', 'QSVM', 'VQC', 'QNN', 'biomedical AI', 'SIH 2024', 'early disease detection', 'quantum computing healthcare'],
  authors: [{ name: 'SIH 26139 Team' }],
  openGraph: {
    title: 'Hybrid QML Platform — Early Disease Detection (SIH-26139)',
    description: 'Benchmarks quantum vs classical ML on breast cancer, cardiovascular, diabetes, Parkinson\'s, and genomics datasets.',
    type: 'website',
    siteName: 'QML Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hybrid QML Platform — SIH Problem Statement 26139',
    description: 'QSVM · VQC · QNN vs Classical ML on 5 biomedical datasets. Noise analysis, XAI, hardware readiness.',
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
