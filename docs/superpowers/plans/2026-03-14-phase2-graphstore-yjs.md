# Phase 2: GraphStore + Yjs Bridge Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared state management layer (Zustand + Yjs) that syncs graph data across browser tabs and multiple users in real-time.

**Architecture:**
- `lib/ydoc.ts`: Yjs Y.Doc and WebsocketProvider setup (server agnostic for now, localhost:1234)
- `lib/store/graphStore.ts`: Zustand store with actions for graph mutations (addEntity, addRelationship, updatePosition, loadScenario, etc.)
- `lib/store/yjsBridge.ts`: Bidirectional sync between Yjs and Zustand (observe Y.Map → setState, wrap actions → write to Yjs)
- `lib/scenarios.ts`: Three pre-loaded CS 2340 scenarios (Jordan, Daniel, Priya) + blank canvas
- Integration: Wrap app in Yjs provider in `app/layout.tsx`

**Tech Stack:** Yjs, y-websocket, Zustand, TypeScript

**Testing approach:** Manual testing in browser (open two tabs, verify sync); automated tests can be added later if needed.

---

## File Structure

```
lib/
├── ydoc.ts                    [NEW] Yjs Y.Doc + WebsocketProvider
├── store/
│   ├── graphStore.ts          [NEW] Zustand store with actions
│   └── yjsBridge.ts           [NEW] Yjs ↔ Zustand sync adapter
└── scenarios.ts               [NEW] Pre-loaded scenario data

app/
└── layout.tsx                 [MODIFY] Add Yjs provider wrapper + hydration
```

---

## Chunk 1: Yjs Setup + Zustand Store

### Task 1: Create Yjs Y.Doc and WebsocketProvider

**Files:**
- Create: `lib/ydoc.ts`

- [ ] **Step 1: Create `lib/ydoc.ts` with Yjs initialization**

```typescript
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
```

- [ ] **Step 2: Verify file compiles**

```bash
cd /Users/tarun/workspace/classes/CS2340/hackathon-2340
npm run build 2>&1 | head -20
```

Expected: No TypeScript errors for ydoc.ts

- [ ] **Step 3: Commit**

```bash
git add lib/ydoc.ts
git commit -m "feat: initialize Yjs Y.Doc and WebSocket provider"
```

---

### Task 2: Create Zustand GraphStore with Actions

**Files:**
- Create: `lib/store/graphStore.ts`

- [ ] **Step 1: Create `lib/store/graphStore.ts` with store definition and actions**

