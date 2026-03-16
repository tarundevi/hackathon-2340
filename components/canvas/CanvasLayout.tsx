'use client'

import { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import DiagramCanvas from './DiagramCanvas'
import DiagramTabs from './DiagramTabs'
import Toolbar from './Toolbar'
import PlaybackSlider from './PlaybackSlider'
import LeftPanel from '../panels/LeftPanel'
import RightPanel from '../panels/RightPanel'
import PresenceBar from '../collab/PresenceBar'
import ShareButton from '../collab/ShareButton'
import ActivityLog from '../collab/ActivityLog'
import { useGraphStore } from '@/lib/store/graphStore'

interface CanvasLayoutProps {
  room: string
  onExitRoom: () => void
}

export default function CanvasLayout({ room, onExitRoom }: CanvasLayoutProps) {
  const activeDiagram = useGraphStore(state => state.activeDiagram)
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(true)

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen bg-gray-50 gap-4 p-4">
        {/* Left Panel - Scenarios & Collaborators */}
        {leftOpen ? (
          <LeftPanel onToggle={() => setLeftOpen(false)} />
        ) : (
          <button
            onClick={() => setLeftOpen(true)}
            title="Show left panel"
            className="self-start mt-2 p-2 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-gt-navy transition-all"
          >
            ▶
          </button>
        )}

        {/* Center Content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Header with Room Info */}
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between border border-gray-200">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-lg font-bold text-gray-900">Room: {room}</h1>
                <p className="text-sm text-gray-600">Real-time collaboration enabled</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <PresenceBar />
            </div>
            <div className="flex items-center gap-3">
              <ShareButton room={room} />
              <button
                onClick={onExitRoom}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
              >
                Exit Room
              </button>
            </div>
          </div>

          {/* Diagram Tabs */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <DiagramTabs />
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <Toolbar />
          </div>

          {/* Playback Slider - Show in SD and SSD */}
          {(activeDiagram === 'sd' || activeDiagram === 'ssd') && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
              <PlaybackSlider />
            </div>
          )}

          {/* Canvas Area */}
          <div className="flex-1 overflow-hidden min-h-0 relative">
            <DiagramCanvas />
            <ActivityLog />
          </div>
        </div>

        {/* Right Panel - AI Assistant & Traceability */}
        {rightOpen ? (
          <RightPanel onToggle={() => setRightOpen(false)} />
        ) : (
          <button
            onClick={() => setRightOpen(true)}
            title="Show right panel"
            className="self-start mt-2 p-2 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-gt-navy transition-all"
          >
            ◀
          </button>
        )}
      </div>
    </ReactFlowProvider>
  )
}
