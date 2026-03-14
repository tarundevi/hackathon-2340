import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CS 2340 UML Collaboration Tool',
  description: 'Real-time collaborative UML diagram editor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div className="h-screen w-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}
