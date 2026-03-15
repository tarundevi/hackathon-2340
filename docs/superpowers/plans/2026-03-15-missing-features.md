# Missing Features Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add delete UI, relationship label editing, node search, and diagram comments to the UML collaboration tool.

**Architecture:** Each feature is self-contained. Delete adds keyboard/button handlers to existing nodes. Edge label editing uses ReactFlow's `onEdgeClick` + a floating input. Node search filters the LeftPanel entity list. Comments add a new `comment` EntityKind with its own node component.

**Tech Stack:** Next.js 15, React 18, ReactFlow 11, Zustand, Yjs, TypeScript, Tailwind CSS

---

## Chunk 1: Delete Node/Edge UI

### Task 1: Delete button on nodes + Delete key handler

**Files:**
- Modify: `components/nodes/ClassNode.tsx`
- Modify: `components/nodes/ActorNode.tsx`
- Modify: `components/nodes/UseCaseNode.tsx`
- Modify: `components/nodes/LifelineNode.tsx`
- Modify: `components/canvas/DiagramCanvas.tsx`

- [ ] **Step 1: Add delete button to ClassNode**

In `components/nodes/ClassNode.tsx`, add a delete button that appears on hover. Add `deleteEntity` from store and render a `×` button in the top-right of the node header:

```tsx
const deleteEntity = useGraphStore(state => state.deleteEntity);

// In the name header div, add:
<div className="relative group ...existing classes...">
  {/* existing name content */}
  <button
    onClick={(e) => { e.stopPropagation(); deleteEntity(entity.id); }}
    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
    title="Delete node"
  >×</button>
</div>
```

- [ ] **Step 2: Add delete button to ActorNode, UseCaseNode, LifelineNode**

Read each node file and add the same pattern — hover `×` button that calls `deleteEntity(entity.id)`.

- [ ] **Step 3: Add Delete key handler in DiagramCanvas**

In `components/canvas/DiagramCanvas.tsx`, track selected node/edge and delete on keydown:

```tsx
const deleteEntity = useGraphStore(state => state.deleteEntity);
const deleteRelationship = useGraphStore(state => state.deleteRelationship);
const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Don't fire if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (selectedNodeId) deleteEntity(selectedNodeId);
      if (selectedEdgeId) deleteRelationship(selectedEdgeId);
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [selectedNodeId, selectedEdgeId, deleteEntity, deleteRelationship]);

// Update onNodeClick to also track selectedNodeId:
const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
  setLocalSelection(node.id);
  setSelectedNodeId(node.id);
  setSelectedEdgeId(null);
}, [setLocalSelection]);

const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
  setSelectedEdgeId(edge.id);
  setSelectedNodeId(null);
}, []);

const onPaneClick = useCallback(() => {
  setLocalSelection(null);
  setSelectedNodeId(null);
  setSelectedEdgeId(null);
}, [setLocalSelection]);

// Add to ReactFlow: onEdgeClick={onEdgeClick}
```

- [ ] **Step 4: Verify delete works** — add a class, click it, press Delete, confirm it disappears and its relationships are gone.

- [ ] **Step 5: Commit**
```bash
git add components/nodes/ components/canvas/DiagramCanvas.tsx
git commit -m "feat: add delete node/edge via hover button and Delete key"
```

---

## Chunk 2: Relationship Label Editing

### Task 2: Click edge label to edit inline

**Files:**
- Modify: `components/canvas/DiagramCanvas.tsx`
- Create: `components/canvas/EdgeLabelEditor.tsx`

- [ ] **Step 1: Create EdgeLabelEditor component**

Create `components/canvas/EdgeLabelEditor.tsx`:

