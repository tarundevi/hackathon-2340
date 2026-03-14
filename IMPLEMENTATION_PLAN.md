# CS 2340 UML Collaboration Tool — Implementation Plan

## Context

Building a real-time collaborative UML modeling tool for CS 2340 coursework. The tool needs to keep Use Case Diagram (UCD), Detailed Class Diagram (DCD), and Sequence Diagram (SD) in sync through a single underlying graph store. An AI-powered TA checks for logic errors using the Gemini API. Yjs provides real-time multi-user collaboration. The project is a blank slate (empty git repo) and must be built from scratch in ~48 hours.

**User decisions:**
- All 4 features: Multi-Diagram Canvas, Real-Time Collab, AI Engine, Time-Travel Debugger
- AI: Gemini API (gemini-1.5-flash)
- Collab: Full network sync via y-websocket server
- Deploy: Next.js on Vercel + y-websocket server on Railway
- Scenarios: Pre-loaded Jordan/Daniel/Priya templates + blank canvas

---

## Architecture

**Monolithic Next.js 14 App Router** (Option A)

```
hackathon-2340/
├── app/
│   ├── layout.tsx              # Root layout (providers)
│   ├── page.tsx                # Main canvas page
│   └── api/
│       └── validate/
│           └── route.ts        # POST /api/validate → Gemini
├── components/
│   ├── canvas/
│   │   ├── DiagramCanvas.tsx   # React Flow wrapper
│   │   ├── DiagramTabs.tsx     # UCD / DCD / SD tab switcher
│   │   ├── Toolbar.tsx         # Add Class, Add Actor, Connect, Undo
│   │   └── PlaybackSlider.tsx  # Time-travel debugger (SD only)
│   ├── nodes/
│   │   ├── ClassNode.tsx       # 3-compartment UML class node
│   │   ├── ActorNode.tsx       # Stick figure (UCD)
│   │   ├── UseCaseNode.tsx     # Oval (UCD)
│   │   └── LifelineNode.tsx    # Vertical dashed line (SD)
│   ├── panels/
│   │   ├── LeftPanel.tsx       # Scenarios + collaborator presence
│   │   └── RightPanel.tsx      # AI Assistant + Traceability Navigator
│   └── cursors/
│       └── CollabCursors.tsx   # Live cursor overlays
├── lib/
│   ├── store/
│   │   ├── graphStore.ts       # Zustand store definition
│   │   └── yjsBridge.ts        # Yjs ↔ Zustand sync adapter
│   ├── ydoc.ts                 # Yjs Y.Doc + WebsocketProvider setup
│   ├── scenarios.ts            # Pre-loaded CS 2340 scenario data
│   └── gemini.ts               # Gemini API client wrapper
├── ws-server/
│   └── server.js               # y-websocket standalone server (Railway)
└── types/
    └── graph.ts                # TypeScript types for Entity, Relationship, etc.
```

---

## Data Schema (`types/graph.ts`)

```typescript
type Entity = {
  id: string
  kind: 'class' | 'actor' | 'usecase' | 'lifeline'
  name: string
  attributes: string[]   // e.g. ["-id: String", "+name: String"]
  methods: string[]      // e.g. ["+rsvp(): void", "+cancel(): boolean"]
}

type Relationship = {
  id: string
  source: string
  target: string
  kind: 'association' | 'aggregation' | 'composition' | 'inheritance' | 'extends' | 'includes' | 'message'
  label?: string         // multiplicity (e.g. "1..*") or message name
  sequenceIndex?: number // for SD messages ordering
}

type ViewPosition = {
  entityId: string
  diagramType: 'ucd' | 'dcd' | 'sd'
  x: number
  y: number
}

type GraphStore = {
  entities: Record<string, Entity>
  relationships: Record<string, Relationship>
  positions: ViewPosition[]
  activeDiagram: 'ucd' | 'dcd' | 'sd'
  activeScenario: string | null
  validationResults: ValidationFlag[]
}

type ValidationFlag = {
  severity: 'error' | 'warning'
  message: string
  entityId?: string
}
```

---

## Implementation Phases

### Phase 1: Project Scaffold ✅ (COMPLETED)

**Goal:** Working Next.js app with basic layout.

**Completed:**
- ✅ Created `package.json` with all dependencies
- ✅ Created `tsconfig.json`, `next.config.ts`
- ✅ Created `tailwind.config.ts` and `postcss.config.mjs`
- ✅ Created `types/graph.ts` with full type definitions
- ✅ Created `app/layout.tsx` and `app/page.tsx` with 3-panel layout shell
- ✅ Created `app/globals.css` with Tailwind setup
- ✅ Created `lib/gemini.ts` Gemini API client
- ✅ Created `app/api/validate/route.ts` API endpoint
- ✅ Created `ws-server/server.js` for Railway
- ✅ Created directory structure

