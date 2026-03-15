'use client'

import { useEffect } from 'react'

import { initializeYjsBridge } from '@/lib/store/yjsBridge'
import './globals.css'

// Note: Metadata doesn't work in 'use client' components
// If needed, create a metadata export in a separate root layout

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize Yjs bridge after component mounts (client-side only)
    initializeYjsBridge()
  }, [])

  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden">
        {children}
      </body>
    </html>
  )
}