```tsx
"use client"

import { useState, useEffect, useRef } from 'react';

interface EdgeLabelEditorProps {
  edgeId: string;
  initialLabel: string;
  position: { x: number; y: number };
  onSave: (edgeId: string, label: string) => void;
  onClose: () => void;
}

export default function EdgeLabelEditor({ edgeId, initialLabel, position, onSave, onClose }: EdgeLabelEditorProps) {
  const [value, setValue] = useState(initialLabel);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { onSave(edgeId, value); onClose(); }
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="absolute z-50 bg-white border-2 border-gt-navy rounded-md shadow-lg p-2 flex gap-2 items-center"
      style={{ left: position.x - 80, top: position.y - 20 }}
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { onSave(edgeId, value); onClose(); }}
        placeholder="e.g. 1..*, 0..1"
        className="w-40 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:border-gt-techgold"
      />
      <button
        onClick={() => { onSave(edgeId, value); onClose(); }}
        className="text-xs bg-gt-navy text-white px-2 py-1 rounded hover:bg-gt-navy/90"
      >
        ✓
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Wire EdgeLabelEditor into DiagramCanvas**

In `components/canvas/DiagramCanvas.tsx`:

```tsx
import EdgeLabelEditor from './EdgeLabelEditor';

// State:
const [editingEdge, setEditingEdge] = useState<{ id: string; label: string; x: number; y: number } | null>(null);
const updateRelationship = useGraphStore(state => state.updateRelationship);

// onEdgeDoubleClick handler:
const onEdgeDoubleClick = useCallback((e: React.MouseEvent, edge: Edge) => {
  const rel = relationships[edge.id];
  setEditingEdge({ id: edge.id, label: rel?.label || '', x: e.clientX, y: e.clientY });
}, [relationships]);

// In ReactFlow JSX: onEdgeDoubleClick={onEdgeDoubleClick}

// In return, after ReactFlow closing tag but inside the wrapper div:
{editingEdge && (
  <EdgeLabelEditor
    edgeId={editingEdge.id}
    initialLabel={editingEdge.label}
    position={{ x: editingEdge.x, y: editingEdge.y }}
    onSave={(id, label) => updateRelationship(id, { label })}
    onClose={() => setEditingEdge(null)}
  />
)}
```

- [ ] **Step 3: Verify** — connect two nodes, double-click the edge, type a label like `1..*`, press Enter, confirm label appears on the edge.

- [ ] **Step 4: Commit**
```bash
git add components/canvas/EdgeLabelEditor.tsx components/canvas/DiagramCanvas.tsx
git commit -m "feat: double-click edge to edit relationship label inline"
```

---

## Chunk 3: Node Search

### Task 3: Search/filter in LeftPanel

**Files:**
- Modify: `components/panels/LeftPanel.tsx`

- [ ] **Step 1: Add search state and input to LeftPanel**

In `components/panels/LeftPanel.tsx`, add entities from the store and a search input above the Collaborators section:

```tsx
import { useGraphStore } from '@/lib/store/graphStore';

// Inside component:
const entities = useGraphStore(state => state.entities);
const setActiveDiagram = useGraphStore(state => state.setActiveDiagram);
const [search, setSearch] = useState('');

const filteredEntities = Object.values(entities).filter(e =>
  e.name.toLowerCase().includes(search.toLowerCase())
);

