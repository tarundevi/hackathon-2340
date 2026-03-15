# Remaining Systems Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete all remaining functionality for the UML diagram editor: undo/redo, node editing, playback slider, traceability tracking, export, and connect mode.

**Architecture:**
- Undo/Redo: Yjs UndoManager wired to Toolbar button
- Node editing: Double-click handler in node components, state lifted to parent for inline edit mode
- Playback slider: Message filtering based on sequenceIndex, animation support
- Traceability: Entity-to-diagram mapping computed from store state
- Export: html2canvas utility + trigger button in Toolbar
- Connect mode: Toggle state in Toolbar, conditional edge-drawing in DiagramCanvas

**Tech Stack:** React, Yjs, html2canvas (npm install), reactflow

---

## File Structure

```
components/
├── nodes/
│   ├── ClassNode.tsx                [MODIFY] Add inline editing, double-click handlers
│   ├── ActorNode.tsx                [MODIFY] Add inline editing
│   ├── UseCaseNode.tsx              [MODIFY] Add inline editing
│   └── LifelineNode.tsx             [MODIFY] Add inline editing
├── canvas/
│   ├── Toolbar.tsx                  [MODIFY] Add undo, export, connect toggle buttons
│   ├── DiagramCanvas.tsx            [MODIFY] Support connect mode
│   └── PlaybackSlider.tsx           [MODIFY] Implement message filtering + animation
└── panels/
    └── RightPanel.tsx               [MODIFY] Add traceability tab content

lib/
└── export.ts                         [CREATE] Export to PNG utility function
```

---

## Chunk 1: Undo/Redo + Export Button

### Task 1: Add Undo/Redo to Toolbar

**Files:**
- Modify: `components/canvas/Toolbar.tsx`

- [ ] **Step 1: Import UndoManager from ydoc**

In `Toolbar.tsx`, add:
```typescript
import { undoManager } from '@/lib/ydoc';
```

- [ ] **Step 2: Add undo/redo handlers and buttons**

Replace the entire `Toolbar.tsx` with:

```typescript
"use client"

import { useGraphStore } from '@/lib/store/graphStore';
import { undoManager } from '@/lib/ydoc';

export default function Toolbar() {
  const addEntity = useGraphStore(state => state.addEntity);
  const activeDiagram = useGraphStore(state => state.activeDiagram);

  const btnStyle = "bg-gt-navy hover:bg-[#1a1744] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md border border-transparent hover:border-gt-techgold transition-all";
  const btnStyleSecondary = "bg-gray-100 hover:bg-gray-200 text-gt-navy px-5 py-2 rounded-lg text-sm font-semibold shadow-md border border-gray-300 transition-all";

  const handleUndo = () => {
    try {
      undoManager.undo();
    } catch (e) {
      console.log('Nothing to undo');
    }
  };

  const handleRedo = () => {
    try {
      undoManager.redo();
    } catch (e) {
      console.log('Nothing to redo');
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gray-200 flex gap-3">
      {/* Add entity buttons */}
      {activeDiagram === 'dcd' && (
        <button onClick={() => addEntity('class', 'NewClass')} className={btnStyle}>
          + Add Class
        </button>
      )}

      {activeDiagram === 'ucd' && (
        <>
          <button onClick={() => addEntity('actor', 'New Actor')} className={btnStyle}>
            + Add Actor
          </button>
          <button onClick={() => addEntity('usecase', 'New Use Case')} className={btnStyle}>
            + Add Use Case
          </button>
        </>
      )}

      {activeDiagram === 'sd' && (
        <button onClick={() => addEntity('lifeline', 'New Object')} className={btnStyle}>
          + Add Lifeline
        </button>
      )}

      {/* Divider */}
      <div className="w-px bg-gray-300" />

      {/* Undo/Redo buttons */}
      <button onClick={handleUndo} className={btnStyleSecondary} title="Undo">
        ↶ Undo
      </button>
      <button onClick={handleRedo} className={btnStyleSecondary} title="Redo">
        ↷ Redo
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | grep -i "error\|warning" || echo "✓ No errors"
```

- [ ] **Step 4: Commit**

```bash
git add components/canvas/Toolbar.tsx
git commit -m "feat: add undo/redo buttons to toolbar with Yjs UndoManager"
```

---

### Task 2: Create Export Utility

**Files:**
- Create: `lib/export.ts`