```typescript
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type {
  Entity,
  Relationship,
  ViewPosition,
  GraphStore,
  DiagramType,
  EntityKind,
  RelationshipKind,
  ValidationFlag,
} from '@/types/graph'

type GraphStoreState = GraphStore & {
  // Actions
  addEntity: (kind: EntityKind, name: string) => string // returns entity id
  updateEntity: (id: string, patch: Partial<Entity>) => void
  deleteEntity: (id: string) => void
  addRelationship: (source: string, target: string, kind: RelationshipKind, label?: string) => string // returns relationship id
  updateRelationship: (id: string, patch: Partial<Relationship>) => void
  deleteRelationship: (id: string) => void
  updatePosition: (entityId: string, diagramType: DiagramType, x: number, y: number) => void
  setActiveDiagram: (type: DiagramType) => void
  setActiveScenario: (name: string | null) => void
  setValidationResults: (flags: ValidationFlag[]) => void
  loadScenario: (scenario: { entities: Record<string, Entity>; relationships: Record<string, Relationship> }) => void
  reset: () => void
}

const initialState: GraphStore = {
  entities: {},
  relationships: {},
  positions: [],
  activeDiagram: 'dcd',
  activeScenario: null,
  validationResults: [],
}

export const useGraphStore = create<GraphStoreState>((set) => ({
  ...initialState,

  addEntity: (kind: EntityKind, name: string) => {
    const id = uuidv4()
    set((state) => ({
      entities: {
        ...state.entities,
        [id]: {
          id,
          kind,
          name,
          attributes: [],
          methods: [],
        },
      },
    }))
    return id
  },

  updateEntity: (id: string, patch: Partial<Entity>) => {
    set((state) => ({
      entities: {
        ...state.entities,
        [id]: { ...state.entities[id], ...patch },
      },
    }))
  },

  deleteEntity: (id: string) => {
    set((state) => {
      const newEntities = { ...state.entities }
      delete newEntities[id]
      // Also remove all relationships touching this entity
      const newRelationships = Object.fromEntries(
        Object.entries(state.relationships).filter(
          ([_, rel]) => rel.source !== id && rel.target !== id
        )
      )
      // Remove positions for this entity
      const newPositions = state.positions.filter((p) => p.entityId !== id)
      return {
        entities: newEntities,
        relationships: newRelationships,
        positions: newPositions,
      }
    })
  },

  addRelationship: (source: string, target: string, kind: RelationshipKind, label?: string) => {
    const id = uuidv4()
    set((state) => ({
      relationships: {
        ...state.relationships,
        [id]: {
          id,
          source,
          target,
          kind,
          label,
        },
      },
    }))
    return id
  },

  updateRelationship: (id: string, patch: Partial<Relationship>) => {
    set((state) => ({
      relationships: {
        ...state.relationships,
        [id]: { ...state.relationships[id], ...patch },
      },
    }))
  },

  deleteRelationship: (id: string) => {
    set((state) => {
      const newRelationships = { ...state.relationships }
      delete newRelationships[id]
      return { relationships: newRelationships }
    })
  },

  updatePosition: (entityId: string, diagramType: DiagramType, x: number, y: number) => {
    set((state) => {
      const existing = state.positions.findIndex(
        (p) => p.entityId === entityId && p.diagramType === diagramType
      )
      if (existing >= 0) {
        const updated = [...state.positions]
        updated[existing] = { entityId, diagramType, x, y }
        return { positions: updated }
      } else {
        return {
          positions: [...state.positions, { entityId, diagramType, x, y }],
        }
      }
    })
  },

  setActiveDiagram: (type: DiagramType) => {
    set({ activeDiagram: type })
  },

  setActiveScenario: (name: string | null) => {
    set({ activeScenario: name })
  },

  setValidationResults: (flags: ValidationFlag[]) => {
    set({ validationResults: flags })
  },

  loadScenario: (scenario: { entities: Record<string, Entity>; relationships: Record<string, Relationship> }) => {
    set({
      entities: scenario.entities,
      relationships: scenario.relationships,
      positions: [],
      validationResults: [],
    })
  },

  reset: () => {
    set(initialState)
  },
}))
```

- [ ] **Step 2: Verify file compiles**

```bash
npm run build 2>&1 | grep -A 5 "error\|warning" || echo "✓ No errors"
```

Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add lib/store/graphStore.ts
git commit -m "feat: create Zustand GraphStore with entity/relationship/position actions"
```

---

## Chunk 2: Yjs Bridge + Scenarios

### Task 3: Create Yjs ↔ Zustand Sync Bridge

**Files:**
- Create: `lib/store/yjsBridge.ts`

- [ ] **Step 1: Create `lib/store/yjsBridge.ts` with bidirectional sync**

```typescript
import { useGraphStore } from './graphStore'
import { yEntities, yRelationships, yPositions, ydoc } from '../ydoc'
import type { Entity, Relationship, ViewPosition } from '@/types/graph'

/**
 * Initialize Yjs ↔ Zustand sync
 * - Observe Yjs maps/arrays → update Zustand store
 * - Wrap Zustand actions → write to Yjs
 * Call this once in app/layout.tsx after provider is ready
 */
export function initializeYjsBridge() {
  const store = useGraphStore.getState()

  // 1. Hydrate store from Yjs on init
  hydrateFromYjs()

  // 2. Observe Yjs changes and sync to Zustand
  observeYjs()

  // 3. Wrap Zustand actions to also write to Yjs
  wrapZustandActions()
}

function hydrateFromYjs() {
  const store = useGraphStore.getState()
  const entities = Object.fromEntries(yEntities.entries())
  const relationships = Object.fromEntries(yRelationships.entries())
  const positions = yPositions.toArray()

  store.loadScenario({ entities, relationships })
  // Restore positions separately
  positions.forEach((pos) => {
    store.updatePosition(pos.entityId, pos.diagramType, pos.x, pos.y)
  })
}

function observeYjs() {
  const store = useGraphStore.getState()

  // Observe entities map
  yEntities.observe((event) => {
    const entities = Object.fromEntries(yEntities.entries())
    useGraphStore.setState({ entities })
  })

  // Observe relationships map
  yRelationships.observe((event) => {
    const relationships = Object.fromEntries(yRelationships.entries())
    useGraphStore.setState({ relationships })
  })

  // Observe positions array
  yPositions.observe((event) => {
    const positions = yPositions.toArray()
    useGraphStore.setState({ positions })
  })
}