const kindLabel: Record<string, string> = {
  class: 'DCD', actor: 'UCD', usecase: 'UCD', lifeline: 'SD', comment: 'All'
};
const kindColor: Record<string, string> = {
  class: 'bg-blue-100 text-blue-800',
  actor: 'bg-emerald-100 text-emerald-800',
  usecase: 'bg-emerald-100 text-emerald-800',
  lifeline: 'bg-purple-100 text-purple-800',
  comment: 'bg-gray-100 text-gray-700',
};
```

- [ ] **Step 2: Render search input and results**

Add a new section between Scenarios and Collaborators in the LeftPanel JSX:

```tsx
<div>
  <h2 className="text-[10px] font-black text-gt-navy mb-3 uppercase tracking-widest flex items-center gap-2 opacity-80">
    🔍 Search Nodes
  </h2>
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by name..."
    className="w-full rounded-md border border-gt-gold/20 px-3 py-2 text-sm text-gt-navy placeholder-gt-navy/30 focus:border-gt-techgold focus:outline-none bg-transparent transition-colors"
  />
  {search && (
    <ul className="mt-2 flex flex-col gap-1 max-h-48 overflow-y-auto">
      {filteredEntities.length === 0 && (
        <li className="text-xs text-gt-navy/40 italic px-1">No matches</li>
      )}
      {filteredEntities.map(e => (
        <li
          key={e.id}
          className="flex items-center gap-2 text-sm text-gt-navy/80 font-medium bg-gt-navy/5 px-3 py-2 rounded-md border border-gt-navy/10 hover:bg-gt-navy/10 cursor-pointer transition-all"
        >
          <span className="truncate flex-1">{e.name}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${kindColor[e.kind] || 'bg-gray-100'}`}>
            {kindLabel[e.kind] || e.kind.toUpperCase()}
          </span>
        </li>
      ))}
    </ul>
  )}
</div>
```

- [ ] **Step 3: Verify** — load a scenario, type a class name in the search, confirm matching nodes appear with their diagram badge.

- [ ] **Step 4: Commit**
```bash
git add components/panels/LeftPanel.tsx
git commit -m "feat: add node search/filter to left panel"
```

---

## Chunk 4: Diagram Comments

### Task 4: Sticky note comment nodes on canvas

**Files:**
- Modify: `types/graph.ts` — add `'comment'` to `EntityKind`
- Create: `components/nodes/CommentNode.tsx`
- Modify: `components/canvas/DiagramCanvas.tsx` — register comment node type
- Modify: `components/canvas/Toolbar.tsx` — add "Add Comment" button

- [ ] **Step 1: Add comment to EntityKind**

In `types/graph.ts`:
```ts
export type EntityKind = 'class' | 'actor' | 'usecase' | 'lifeline' | 'comment'
```

- [ ] **Step 2: Create CommentNode component**

Create `components/nodes/CommentNode.tsx`:

```tsx
"use client"

import { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useGraphStore } from '@/lib/store/graphStore';
import { Entity } from '@/types/graph';

export default function CommentNode({ data }: NodeProps) {
  if (!data.entity) return null;
  const entity = data.entity as Entity;
  const updateEntity = useGraphStore(state => state.updateEntity);
  const deleteEntity = useGraphStore(state => state.deleteEntity);
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(entity.name);

  const handleSave = () => {
    updateEntity(entity.id, { name: tempValue || '...' });
    setEditing(false);
  };

  return (
    <div className="relative group bg-yellow-100 border-2 border-yellow-400 rounded-md shadow-md p-3 min-w-[160px] max-w-[240px]">
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <button
        onClick={(e) => { e.stopPropagation(); deleteEntity(entity.id); }}
        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yellow-400 text-yellow-900 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-400 hover:text-white"
      >×</button>
      {editing ? (
        <textarea
          autoFocus
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => { if (e.key === 'Escape') setEditing(false); }}
          className="w-full bg-transparent text-sm text-yellow-900 font-medium resize-none focus:outline-none"
          rows={3}
        />
      ) : (
        <p
          onDoubleClick={() => { setEditing(true); setTempValue(entity.name); }}
          className="text-sm text-yellow-900 font-medium cursor-text whitespace-pre-wrap break-words"
        >
          {entity.name || 'Double-click to edit...'}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Register CommentNode in DiagramCanvas**

In `components/canvas/DiagramCanvas.tsx`:

```tsx
import CommentNode from '../nodes/CommentNode';

const nodeTypes = {
  class: ClassNode,
  actor: ActorNode,
  usecase: UseCaseNode,
  lifeline: LifelineNode,
  comment: CommentNode,
};
```

Also update `getRelevantKinds` to include comments in ALL diagrams:

```tsx
// After filtering nodes by relevantKinds, also include comments:
const nodes: Node[] = useMemo(() => {
  return Object.values(entities)
    .filter(e => relevantKinds.includes(e.kind) || e.kind === 'comment')
    .map(e => { ... })
}, [...]);
```

- [ ] **Step 4: Add "Add Comment" button to Toolbar**

In `components/canvas/Toolbar.tsx`, add after the existing add buttons:

```tsx
<button onClick={() => addEntity('comment', 'Add your note here...')} className={btnStyleSecondary}>
  💬 Comment
</button>
```

- [ ] **Step 5: Verify** — click "Comment", a yellow sticky note appears on all diagram tabs, double-click to edit text, hover to see delete button.

- [ ] **Step 6: Commit**
```bash
git add types/graph.ts components/nodes/CommentNode.tsx components/canvas/DiagramCanvas.tsx components/canvas/Toolbar.tsx
git commit -m "feat: add sticky note comment nodes to all diagrams"
```

---

## Final Step: Push

```bash
git push
```
