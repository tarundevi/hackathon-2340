'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import RoomSelector from '@/components/lobby/RoomSelector'
import CanvasLayout from '@/components/canvas/CanvasLayout'
import { getRoomFromUrl } from '@/lib/rooms'

export default function Home() {
  const [room, setRoom] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if room is in URL on initial load
    const urlRoom = getRoomFromUrl()
    if (urlRoom) {
      setRoom(urlRoom)
    }
    setIsLoading(false)
  }, [])

  const handleRoomSelected = (selectedRoom: string) => {
    setRoom(selectedRoom)
    // Update URL to reflect the room
    const url = new URL(window.location.href)
    url.searchParams.set('room', selectedRoom)
    window.history.replaceState({}, '', url.toString())
  }

  const handleExitRoom = () => {
    setRoom(null)
    // Clear room from URL
    const url = new URL(window.location.href)
    url.searchParams.delete('room')
    window.history.replaceState({}, '', url.toString())
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gt-navy">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-gt-techgold/20">
            <span className="text-3xl">🔗</span>
          </div>
          <p className="text-gt-gold font-bold tracking-widest uppercase text-sm">Loading workspace...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return <RoomSelector onRoomSelected={handleRoomSelected} />
  }

  return <CanvasLayout room={room} onExitRoom={handleExitRoom} />
}