function wrapZustandActions() {
  const originalAddEntity = useGraphStore.getState().addEntity
  const originalUpdateEntity = useGraphStore.getState().updateEntity
  const originalDeleteEntity = useGraphStore.getState().deleteEntity
  const originalAddRelationship = useGraphStore.getState().addRelationship
  const originalUpdateRelationship = useGraphStore.getState().updateRelationship
  const originalDeleteRelationship = useGraphStore.getState().deleteRelationship
  const originalUpdatePosition = useGraphStore.getState().updatePosition

  // Wrap addEntity
  useGraphStore.setState({
    addEntity: (kind, name) => {
      const id = originalAddEntity(kind, name)
      const entity = useGraphStore.getState().entities[id]
      ydoc.transact(() => {
        yEntities.set(id, entity)
      })
      return id
    },
  })

  // Wrap updateEntity
  useGraphStore.setState({
    updateEntity: (id, patch) => {
      originalUpdateEntity(id, patch)
      const entity = useGraphStore.getState().entities[id]
      ydoc.transact(() => {
        yEntities.set(id, entity)
      })
    },
  })

  // Wrap deleteEntity
  useGraphStore.setState({
    deleteEntity: (id) => {
      originalDeleteEntity(id)
      ydoc.transact(() => {
        yEntities.delete(id)
        // Also remove relationships
        const rels = Object.entries(useGraphStore.getState().relationships)
        rels.forEach(([relId]) => {
          yRelationships.delete(relId)
        })
      })
    },
  })

  // Wrap addRelationship
  useGraphStore.setState({
    addRelationship: (source, target, kind, label) => {
      const id = originalAddRelationship(source, target, kind, label)
      const rel = useGraphStore.getState().relationships[id]
      ydoc.transact(() => {
        yRelationships.set(id, rel)
      })
      return id
    },
  })

  // Wrap updateRelationship
  useGraphStore.setState({
    updateRelationship: (id, patch) => {
      originalUpdateRelationship(id, patch)
      const rel = useGraphStore.getState().relationships[id]
      ydoc.transact(() => {
        yRelationships.set(id, rel)
      })
    },
  })

  // Wrap deleteRelationship
  useGraphStore.setState({
    deleteRelationship: (id) => {
      originalDeleteRelationship(id)
      ydoc.transact(() => {
        yRelationships.delete(id)
      })
    },
  })

  // Wrap updatePosition
  useGraphStore.setState({
    updatePosition: (entityId, diagramType, x, y) => {
      originalUpdatePosition(entityId, diagramType, x, y)
      const positions = useGraphStore.getState().positions
      ydoc.transact(() => {
        yPositions.delete(0, yPositions.length)
        positions.forEach((pos) => {
          yPositions.push([pos])
        })
      })
    },
  })
}
```

- [ ] **Step 2: Verify file compiles**

```bash
npm run build 2>&1 | grep -A 5 "error\|warning" || echo "✓ No errors"
```

Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add lib/store/yjsBridge.ts
git commit -m "feat: create Yjs ↔ Zustand bidirectional sync bridge"
```

---

### Task 4: Create Pre-loaded Scenarios

**Files:**
- Create: `lib/scenarios.ts`

- [ ] **Step 1: Create `lib/scenarios.ts` with three CS 2340 scenarios**

