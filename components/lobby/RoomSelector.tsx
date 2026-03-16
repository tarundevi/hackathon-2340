'use client'

import { useState } from 'react'
import Link from 'next/link'
import { generateRoomId, setRoomInUrl } from '@/lib/rooms'

export interface RoomSelectorProps {
  onRoomSelected: (room: string) => void
}

export default function RoomSelector({ onRoomSelected }: RoomSelectorProps) {
  const [username, setUsername] = useState('')
  const [joinRoomInput, setJoinRoomInput] = useState('')
  const [customRoomInput, setCustomRoomInput] = useState('')

  const saveAndEnter = (roomId: string) => {
    if (username.trim()) {
      localStorage.setItem('uml-username', username.trim())
    }
    setRoomInUrl(roomId)
    onRoomSelected(roomId)
  }

  const handleQuickStart = () => {
    saveAndEnter(generateRoomId())
  }

  const handleJoinRoom = () => {
    if (joinRoomInput.trim()) {
      saveAndEnter(joinRoomInput.trim().toUpperCase())
    }
  }

  const handleCreateRoom = () => {
    if (customRoomInput.trim()) {
      saveAndEnter(customRoomInput.trim().toUpperCase())
    }
  }

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-gt-navy">
      {/* Animated background grid effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Decorative accent */}

      <div className="relative w-full max-w-md space-y-8 rounded-md bg-white p-10 border border-gt-gold/10">
        {/* Header with icon */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-gt-navy">
            <span className="text-2xl font-bold text-gt-techgold">🔗</span>
          </div>
          <h1 className="text-4xl font-black text-gt-navy tracking-tight">UML Workspace</h1>
          <p className="text-sm font-medium text-gt-navy/60 uppercase tracking-widest">Georgia Tech • CS 2340</p>
        </div>

        {/* Learn Link */}
        <Link
          href="/learn"
          className="group relative flex items-center justify-center gap-2 w-full py-3.5 rounded-md bg-gradient-to-r from-gt-techgold via-[#fcdb73] to-gt-techgold bg-[length:200%_auto] text-gt-navy font-black text-sm transition-all duration-500 hover:bg-right shadow-[0_0_15px_rgba(234,170,0,0.3)] hover:shadow-[0_0_25px_rgba(234,170,0,0.6)] hover:-translate-y-0.5 border border-[#ffeaa7]"
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-300">📚</span> 
          <span>Learn UML Diagrams (UCD, DMD, DCD, SD, SSD)</span>
        </Link>

        {/* Username */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gt-navy uppercase tracking-widest opacity-70">Your Name</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-md border-2 border-gt-gold/20 px-4 py-3 text-gt-navy placeholder-gt-navy/30 focus:border-gt-techgold focus:outline-none bg-gt-navy/2 transition-colors"
          />
        </div>

        {/* Quick Start */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gt-navy uppercase tracking-widest opacity-70">Quick Start</h2>
          <button
            onClick={handleQuickStart}
            className="w-full rounded-md bg-gt-navy px-6 py-4 font-bold text-white transition-all duration-300 ease-out hover:bg-gt-navy/90 hover:-translate-y-[2px] hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-gt-navy/30 focus:ring-offset-2"
          >
            Create New Room
          </button>
          <p className="text-xs text-gt-navy/50 text-center leading-relaxed">
            Generate a unique room ID for instant real-time collaboration
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gt-gold/20" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gt-navy/40 font-medium uppercase tracking-widest">OR</span>
          </div>
        </div>

        {/* Join Existing Room */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gt-navy uppercase tracking-widest opacity-70">Join Room</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={joinRoomInput}
              onChange={(e) => setJoinRoomInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              placeholder="Enter room code"
              className="flex-1 rounded-md border-2 border-gt-gold/20 px-4 py-3 text-gt-navy placeholder-gt-navy/30 focus:border-gt-techgold focus:outline-none bg-gt-navy/2 transition-colors"
            />
            <button
              onClick={handleJoinRoom}
              disabled={!joinRoomInput.trim()}
              className="rounded-md bg-gt-techgold hover:bg-[#e0a800] disabled:opacity-50 px-5 py-3 font-bold text-gt-navy transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-gt-techgold/50 focus:ring-offset-2 disabled:transform-none disabled:shadow-none disabled:hover:bg-gt-techgold disabled:cursor-not-allowed"
            >
              Join
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gt-gold/20" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gt-navy/40 font-medium uppercase tracking-widest">OR</span>
          </div>
        </div>

        {/* Custom Room */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gt-navy uppercase tracking-widest opacity-70">Custom Room</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={customRoomInput}
              onChange={(e) => setCustomRoomInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
              placeholder="Choose a room name"
              className="flex-1 rounded-md border-2 border-gt-gold/20 px-4 py-3 text-gt-navy placeholder-gt-navy/30 focus:border-gt-techgold focus:outline-none bg-gt-navy/2 transition-colors"
            />
            <button
              onClick={handleCreateRoom}
              disabled={!customRoomInput.trim()}
              className="rounded-md bg-gt-techgold hover:bg-[#e0a800] disabled:opacity-50 px-5 py-3 font-bold text-gt-navy transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-gt-techgold/50 focus:ring-offset-2 disabled:transform-none disabled:shadow-none disabled:hover:bg-gt-techgold disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gt-gold/10 pt-6 text-center text-xs text-gt-navy/50 leading-relaxed">
          <p>✨ All diagrams sync in real-time with your team</p>
        </div>
      </div>
    </div>
  )
}