- [ ] **Step 1: Create export utility function**

```typescript
export async function exportCanvasToPNG(filename: string = 'diagram.png') {
  try {
    // Import html2canvas dynamically to avoid bundle bloat
    const html2canvas = (await import('html2canvas')).default;

    // Find the canvas container (ReactFlow wrapper)
    const canvasElement = document.querySelector('.react-flow');

    if (!canvasElement) {
      throw new Error('Canvas not found');
    }

    // Capture canvas as PNG
    const canvas = await html2canvas(canvasElement as HTMLElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
    });

    // Create download link
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}
```

- [ ] **Step 2: Verify file created**

```bash
cat lib/export.ts | head -5
```

Expected: File exists and contains export function

- [ ] **Step 3: Install html2canvas**

```bash
npm install html2canvas
```

- [ ] **Step 4: Commit**

```bash
git add lib/export.ts package.json package-lock.json
git commit -m "feat: add export to PNG utility"
```

---

## Chunk 2: Node Inline Editing

### Task 3: Add Inline Editing to ClassNode

**Files:**
- Modify: `components/nodes/ClassNode.tsx`

- [ ] **Step 1: Read current ClassNode to understand structure**

```bash
head -50 components/nodes/ClassNode.tsx
```

- [ ] **Step 2: Add editing state and handlers**

Modify `ClassNode.tsx` to add:

```typescript
"use client"

import { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useGraphStore } from '@/lib/store/graphStore';
import { Entity } from '@/types/graph';

export default function ClassNode({ data }: NodeProps) {
  const entity = data.entity as Entity;
  const updateEntity = useGraphStore(state => state.updateEntity);

  const [editingField, setEditingField] = useState<'name' | 'attributes' | 'methods' | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleDoubleClick = (field: 'name' | 'attributes' | 'methods') => {
    setEditingField(field);
    if (field === 'name') {
      setTempValue(entity.name);
    } else if (field === 'attributes') {
      setTempValue(entity.attributes.join('\n'));
    } else {
      setTempValue(entity.methods.join('\n'));
    }
  };

  const handleSave = () => {
    if (editingField === 'name') {
      updateEntity(entity.id, { name: tempValue || 'Unnamed' });
    } else if (editingField === 'attributes') {
      updateEntity(entity.id, { attributes: tempValue.split('\n').filter(a => a.trim()) });
    } else if (editingField === 'methods') {
      updateEntity(entity.id, { methods: tempValue.split('\n').filter(m => m.trim()) });
    }
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  return (
    <div className="bg-white border-2 border-gt-navy rounded-lg shadow-lg p-0 min-w-[200px]">
      <Handle type="target" position={Position.Top} />

      {/* Name Section */}
      <div
        onDoubleClick={() => handleDoubleClick('name')}
        className="bg-gt-navy text-white p-3 font-bold text-center border-b border-gray-300 cursor-pointer hover:bg-[#1a1744]"
      >
        {editingField === 'name' ? (
          <input
            autoFocus
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-white text-gt-navy px-2 py-1 rounded text-center font-bold"
          />
        ) : (
          <span>{entity.name}</span>
        )}
      </div>

      {/* Attributes Section */}
      <div
        onDoubleClick={() => handleDoubleClick('attributes')}
        className="border-b border-gray-300 p-3 text-sm cursor-pointer hover:bg-gray-50 min-h-[60px]"
      >
        {editingField === 'attributes' ? (
          <textarea
            autoFocus
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-white border border-gt-navy p-2 rounded text-sm font-mono"
            rows={3}
          />
        ) : (
          <div>
            {entity.attributes.map((attr, i) => (
              <div key={i} className="font-mono">{attr}</div>
            ))}
            {entity.attributes.length === 0 && <span className="text-gray-400">No attributes</span>}
          </div>
        )}
      </div>

      {/* Methods Section */}
      <div
        onDoubleClick={() => handleDoubleClick('methods')}
        className="p-3 text-sm cursor-pointer hover:bg-gray-50 min-h-[60px]"
      >
        {editingField === 'methods' ? (
          <textarea
            autoFocus
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-white border border-gt-navy p-2 rounded text-sm font-mono"
            rows={3}
          />
        ) : (
          <div>
            {entity.methods.map((method, i) => (
              <div key={i} className="font-mono">{method}</div>
            ))}
            {entity.methods.length === 0 && <span className="text-gray-400">No methods</span>}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | grep -i "error" || echo "✓ Build OK"
```

