"use client"

import { useState, useRef, useEffect } from 'react'
import { useActivityLog } from '@/lib/activityLog'
import { useActivityBridge } from '@/lib/activityBridge'

function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const ACTION_LABELS: Record<string, string> = {
  added: 'added',
  removed: 'removed',
  edited: 'edited',
}

export default function ActivityLog() {
  useActivityBridge()

  const events = useActivityLog(state => state.events)
  const [expanded, setExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current && expanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [events, expanded])

  return (
    <div className="absolute bottom-3 right-3 z-20 flex flex-col items-end">
      <button
        onClick={() => setExpanded(!expanded)}
        className="bg-white/95 backdrop-blur border border-gray-200 shadow-lg rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Activity
        {events.length > 0 && (
          <span className="bg-gt-navy text-white px-1.5 py-0.5 rounded-full text-[10px] leading-none">
            {events.length}
          </span>
        )}
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-2 w-72 max-h-56 bg-white/95 backdrop-blur border border-gray-200 shadow-xl rounded-xl overflow-hidden">
          {events.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400">
              No activity yet. Add or remove entities to see events here.
            </div>
          ) : (
            <div ref={scrollRef} className="overflow-y-auto max-h-56 divide-y divide-gray-100">
              {events.map(event => (
                <div key={event.id} className="px-3 py-2 flex items-start gap-2 text-xs">
                  <div
                    className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-800">{event.userName}</span>
                    {' '}
                    <span className="text-gray-500">{ACTION_LABELS[event.action]}</span>
                    {' '}
                    <span className="font-medium text-gray-700">
                      {event.entityKind} &ldquo;{event.entityName}&rdquo;
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