**Next:** Install npm dependencies and test basic app

---

### Phase 2: GraphStore + Yjs Bridge (Hours 2-6)

**Goal:** Shared state that syncs across browser tabs.

**Tasks:**

1. Create `lib/ydoc.ts`:
   ```typescript
   import * as Y from 'yjs'
   import { WebsocketProvider } from 'y-websocket'

   export const ydoc = new Y.Doc()
   export const provider = new WebsocketProvider(
     process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:1234',
     'hackathon-room',
     ydoc
   )
   export const yEntities = ydoc.getMap<Entity>('entities')
   export const yRelationships = ydoc.getMap<Relationship>('relationships')
   export const yPositions = ydoc.getArray<ViewPosition>('positions')
   ```

2. Create `lib/store/graphStore.ts` (Zustand store with actions):
   - `addEntity(kind, name)` → creates Entity, adds to yEntities
   - `updateEntity(id, patch)` → patches entity
   - `deleteEntity(id)` → removes entity + all relationships touching it
   - `addRelationship(source, target, kind, label?)` → creates Relationship
   - `updatePosition(entityId, diagramType, x, y)` → upserts ViewPosition
   - `setActiveDiagram(type)` → switches tab
   - `loadScenario(name)` → bulk-loads scenario data

3. Create `lib/store/yjsBridge.ts`:
   - Observes Yjs Y.Map changes → calls Zustand `setState`
   - Wraps Zustand actions to also write to Yjs
   - Handles initial hydration on connect

4. Create `lib/scenarios.ts`:
   - `SCENARIOS.jordan` — Event Management scenario entities/relationships
   - `SCENARIOS.daniel` — Student RSVP scenario
   - `SCENARIOS.priya` — Capacity Management scenario
   - `SCENARIOS.blank` — empty GraphStore

**Jordan scenario pre-load example:**
```typescript
entities: {
  'e1': { id: 'e1', kind: 'class', name: 'Event', attributes: ['-id: String', '-name: String', '-capacity: int'], methods: ['+rsvp(student: Student): boolean', '+cancel(student: Student): void'] },
  'e2': { id: 'e2', kind: 'class', name: 'Student', attributes: ['-id: String', '+name: String'], methods: ['+register(): void'] },
  'e3': { id: 'e3', kind: 'class', name: 'Organization', attributes: ['-name: String'], methods: ['+getPresident(): Student'] },
  ...
}
```

---

### Phase 3: React Flow Canvas + Custom Nodes (Hours 6-14)

**Goal:** Fully functional UML diagram editor.

**Tasks:**

1. Create `components/nodes/ClassNode.tsx`:
   - 3 sections: name (bold, centered), attributes, methods
   - Inline editing: double-click to edit name/attributes/methods
   - Visibility badge: `+` public, `-` private, `#` protected
   - Selection highlight + resize handles
   - Wire to `graphStore.updateEntity()`

2. Create `components/nodes/ActorNode.tsx`:
   - SVG stick figure + label below
   - Used in UCD only

3. Create `components/nodes/UseCaseNode.tsx`:
   - Rounded oval with centered label
   - Used in UCD only

4. Create `components/nodes/LifelineNode.tsx`:
   - Vertical dashed line header box + activation bars
   - Used in SD only

5. Create `components/canvas/DiagramCanvas.tsx`:
   - React Flow with custom node types registered
   - `nodeTypes = { class: ClassNode, actor: ActorNode, usecase: UseCaseNode, lifeline: LifelineNode }`
   - Derives React Flow `nodes` and `edges` from `graphStore` based on `activeDiagram`
   - `onNodesChange` → `graphStore.updatePosition()`
   - `onConnect` → `graphStore.addRelationship()`
   - Edge types: straight (association), dashed (dependency/include/extend), hollow diamond (aggregation), filled diamond (composition), open triangle (inheritance)

6. Create `components/canvas/DiagramTabs.tsx`:
   - Tabs: UCD | DCD | SD
   - Switching tab changes `activeDiagram` in store
   - Each tab renders the same entities but filtered by `kind` relevance:
     - UCD: actors + usecases + extends/includes relationships
     - DCD: classes + association/aggregation/composition/inheritance
     - SD: lifelines + messages (ordered by sequenceIndex)

7. Create `components/canvas/Toolbar.tsx`:
   - Buttons: Add Class, Add Actor, Add Use Case, Add Lifeline
   - Connect mode toggle
   - Undo (Yjs has built-in undo: `new Y.UndoManager([yEntities, yRelationships])`)
   - Export to PNG (React Flow `getViewport()` + html2canvas)

8. Create `components/canvas/PlaybackSlider.tsx`:
   - Only visible in SD tab
   - Slider 0 → N where N = number of SD messages
   - On change: highlights messages with sequenceIndex ≤ slider value
   - Play/Pause button with auto-advance every 1.5s