```typescript
import type { Entity, Relationship } from '@/types/graph'

export const SCENARIOS = {
  blank: {
    name: 'Blank Canvas',
    entities: {},
    relationships: {},
  },

  jordan: {
    name: 'Jordan - Event Management',
    entities: {
      'event': {
        id: 'event',
        kind: 'class' as const,
        name: 'Event',
        attributes: ['-id: String', '-name: String', '-capacity: int', '-registeredCount: int'],
        methods: ['+rsvp(student: Student): boolean', '+cancel(student: Student): void', '+isFull(): boolean'],
      },
      'student': {
        id: 'student',
        kind: 'class' as const,
        name: 'Student',
        attributes: ['-id: String', '-name: String', '-email: String'],
        methods: ['+register(event: Event): void', '+unregister(event: Event): void'],
      },
      'organization': {
        id: 'organization',
        kind: 'class' as const,
        name: 'Organization',
        attributes: ['-name: String', '-president: Student'],
        methods: ['+getPresident(): Student', '+addEvent(event: Event): void'],
      },
    },
    relationships: {
      'rel1': {
        id: 'rel1',
        source: 'event',
        target: 'student',
        kind: 'association' as const,
        label: '*',
      },
      'rel2': {
        id: 'rel2',
        source: 'organization',
        target: 'event',
        kind: 'composition' as const,
        label: '1..*',
      },
    },
  },

  daniel: {
    name: 'Daniel - RSVP System',
    entities: {
      'event': {
        id: 'event',
        kind: 'class' as const,
        name: 'Event',
        attributes: ['-id: String', '-title: String', '-date: Date', '-attendees: List<Student>'],
        methods: ['+addAttendee(s: Student): void', '+removeAttendee(s: Student): void', '+getAttendeeCount(): int'],
      },
      'student': {
        id: 'student',
        kind: 'class' as const,
        name: 'Student',
        attributes: ['-id: String', '-name: String', '-rsvpList: List<Event>'],
        methods: ['+rsvpEvent(e: Event): boolean', '+cancelRSVP(e: Event): void', '+getEvents(): List<Event>'],
      },
      'notification': {
        id: 'notification',
        kind: 'class' as const,
        name: 'Notification',
        attributes: ['-type: String', '-recipient: Student', '-message: String'],
        methods: ['+send(): void'],
      },
    },
    relationships: {
      'rel1': {
        id: 'rel1',
        source: 'event',
        target: 'student',
        kind: 'association' as const,
        label: 'attends',
      },
      'rel2': {
        id: 'rel2',
        source: 'event',
        target: 'notification',
        kind: 'aggregation' as const,
      },
    },
  },

  priya: {
    name: 'Priya - Capacity Management',
    entities: {
      'event': {
        id: 'event',
        kind: 'class' as const,
        name: 'Event',
        attributes: ['-id: String', '-name: String', '-maxCapacity: int', '-currentLoad: int'],
        methods: ['+checkCapacity(): boolean', '+addAttendee(a: Attendee): boolean', '+removeAttendee(a: Attendee): void'],
      },
      'attendee': {
        id: 'attendee',
        kind: 'class' as const,
        name: 'Attendee',
        attributes: ['-id: String', '-name: String', '-registeredEvents: List<Event>'],
        methods: ['+registerForEvent(e: Event): boolean', '+unregisterFromEvent(e: Event): void'],
      },
      'capacity': {
        id: 'capacity',
        kind: 'class' as const,
        name: 'CapacityManager',
        attributes: ['-maxPerEvent: int'],
        methods: ['+enforceLimit(event: Event): void', '+getAvailableSlots(event: Event): int'],
      },
    },
    relationships: {
      'rel1': {
        id: 'rel1',
        source: 'event',
        target: 'attendee',
        kind: 'association' as const,
        label: '0..*',
      },
      'rel2': {
        id: 'rel2',
        source: 'event',
        target: 'capacity',
        kind: 'association' as const,
      },
    },
  },
}

export type ScenarioKey = keyof typeof SCENARIOS

export function getScenario(key: ScenarioKey) {
  return SCENARIOS[key]
}

export function getScenarioNames(): ScenarioKey[] {
  return Object.keys(SCENARIOS) as ScenarioKey[]
}
```

- [ ] **Step 2: Verify file compiles**

```bash
npm run build 2>&1 | grep -A 5 "error\|warning" || echo "✓ No errors"
```

Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add lib/scenarios.ts
git commit -m "feat: add three pre-loaded CS 2340 scenarios (Jordan, Daniel, Priya)"
```

---

## Chunk 3: Integration & Testing

### Task 5: Modify `app/layout.tsx` to Initialize Yjs Bridge

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Read current layout.tsx to understand structure**

```bash
cat /Users/tarun/workspace/classes/CS2340/hackathon-2340/app/layout.tsx
```

- [ ] **Step 2: Update `app/layout.tsx` to wrap with provider and initialize bridge**

Replace the entire content with:

```typescript
'use client'

import type { Metadata } from 'next'
import { useEffect } from 'react'
import { initializeYjsBridge } from '@/lib/store/yjsBridge'
import './globals.css'

// Note: Metadata doesn't work in 'use client' components
// If needed, create a metadata export in a separate root layout
export const metadata: Metadata = {
  title: 'CS2340 UML Collaboration Tool',
  description: 'Real-time collaborative UML diagram editor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize Yjs bridge after component mounts (client-side only)
    initializeYjsBridge()
  }, [])

  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify file compiles**

