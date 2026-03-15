"use client"

import { useEffect, useState } from 'react';
import { awareness } from '@/lib/ydoc';

export default function CollabCursors() {
  const [cursors, setCursors] = useState<Map<number, { x: number, y: number, color: string, name: string }>>(new Map());

  useEffect(() => {
    // Listen to remote cursor updates
    const onAwarenessChange = () => {
      const states = Array.from(awareness.getStates().entries());
      const newMap = new Map();
      states.forEach(([clientId, state]) => {
        if (clientId !== awareness.clientID && state?.cursor && state?.user) {
          newMap.set(clientId, {
            x: state.cursor.x,
            y: state.cursor.y,
            color: state.user.color,
            name: state.user.name,
          });
        }
      });
      setCursors(newMap);
    };

    awareness.on('change', onAwarenessChange);

    // Track local mouse movement and broadcast
    const onMouseMove = (e: MouseEvent) => {
      awareness.setLocalStateField('cursor', {
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      awareness.off('change', onAwarenessChange);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      {Array.from(cursors.entries()).map(([clientId, c]) => (
        <div 
          key={clientId} 
          className="pointer-events-none fixed z-50 flex flex-col pt-4 pl-4"
          style={{ transform: `translate(${c.x}px, ${c.y}px)`, transition: 'transform 0.05s linear' }}
        >
          {/* Custom Cursor SVG */}
          <svg className="absolute top-0 left-0 w-5 h-5" style={{ fill: c.color }} viewBox="0 0 24 24">
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"/>
          </svg>
          <div 
            className="ml-4 mt-2 px-2 py-0.5 rounded text-white text-xs font-medium whitespace-nowrap shadow-md opacity-90"
            style={{ backgroundColor: c.color }}
          >
            {c.name}
          </div>
        </div>
      ))}
    </>
  );
}
