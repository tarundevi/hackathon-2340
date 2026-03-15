'use client'

import { useState, useEffect } from 'react'
import { ReactFlowProvider } from 'reactflow'
import DiagramCanvas from './DiagramCanvas'
import DiagramTabs from './DiagramTabs'
import Toolbar from './Toolbar'
import PlaybackSlider from './PlaybackSlider'
import LeftPanel from '../panels/LeftPanel'
import RightPanel from '../panels/RightPanel'
import { useGraphStore } from '@/lib/store/graphStore'

interface CanvasLayoutProps {
  room: string
  onExitRoom: () => void
}

export default function CanvasLayout({ room, onExitRoom }: CanvasLayoutProps) {
  const activeDiagram = useGraphStore(state => state.activeDiagram)
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)

  // Persist panel visibility to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('panelVisibility')
    if (saved) {
      const { left, right } = JSON.parse(saved)
      setLeftPanelOpen(left)
      setRightPanelOpen(right)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('panelVisibility', JSON.stringify({
      left: leftPanelOpen,
      right: rightPanelOpen,
    }))
  }, [leftPanelOpen, rightPanelOpen])

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen bg-gray-50 gap-4 p-4">
        {/* Left Panel - Scenarios & Collaborators */}
        {leftPanelOpen && (
          <div className="animate-in fade-in slide-in-from-left duration-300">
            <LeftPanel onToggle={() => setLeftPanelOpen(false)} />
          </div>
        )}

        {/* Center Content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Header with Room Info */}
          <div className="bg-gt-navy rounded-md p-5 flex items-center justify-between border border-gt-navy/20">
            <div className="flex items-center gap-3">
              {/* Show left panel button when hidden */}
              {!leftPanelOpen && (
                <button
                  onClick={() => setLeftPanelOpen(true)}
                  title="Show scenarios panel"
                  className="p-2.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-all duration-200 border border-white/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  ▶
                </button>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🏛️</span>
                  <h1 className="text-xl font-black text-white tracking-tight">Room: {room}</h1>
                </div>
                <p className="text-sm text-gt-gold/80 font-medium">Real-time collaboration • Live</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Show right panel button when hidden */}
              {!rightPanelOpen && (
                <button
                  onClick={() => setRightPanelOpen(true)}
                  title="Show AI panel"
                  className="p-2.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-all duration-200 border border-white/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  ◀
                </button>
              )}
              <button
                onClick={onExitRoom}
                className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/20 rounded-md font-bold transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              >
                Exit
              </button>
            </div>
          </div>

          {/* Diagram Tabs */}
          <div className="bg-white rounded-md border border-gt-navy/20">
            <DiagramTabs />
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-md border border-gt-navy/20 p-4">
            <Toolbar />
          </div>

          {/* Playback Slider - Only show in SD */}
          {activeDiagram === 'sd' && (
            <div className="bg-white rounded-md border border-gt-navy/20 p-4">
              <PlaybackSlider />
            </div>
          )}

          {/* Canvas Area */}
          <div className="flex-1 bg-white rounded-md border border-gt-navy/20 overflow-hidden min-h-0">
            <DiagramCanvas />
          </div>
        </div>

        {/* Right Panel - AI Assistant & Traceability */}
        {rightPanelOpen && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <RightPanel onToggle={() => setRightPanelOpen(false)} />
          </div>
        )}
      </div>
    </ReactFlowProvider>
  )
}
