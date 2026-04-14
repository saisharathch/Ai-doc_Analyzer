import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'AI Document Analyzer — Powered by Claude',
  description: 'Upload any PDF and get an instant AI-powered summary, key points, and an interactive Q&A interface powered by Claude Sonnet.',
  keywords:    ['AI', 'PDF analyzer', 'Claude API', 'document summarizer', 'Next.js', 'TypeScript'],
  authors:     [{ name: 'Sai Sharath Chintakindi' }],
  openGraph: {
    title: 'AI Document Analyzer',
description: 'A production-grade PDF intelligence workspace for structured summaries and real-time document Q&A.',
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
