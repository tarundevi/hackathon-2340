"use client"

import type { RemoteSelection } from '@/lib/usePresenceSelection'

interface SelectionRingProps {
  selectors: RemoteSelection[]
  children: React.ReactNode
  className?: string
}

export default function SelectionRing({ selectors, children, className = '' }: SelectionRingProps) {
  if (selectors.length === 0) {
    return <div className={className}>{children}</div>
  }

  const primaryColor = selectors[0].color
  const names = selectors.map(s => s.userName).join(', ')

  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute -inset-2 rounded-xl pointer-events-none z-10 animate-pulse"
        style={{
          border: `2.5px solid ${primaryColor}`,
          boxShadow: `0 0 8px ${primaryColor}40`,
        }}
      />
      <div
        className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-semibold text-white z-20 pointer-events-none shadow-sm"
        style={{ backgroundColor: primaryColor }}
      >
        {names}
      </div>
      {children}
    </div>
  )
}
