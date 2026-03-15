"use client"

import { useEffect, useState, useCallback } from 'react'
import { awareness } from '@/lib/ydoc'

export type RemoteSelection = {
  clientId: number
  selectedNodeId: string | null
  userName: string
  color: string
}

export function usePresenceSelection() {
  const [remoteSelections, setRemoteSelections] = useState<RemoteSelection[]>([])

  const setLocalSelection = useCallback((nodeId: string | null) => {
    awareness.setLocalStateField('selection', { nodeId })
  }, [])

  useEffect(() => {
    const sync = () => {
      const states = Array.from(awareness.getStates().entries())
      const selections = states
        .filter(([id, s]) => id !== awareness.clientID && s?.user && s?.selection)
        .map(([id, s]) => ({
          clientId: id,
          selectedNodeId: s.selection.nodeId,
          userName: s.user.name,
          color: s.user.color,
        }))
      setRemoteSelections(selections)
    }

    awareness.on('change', sync)
    sync()
    return () => { awareness.off('change', sync) }
  }, [])

  return { remoteSelections, setLocalSelection }
}

export function getRemoteSelectorsForNode(
  nodeId: string,
  remoteSelections: RemoteSelection[]
): RemoteSelection[] {
  return remoteSelections.filter(s => s.selectedNodeId === nodeId)
}
