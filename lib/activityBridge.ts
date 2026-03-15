import { useEffect, useRef } from 'react'
import { useGraphStore } from '@/lib/store/graphStore'
import { useActivityLog } from '@/lib/activityLog'
import { awareness } from '@/lib/ydoc'
import type { Entity } from '@/types/graph'

export function useActivityBridge() {
  const entities = useGraphStore(state => state.entities)
  const prevEntitiesRef = useRef<Record<string, Entity>>({})
  const addEvent = useActivityLog(state => state.addEvent)

  useEffect(() => {
    const prev = prevEntitiesRef.current
    const current = entities

    const localState = awareness.getLocalState()
    const userName = localState?.user?.name || 'Unknown'
    const color = localState?.user?.color || '#999'

    const prevIds = new Set(Object.keys(prev))
    const currentIds = new Set(Object.keys(current))

    for (const id of currentIds) {
      if (!prevIds.has(id)) {
        addEvent({
          action: 'added',
          entityKind: current[id].kind,
          entityName: current[id].name,
          userName,
          color,
        })
      }
    }

    for (const id of prevIds) {
      if (!currentIds.has(id)) {
        addEvent({
          action: 'removed',
          entityKind: prev[id].kind,
          entityName: prev[id].name,
          userName,
          color,
        })
      }
    }

    prevEntitiesRef.current = current
  }, [entities, addEvent])
}