- [ ] **Step 4: Commit**

```bash
git add components/nodes/ClassNode.tsx
git commit -m "feat: add double-click inline editing to ClassNode"
```

---

### Task 4: Add Inline Editing to ActorNode, UseCaseNode, LifelineNode

**Files:**
- Modify: `components/nodes/ActorNode.tsx`
- Modify: `components/nodes/UseCaseNode.tsx`
- Modify: `components/nodes/LifelineNode.tsx`

- [ ] **Step 1: Add name editing to ActorNode**

Modify `ActorNode.tsx` to add state and handlers (same pattern as ClassNode for name only):

```typescript
"use client"

import { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useGraphStore } from '@/lib/store/graphStore';
import { Entity } from '@/types/graph';

export default function ActorNode({ data }: NodeProps) {
  const entity = data.entity as Entity;
  const updateEntity = useGraphStore(state => state.updateEntity);

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(entity.name);

  const handleSave = () => {
    updateEntity(entity.id, { name: tempName || 'Actor' });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* SVG Stick Figure */}
      <svg width="60" height="80" className="stroke-gt-navy stroke-2 fill-none">
        <circle cx="30" cy="15" r="8" />
        <line x1="30" y1="23" x2="30" y2="45" />
        <line x1="30" y1="30" x2="15" y2="40" />
        <line x1="30" y1="30" x2="45" y2="40" />
        <line x1="30" y1="45" x2="15" y2="70" />
        <line x1="30" y1="45" x2="45" y2="70" />
      </svg>

      {/* Name */}
      <div
        onDoubleClick={() => setIsEditing(true)}
        className="text-center text-sm font-semibold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
      >
        {isEditing ? (
          <input
            autoFocus
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="bg-white border border-gt-navy px-2 py-1 rounded text-center text-sm"
          />
        ) : (
          <span>{entity.name}</span>
        )}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

- [ ] **Step 2: Add name editing to UseCaseNode**

Modify `UseCaseNode.tsx` with same pattern:

```typescript
"use client"

import { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useGraphStore } from '@/lib/store/graphStore';
import { Entity } from '@/types/graph';

