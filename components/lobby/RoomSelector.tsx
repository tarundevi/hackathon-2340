'use client'

import { useState } from 'react'
import { generateRoomId, setRoomInUrl } from '@/lib/rooms'

export interface RoomSelectorProps {
  onRoomSelected: (room: string) => void
}

export default function RoomSelector({ onRoomSelected }: RoomSelectorProps) {
  const [joinRoomInput, setJoinRoomInput] = useState('')
  const [customRoomInput, setCustomRoomInput] = useState('')

  const handleQuickStart = () => {
    const roomId = generateRoomId()
    setRoomInUrl(roomId)
    onRoomSelected(roomId)
  }

  const handleJoinRoom = () => {
    if (joinRoomInput.trim()) {
      const roomId = joinRoomInput.trim().toUpperCase()
      setRoomInUrl(roomId)
      onRoomSelected(roomId)
    }
  }

  const handleCreateRoom = () => {
    if (customRoomInput.trim()) {
      const roomId = customRoomInput.trim().toUpperCase()
      setRoomInUrl(roomId)
      onRoomSelected(roomId)
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">UML Collaboration</h1>
          <p className="mt-2 text-gray-600">CS 2340 Real-Time Diagram Editor</p>
        </div>

        {/* Quick Start */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Quick Start</h2>
          <button
            onClick={handleQuickStart}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 transition"
          >
            Create New Room
          </button>
          <p className="text-sm text-gray-500 text-center">
            Generates a random room ID for instant collaboration
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        {/* Join Existing Room */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Join Room</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={joinRoomInput}
              onChange={(e) => setJoinRoomInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              placeholder="Enter room code (e.g., ABC1234)"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleJoinRoom}
              disabled={!joinRoomInput.trim()}
              className="rounded-lg bg-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-400 disabled:opacity-50 transition"
            >
              Join
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        {/* Custom Room */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Custom Room</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={customRoomInput}
              onChange={(e) => setCustomRoomInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
              placeholder="Choose a room name"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleCreateRoom}
              disabled={!customRoomInput.trim()}
              className="rounded-lg bg-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-400 disabled:opacity-50 transition"
            >
              Create
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
          <p>All diagrams are synced in real-time across collaborators in the same room.</p>
        </div>
      </div>
    </div>
  )
}
