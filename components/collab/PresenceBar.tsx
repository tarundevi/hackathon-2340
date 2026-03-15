"use client"

import { useEffect, useState } from 'react'
import { awareness } from '@/lib/ydoc'

type Participant = {
  clientId: number
  name: string
  color: string
}

const PALETTE = ['#EAAA00', '#262262', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6']

export default function PresenceBar() {
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    const myColor = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    const myName = `User ${Math.floor(Math.random() * 1000)}`

    const existing = awareness.getLocalState()
    if (!existing?.user) {
      awareness.setLocalStateField('user', { name: myName, color: myColor })
    }

    const sync = () => {
      const states = Array.from(awareness.getStates().entries())
      const users = states
        .filter(([_, s]) => s?.user)
        .map(([id, s]) => ({ clientId: id, name: s.user.name, color: s.user.color }))
      setParticipants(users)
    }

    awareness.on('change', sync)
    sync()
    return () => { awareness.off('change', sync) }
  }, [])

  const me = participants.find(p => p.clientId === awareness.clientID)
  const others = participants.filter(p => p.clientId !== awareness.clientID)

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
        Online
      </span>
      <div className="flex -space-x-2">
        {me && (
          <div
            key={me.clientId}
            title={`${me.name} (You)`}
            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-offset-1 ring-gt-techgold cursor-default"
            style={{ backgroundColor: me.color }}
          >
            {me.name.split(' ').map(w => w[0]).join('')}
          </div>
        )}
        {others.map(p => (
          <div
            key={p.clientId}
            title={p.name}
            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm cursor-default"
            style={{ backgroundColor: p.color }}
          >
            {p.name.split(' ').map(w => w[0]).join('')}
          </div>
        ))}
      </div>
      <span className="text-xs text-gray-400 ml-1">
        {participants.length} {participants.length === 1 ? 'person' : 'people'}
      </span>
    </div>
  )
}
