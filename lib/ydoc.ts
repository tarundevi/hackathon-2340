import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import type { Entity, Relationship, ViewPosition } from '@/types/graph'

// Global instance holder for dynamic room support
let globalYdoc: Y.Doc | null = null
let globalProvider: WebsocketProvider | null = null
let globalUndoManager: Y.UndoManager | null = null
let globalYEntities: Y.Map<Entity> | null = null
let globalYRelationships: Y.Map<Relationship> | null = null
let globalYPositions: Y.Array<ViewPosition> | null = null

function getRoomFromUrl(): string {
  if (typeof window === 'undefined') return 'default-room'
  const params = new URLSearchParams(window.location.search)
  return params.get('room') || 'default-room'
}

export function initializeYdoc(room: string) {
  // Clean up previous instance if it exists
  if (globalProvider) {
    globalProvider.disconnect()
  }

  // Create new Y.Doc
  globalYdoc = new Y.Doc()

  // WebSocket provider for real-time sync
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:1234'
  globalProvider = new WebsocketProvider(
    wsUrl,
    room,
    globalYdoc
  )

  // Create shared data structures
  globalYEntities = globalYdoc.getMap<Entity>('entities')
  globalYRelationships = globalYdoc.getMap<Relationship>('relationships')
  globalYPositions = globalYdoc.getArray<ViewPosition>('positions')

  // UndoManager for undo/redo capability
  globalUndoManager = new Y.UndoManager([globalYEntities, globalYRelationships, globalYPositions])
}

// Initialize on first load
if (typeof window !== 'undefined') {
  const room = getRoomFromUrl()
  initializeYdoc(room)
}

// Getters for accessing global instances
export function getYdoc(): Y.Doc {
  if (!globalYdoc) {
    const room = getRoomFromUrl()
    initializeYdoc(room)
  }
  return globalYdoc!
}

export function getProvider(): WebsocketProvider {
  if (!globalProvider) {
    const room = getRoomFromUrl()
    initializeYdoc(room)
  }
  return globalProvider!
}

export function getYEntities(): Y.Map<Entity> {
  if (!globalYEntities) {
    const room = getRoomFromUrl()
    initializeYdoc(room)
  }
  return globalYEntities!
}

export function getYRelationships(): Y.Map<Relationship> {
  if (!globalYRelationships) {
    const room = getRoomFromUrl()
    initializeYdoc(room)
  }
  return globalYRelationships!
}

export function getYPositions(): Y.Array<ViewPosition> {
  if (!globalYPositions) {
    const room = getRoomFromUrl()
    initializeYdoc(room)
  }
  return globalYPositions!
}

export function getUndoManager(): Y.UndoManager {
  if (!globalUndoManager) {
    const room = getRoomFromUrl()
    initializeYdoc(room)
  }
  return globalUndoManager!
}

export function getAwareness() {
  return getProvider().awareness
}

// Exports for backwards compatibility
export const ydoc = getYdoc()
export const provider = getProvider()
export const yEntities = getYEntities()
export const yRelationships = getYRelationships()
export const yPositions = getYPositions()
export const undoManager = getUndoManager()
export const awareness = getAwareness()
