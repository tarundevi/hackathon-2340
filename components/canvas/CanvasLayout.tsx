'use client'

import { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import DiagramCanvas from './DiagramCanvas'
import DiagramTabs from './DiagramTabs'
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

  const diagramLabel =
    activeDiagram === 'dcd' ? 'DCD' :
    activeDiagram === 'dmd' ? 'DMD' :
    activeDiagram === 'ucd' ? 'UCD' :
    activeDiagram === 'sd' ? 'SD' : 'SSD'

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen bg-gray-50 gap-3 p-3">
        {/* Left Panel - Scenarios, tools, and search */}
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
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Compact Top Bar */}
          <div className="bg-white rounded-xl shadow-md px-3 py-2 flex items-center justify-between border border-gray-200">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-black uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-1 rounded-md">{diagramLabel}</span>
              <h1 className="text-sm font-bold text-gray-900 truncate">{room}</h1>
            </div>
            <div className="flex items-center gap-2">
              <details className="relative">
                <summary className="list-none cursor-pointer px-3 py-1.5 rounded-md border border-gray-200 bg-white text-xs font-semibold text-gt-navy hover:bg-gray-50 transition">
                  Room Menu
                </summary>
                <div className="absolute right-0 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-xl p-3 z-30">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Collaboration</p>
                  <div className="mb-3">
                    <PresenceBar />
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <ShareButton room={room} />
                    <button
                      onClick={onExitRoom}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-semibold transition"
                    >
                      Exit
                    </button>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Diagram Tabs */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <DiagramTabs />
          </div>

          {/* Playback Slider - Show in SD and SSD */}
          {(activeDiagram === 'sd' || activeDiagram === 'ssd') && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3">
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