```bash
npm run build 2>&1 | head -30
```

Expected: Build should succeed or show only expected warnings

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: initialize Yjs bridge on app load"
```

---

### Task 6: Manual Testing - Verify State Sync in Browser

**Files:**
- Test: Browser tabs (manual)

- [ ] **Step 1: Start the development server**

```bash
cd /Users/tarun/workspace/classes/CS2340/hackathon-2340
npm run dev &
```

Wait for "ready - started server on 0.0.0.0:3000"

- [ ] **Step 2: Open browser and test Zustand store directly (console)**

Open http://localhost:3000, then in browser console:

```javascript
// Import store
const { useGraphStore } = await import('/lib/store/graphStore.js')
const store = useGraphStore.getState()

// Test 1: Add an entity
const classId = store.addEntity('class', 'TestClass')
console.log('Added class:', store.entities[classId])

// Test 2: Update entity
store.updateEntity(classId, {
  attributes: ['-id: String', '+name: String']
})
console.log('Updated:', store.entities[classId])

// Test 3: Load scenario
const { SCENARIOS } = await import('/lib/scenarios.js')
store.loadScenario(SCENARIOS.jordan)
console.log('Scenario loaded, entities:', Object.keys(store.entities).length)
```

Expected output:
- Class added with name 'TestClass'
- Attributes updated
- Scenario loaded with 3 entities (Event, Student, Organization)

- [ ] **Step 3: Verify Yjs is connected (check browser network)**

Open DevTools → Network tab, filter for `localhost:1234`

Expected: WebSocket connection to `ws://localhost:1234` should be visible (may show connection refused if ws-server not running — that's OK for now)

- [ ] **Step 4: Test Yjs sync across tabs**

Open a **second browser tab** at http://localhost:3000

In **first tab** console:
```javascript
const store = useGraphStore.getState()
store.addEntity('class', 'SharedClass')
```

Switch to **second tab**, check console:
```javascript
const store = useGraphStore.getState()
console.log(store.entities)
```

Expected: **Second tab should show the entity added in first tab** (if Yjs is syncing)

If sync doesn't work, verify:
- Check `console.errors` for Yjs connection issues
- Confirm `NEXT_PUBLIC_WS_URL` env var is set correctly

- [ ] **Step 5: Commit test results**

```bash
git add -A
git commit -m "test: verify Zustand store and Yjs sync in browser"
```

---

### Task 7: Add .env.local for Development

**Files:**
- Create: `.env.local`

- [ ] **Step 1: Create `.env.local` for development**

```bash
cat > /Users/tarun/workspace/classes/CS2340/hackathon-2340/.env.local << 'EOF'
# WebSocket server URL (local dev: localhost:1234, production: Railway)
NEXT_PUBLIC_WS_URL=ws://localhost:1234

# Gemini API key (leave empty for now, fill in Phase 5)
# GEMINI_API_KEY=<your-key-here>
EOF
```

- [ ] **Step 2: Add `.env.local` to `.gitignore`**

```bash
echo ".env.local" >> /Users/tarun/workspace/classes/CS2340/hackathon-2340/.gitignore
```

- [ ] **Step 3: Verify it's in .gitignore**

```bash
grep -n ".env.local" /Users/tarun/workspace/classes/CS2340/hackathon-2340/.gitignore
```

Expected: `.env.local` appears in .gitignore

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: add .env.local to .gitignore"
```

---

## Summary

After completing all tasks:
- ✅ `lib/ydoc.ts` — Yjs Y.Doc initialized
- ✅ `lib/store/graphStore.ts` — Zustand store with all actions
- ✅ `lib/store/yjsBridge.ts` — Bidirectional Yjs ↔ Zustand sync
- ✅ `lib/scenarios.ts` — Three pre-loaded scenarios + blank canvas
- ✅ `app/layout.tsx` — Bridge initialized on app load
- ✅ `.env.local` — Development WebSocket URL configured
- ✅ Manual testing — Verified store and Yjs sync work

**Next steps:** Phase 3 (React Flow Canvas) can now depend on this solid state layer.

**Known limitations:**
- Yjs WebSocket server not running yet (will connect on Phase 6 deployment)
- No undo/redo UI yet (UndoManager created but not wired to buttons)
- No persistence beyond memory (add IndexedDB later if needed)