---

### Phase 4: Panels (Hours 14-18)

**Goal:** Left sidebar scenarios + right AI panel.

**Tasks:**

1. Create `components/panels/LeftPanel.tsx`:
   - Scenario list: Jordan, Daniel, Priya, Blank
   - Click → `graphStore.loadScenario(name)` with confirm dialog
   - Collaborator presence: show online users from Yjs awareness
   - User avatar: random color dot + name from `provider.awareness.setLocalStateField('name', 'Partner A')`

2. Create `components/panels/RightPanel.tsx`:
   - Two tabs: "AI Assistant" | "Traceability"
   - AI tab: "Run AI Check" button + list of `ValidationFlag` items
     - Each flag: severity icon + message + click-to-highlight entity
     - Error = red border, Warning = yellow border
   - Traceability tab: entity list showing which diagrams each entity appears in

3. Create `components/cursors/CollabCursors.tsx`:
   - Reads `provider.awareness.getStates()` for remote cursor positions
   - Renders colored `<div>` overlays with partner names on the canvas

---

### Phase 5: AI Validation Engine (Hours 18-24)

**Goal:** Working Gemini-powered `/api/validate` endpoint.

**Tasks:**

1. Create `lib/gemini.ts`:
   ```typescript
   import { GoogleGenerativeAI } from '@google/generative-ai'
   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
   export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
   ```

2. Create `app/api/validate/route.ts`:
   ```typescript
   export async function POST(req: Request) {
     const graphStore = await req.json()
     const prompt = buildValidationPrompt(graphStore)
     const result = await model.generateContent(prompt)
     const flags = parseGeminiResponse(result.response.text())
     return Response.json({ flags })
   }
   ```

3. Validation prompt covers:
   - SD messages referencing methods not in DCD
   - Missing multiplicity labels (1..1, 0..*, 1..*)
   - Missing visibility (+ or -) on DCD attributes/methods
   - Wrong arrow types (solid vs dashed vs open)
   - Missing Capacity Management logic in relevant scenarios

4. Wire "Run AI Check" button in RightPanel → `POST /api/validate` → store results → highlight flagged nodes

---

### Phase 6: Polish + Deployment (Hours 24-36)

**Goal:** Deploy and verify full round-trip.

**Tasks:**

1. Add `.env.local`:
   ```
   NEXT_PUBLIC_WS_URL=wss://your-ws-server.railway.app
   GEMINI_API_KEY=your-key-here
   ```

2. Deploy y-websocket server to Railway:
   - `ws-server/server.js` uses `y-websocket` package
   - Railway auto-detects Node.js, sets `PORT` env var
   - `node ws-server/server.js`

3. Deploy Next.js to Vercel:
   - Connect GitHub repo, set env vars
   - `vercel --prod`

4. Verify end-to-end:
   - Open app in two browser tabs with different scenario
   - Confirm Yjs sync (add class in tab A → appears in tab B)
   - Run AI validation → see Red Flags
   - Test playback slider in SD tab

---

## Key Files Summary

| File | Purpose |
|------|---------|
| `types/graph.ts` | Core TypeScript types |
| `lib/ydoc.ts` | Yjs Y.Doc + WebsocketProvider |
| `lib/store/graphStore.ts` | Zustand store + actions |
| `lib/store/yjsBridge.ts` | Yjs ↔ Zustand sync |
| `lib/scenarios.ts` | CS 2340 pre-loaded scenarios |
| `lib/gemini.ts` | Gemini API client |
| `app/api/validate/route.ts` | AI validation endpoint |
| `components/nodes/ClassNode.tsx` | 3-compartment UML class |
| `components/canvas/DiagramCanvas.tsx` | React Flow main canvas |
| `components/canvas/DiagramTabs.tsx` | UCD/DCD/SD tab switcher |
| `components/canvas/PlaybackSlider.tsx` | Time-travel debugger |
| `components/panels/LeftPanel.tsx` | Scenarios + presence |
| `components/panels/RightPanel.tsx` | AI results + traceability |
| `ws-server/server.js` | y-websocket Railway server |

---

## Verification Plan

1. **GraphStore sync:** Add entity in DCD → verify it appears as lifeline option in SD
2. **Yjs collaboration:** Open two tabs, rename class in one → confirm instant update in other
3. **Multi-cursor:** Move mouse in tab A → see cursor in tab B
4. **AI validation:** Load Jordan scenario, remove `+rsvp()` from Event class, run AI check → expect "rsvp() called in SD but not found in DCD" error
5. **Playback slider:** Load Daniel scenario SD → drag slider → messages highlight in order
6. **Deployment:** Test Vercel URL from two machines on different networks → confirm real-time sync via Railway WS server

---

## Dependencies to Install

```bash
npm install reactflow zustand yjs y-websocket @google/generative-ai uuid
npm install -D @types/uuid
```
