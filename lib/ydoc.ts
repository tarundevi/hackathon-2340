import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import type { Entity, Relationship, ViewPosition } from '@/types/graph'

// Initialize shared Y.Doc
export const ydoc = new Y.Doc()

// WebSocket provider for real-time sync
// During dev: ws://localhost:1234
// In production: use env var NEXT_PUBLIC_WS_URL
const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:1234'
export const provider = new WebsocketProvider(
  wsUrl,
  'hackathon-room',
  ydoc
)

// Create shared data structures within Y.Doc
export const yEntities = ydoc.getMap<Entity>('entities')
export const yRelationships = ydoc.getMap<Relationship>('relationships')
export const yPositions = ydoc.getArray<ViewPosition>('positions')

// UndoManager for undo/redo capability
export const undoManager = new Y.UndoManager([yEntities, yRelationships, yPositions])

// Awareness (for collaborative cursors later)
export const awareness = provider.awareness