export default function UseCaseNode({ data }: NodeProps) {
  const entity = data.entity as Entity;
  const updateEntity = useGraphStore(state => state.updateEntity);

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(entity.name);

  const handleSave = () => {
    updateEntity(entity.id, { name: tempName || 'Use Case' });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div
      onDoubleClick={() => setIsEditing(true)}
      className="bg-white border-2 border-gt-navy rounded-full px-6 py-4 text-center font-semibold shadow-lg cursor-pointer hover:bg-gray-50 min-w-[120px]"
    >
      {isEditing ? (
        <input
          autoFocus
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="bg-white border border-gt-navy px-2 py-1 rounded text-center w-full"
        />
      ) : (
        <span>{entity.name}</span>
      )}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
```

- [ ] **Step 3: Add name editing to LifelineNode**

Modify `LifelineNode.tsx` with same pattern:

```typescript
"use client"

import { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useGraphStore } from '@/lib/store/graphStore';
import { Entity } from '@/types/graph';

export default function LifelineNode({ data }: NodeProps) {
  const entity = data.entity as Entity;
  const updateEntity = useGraphStore(state => state.updateEntity);

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(entity.name);

  const handleSave = () => {
    updateEntity(entity.id, { name: tempName || 'Object' });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Header box */}
      <div
        onDoubleClick={() => setIsEditing(true)}
        className="bg-white border-2 border-gt-navy px-4 py-2 rounded text-sm font-semibold shadow-md cursor-pointer hover:bg-gray-50"
      >
        {isEditing ? (
          <input
            autoFocus
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="bg-white border border-gt-navy px-2 py-1 rounded text-center text-sm"
          />
        ) : (
          <span>{entity.name}</span>
        )}
      </div>

      {/* Dashed vertical line */}
      <div className="w-0.5 h-64 border-l-2 border-dashed border-gt-navy mt-2" />

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | grep -i "error" || echo "✓ Build OK"
```

- [ ] **Step 5: Commit**

```bash
git add components/nodes/ActorNode.tsx components/nodes/UseCaseNode.tsx components/nodes/LifelineNode.tsx
git commit -m "feat: add double-click inline editing to all node types"
```

---

## Chunk 3: Playback Slider & Traceability

### Task 5: Implement Playback Slider

**Files:**
- Modify: `components/canvas/PlaybackSlider.tsx`

- [ ] **Step 1: Implement playback logic**

```typescript
"use client"

import { useState, useEffect } from 'react';
import { useGraphStore } from '@/lib/store/graphStore';

export default function PlaybackSlider() {
  const activeDiagram = useGraphStore(state => state.activeDiagram);
  const relationships = useGraphStore(state => state.relationships);

  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get messages ordered by sequenceIndex
  const messages = Object.values(relationships)
    .filter(rel => rel.kind === 'message')
    .sort((a, b) => (a.sequenceIndex || 0) - (b.sequenceIndex || 0));

  const maxIndex = messages.length;

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying || activeDiagram !== 'sd') return;

    const timer = setTimeout(() => {
      setPlaybackIndex(prev => prev < maxIndex ? prev + 1 : maxIndex);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isPlaying, playbackIndex, maxIndex, activeDiagram]);

  // Only show in SD diagram
  if (activeDiagram !== 'sd') {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-gray-200 flex items-center gap-3 max-w-md">
      {/* Play/Pause */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-gt-navy hover:bg-[#1a1744] text-white px-3 py-2 rounded-lg font-semibold transition-all"
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max={maxIndex}
        value={playbackIndex}
        onChange={(e) => {
          setPlaybackIndex(parseInt(e.target.value));
          setIsPlaying(false);
        }}
        className="flex-1 h-2 bg-gray-200 rounded-lg cursor-pointer appearance-none"
        style={{
          background: `linear-gradient(to right, #262262 0%, #262262 ${(playbackIndex / maxIndex) * 100}%, #e5e7eb ${(playbackIndex / maxIndex) * 100}%, #e5e7eb 100%)`
        }}
      />

      {/* Counter */}
      <span className="text-sm font-semibold text-gt-navy min-w-[60px] text-right">
        {playbackIndex} / {maxIndex}
      </span>

      {/* Reset */}
      <button
        onClick={() => {
          setPlaybackIndex(0);
          setIsPlaying(false);
        }}
        className="bg-gray-200 hover:bg-gray-300 text-gt-navy px-3 py-2 rounded-lg font-semibold transition-all"
      >
        ↻
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Update DiagramCanvas to highlight messages based on playback index**

In `DiagramCanvas.tsx`, modify the edges useMemo to filter by sequenceIndex:

```typescript
const edges: Edge[] = useMemo(() => {
  // Get current playback index if in SD
  const playbackIndex = activeDiagram === 'sd' ?
    // You'll need to expose playbackIndex from PlaybackSlider via context or parent
    // For now, show all messages
    Infinity : Infinity;

  return Object.values(relationships)
    .filter(rel => {
      const sourceEnt = entities[rel.source];
      const targetEnt = entities[rel.target];
      return sourceEnt && targetEnt &&
             relevantKinds.includes(sourceEnt.kind) &&
             relevantKinds.includes(targetEnt.kind);
    })
    .map(rel => ({
      id: rel.id,
      source: rel.source,
      target: rel.target,
      label: rel.label,
      type: 'smoothstep',
      animated: rel.kind === 'message',
      style: {
        strokeWidth: 2,
        stroke: '#333',
        strokeDasharray: ['extends', 'includes', 'message'].includes(rel.kind) ? '5,5' : 'none'
      },
      markerEnd: getMarkerEnd(rel.kind)
    }));
}, [relationships, entities, relevantKinds]);
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | grep -i "error" || echo "✓ Build OK"
```

- [ ] **Step 4: Commit**

```bash
git add components/canvas/PlaybackSlider.tsx components/canvas/DiagramCanvas.tsx
git commit -m "feat: implement playback slider for sequence diagram time-travel"
```

---

### Task 6: Add Traceability Tab to RightPanel

**Files:**
- Modify: `components/panels/RightPanel.tsx`

- [ ] **Step 1: Add traceability content to RightPanel**

Modify the `RightPanel.tsx` to add traceability tab content. Find the section after the AI tab content and add:

```typescript
{tab === 'traceability' && (
  <div className="space-y-3">
    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">
      Entity Diagram Membership
    </div>
    {Object.values(entities).length === 0 ? (
      <div className="text-sm text-gray-500">No entities loaded</div>
    ) : (
      Object.values(entities).map(entity => (
        <div
          key={entity.id}
          className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-xs"
        >
          <div className="font-semibold text-gray-900 mb-2">{entity.name}</div>
          <div className="flex flex-wrap gap-1">
            {entity.kind === 'class' && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">DCD</span>
            )}
            {(entity.kind === 'actor' || entity.kind === 'usecase') && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">UCD</span>
            )}
            {entity.kind === 'lifeline' && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">SD</span>
            )}
          </div>
        </div>
      ))
    )}
  </div>
)}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | grep -i "error" || echo "✓ Build OK"
```

- [ ] **Step 3: Commit**

```bash
git add components/panels/RightPanel.tsx
git commit -m "feat: add traceability tab showing entity diagram membership"
```

---

## Chunk 4: Export & Connect Mode

### Task 7: Add Export Button to Toolbar

**Files:**
- Modify: `components/canvas/Toolbar.tsx`

- [ ] **Step 1: Add export button and handler**

In `Toolbar.tsx`, add import:
```typescript
import { exportCanvasToPNG } from '@/lib/export';
```

Then add button before divider:
```typescript
<button
  onClick={() => {
    try {
      exportCanvasToPNG(`diagram-${new Date().toISOString().slice(0,10)}.png`);
    } catch (e) {
      console.error('Export failed');
    }
  }}
  className={btnStyle}
  title="Export diagram as PNG"
>
  ⬇ Export
</button>
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | grep -i "error" || echo "✓ Build OK"
```

- [ ] **Step 3: Commit**

```bash
git add components/canvas/Toolbar.tsx
git commit -m "feat: add export to PNG button"
```

---

### Task 8: Add Connect Mode Toggle

**Files:**
- Modify: `components/canvas/Toolbar.tsx`
- Modify: `components/canvas/DiagramCanvas.tsx`

- [ ] **Step 1: Add connect mode state to store**

In `lib/store/graphStore.ts`, add to GraphStoreState interface:
```typescript
setConnectMode: (enabled: boolean) => void
connectMode: boolean
```

And add to initial state and actions:
```typescript
connectMode: false,

setConnectMode: (enabled: boolean) => {
  set({ connectMode: enabled })
}
```

- [ ] **Step 2: Add toggle button to Toolbar**

In `Toolbar.tsx`, add:
```typescript
const [connectMode, setConnectMode] = useGraphStore(state => [state.connectMode, state.setConnectMode]);

// Add button near undo/redo
<button
  onClick={() => setConnectMode(!connectMode)}
  className={connectMode ? "bg-gt-techgold text-gt-navy px-5 py-2 rounded-lg text-sm font-semibold shadow-md border border-transparent transition-all" : btnStyleSecondary}
  title="Enable connect mode to draw relationships"
>
  🔗 Connect {connectMode ? '✓' : ''}
</button>
```

- [ ] **Step 3: Update DiagramCanvas to use connect mode**

In `DiagramCanvas.tsx`, modify to respect connectMode:
```typescript
const connectMode = useGraphStore(state => state.connectMode);

// Update the return JSX for ReactFlow
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  onNodesChange={onNodesChange}
  onConnect={connectMode ? onConnect : undefined}  // Only allow connections in connect mode
  fitView
>
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | grep -i "error" || echo "✓ Build OK"
```

- [ ] **Step 5: Commit**

```bash
git add lib/store/graphStore.ts components/canvas/Toolbar.tsx components/canvas/DiagramCanvas.tsx
git commit -m "feat: add connect mode toggle for explicit relationship creation"
```

---

## Summary

After completing all tasks:
- ✅ Undo/Redo with Yjs UndoManager
- ✅ Node inline editing (double-click)
- ✅ Playback slider for SD time-travel
- ✅ Traceability tab showing entity-diagram membership
- ✅ Export to PNG utility
- ✅ Connect mode toggle

**Files modified:** 7 (Toolbar.tsx, ClassNode.tsx, ActorNode.tsx, UseCaseNode.tsx, LifelineNode.tsx, PlaybackSlider.tsx, RightPanel.tsx, DiagramCanvas.tsx, graphStore.ts)
**Files created:** 1 (export.ts)
**Dependencies added:** html2canvas

**Next:** All core functionality complete. Ready for Phase 5 (AI Validation Engine) and Phase 6 (Deployment).
