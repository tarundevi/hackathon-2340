'use client'

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

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen bg-gray-50 gap-4 p-4">
        {/* Left Panel - Scenarios & Collaborators */}
        <LeftPanel />

        {/* Center Content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Header with Room Info */}
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between border border-gray-200">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Room: {room}</h1>
              <p className="text-sm text-gray-600">Real-time collaboration enabled</p>
            </div>
            <button
              onClick={onExitRoom}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
            >
              Exit Room
            </button>
          </div>

          {/* Diagram Tabs */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <DiagramTabs />
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <Toolbar />
          </div>

          {/* Playback Slider - Only show in SD */}
          {activeDiagram === 'sd' && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
              <PlaybackSlider />
            </div>
          )}

          {/* Canvas Area */}
          <div className="flex-1 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden min-h-0">
            <DiagramCanvas />
          </div>
        </div>

        {/* Right Panel - AI Assistant & Traceability */}
        <RightPanel />
      </div>
    </ReactFlowProvider>
  )
}
