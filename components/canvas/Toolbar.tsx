"use client"

import { useGraphStore } from '@/lib/store/graphStore';
import { undoManager } from '@/lib/ydoc';
import type { BoundarySubtype } from '@/types/graph';
import { exportCanvasToPNG } from '@/lib/export';
import { computeAutoLayout } from '@/lib/autoLayout';
import { useReactFlow } from 'reactflow';

interface ToolbarProps {
  layout?: 'horizontal' | 'vertical';
}

export default function Toolbar({ layout = 'horizontal' }: ToolbarProps) {
  const addEntity = useGraphStore(state => state.addEntity);
  const updateEntity = useGraphStore(state => state.updateEntity);
  const activeDiagram = useGraphStore(state => state.activeDiagram);
  const entities = useGraphStore(state => state.entities);

  const addBoundary = (subtype: BoundarySubtype, name: string) => {
    const id = addEntity('boundary', name);
    updateEntity(id, { subtype, width: 640, height: 420, diagramScope: activeDiagram });
  };
  const relationships = useGraphStore(state => state.relationships);
  const updatePosition = useGraphStore(state => state.updatePosition);
  const [connectMode, setConnectMode] = useGraphStore(state => [state.connectMode, state.setConnectMode]);
  const { fitView } = useReactFlow();

  const isVertical = layout === 'vertical';
  const btnBase = isVertical ? 'w-full justify-start text-left' : '';
  const btnStyle = `bg-gt-navy hover:bg-gt-navy/90 active:scale-95 text-white px-5 py-2.5 rounded-md text-sm font-bold border border-transparent hover:-translate-y-[2px] transition-all duration-300 ease-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gt-navy/40 focus:ring-offset-2 inline-flex items-center gap-2 ${btnBase}`;
  const btnStyleSecondary = `bg-white hover:bg-gray-50 active:scale-95 text-gt-navy px-5 py-2.5 rounded-md text-sm font-bold border border-gray-200 hover:-translate-y-[2px] transition-all duration-300 ease-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 inline-flex items-center gap-2 ${btnBase}`;

  const handleAutoLayout = () => {
    const newPositions = computeAutoLayout(entities, relationships, activeDiagram);
    newPositions.forEach(({ entityId, x, y }) => {
      updatePosition(entityId, activeDiagram, x, y);
    });
    // Wait for positions to propagate through Yjs and React, then fit view
    setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 100);
    setTimeout(() => fitView({ padding: 0.2 }), 500);
  };

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
    <div className={`bg-white px-4 py-3 rounded-md border border-gt-navy/20 flex gap-3 ${isVertical ? 'flex-col items-stretch' : 'flex-wrap items-center'}`}>
      {activeDiagram === 'dcd' && (
        <button onClick={() => addEntity('class', 'NewClass')} className={btnStyle}>
          ▭ Add Class
        </button>
      )}

      {activeDiagram === 'dmd' && (
        <button onClick={() => addEntity('domain', 'NewConcept')} className={btnStyle}>
          ▭ Add Concept
        </button>
      )}

      {activeDiagram === 'ucd' && (
        <>
          <button onClick={() => addEntity('actor', 'New Actor')} className={btnStyle}>
            👤 Add Actor
          </button>
          <button onClick={() => addEntity('usecase', 'New Use Case')} className={btnStyle}>
            ◯ Add Use Case
          </button>
        </>
      )}

      {activeDiagram === 'sd' && (
        <button onClick={() => addEntity('lifeline', 'New Object')} className={btnStyle}>
          ∥ Add Lifeline
        </button>
      )}

      {activeDiagram === 'ssd' && (
        <>
          <button onClick={() => addEntity('actor', 'Actor')} className={btnStyle}>
            👤 Add Actor
          </button>
          <button onClick={() => addEntity('lifeline', ':System')} className={btnStyle}>
            ∥ Add System
          </button>
        </>
      )}

      {activeDiagram === 'ucd' && (
        <button
          onClick={() => addBoundary('system', 'System')}
          className={btnStyleSecondary}
          title="Add a system boundary box"
        >
          ⬜ System Boundary
        </button>
      )}

      {(activeDiagram === 'dcd' || activeDiagram === 'dmd') && (
        <button
          onClick={() => addBoundary('package', 'Package')}
          className={btnStyleSecondary}
          title="Add a package boundary"
        >
          📦 Package
        </button>
      )}

      {(activeDiagram === 'sd' || activeDiagram === 'ssd') && (
        <button
          onClick={() => addBoundary('frame', 'Frame')}
          className={btnStyleSecondary}
          title="Add a frame boundary"
        >
          ▭ Add Frame
        </button>
      )}

      <button
        onClick={() => addEntity('comment', 'Add your note here...')}
        className={btnStyleSecondary}
        title="Add a comment sticky note"
      >
        💬 Comment
      </button>

      <button
        onClick={handleAutoLayout}
        className={btnStyleSecondary}
        title="Auto-arrange nodes"
      >
        Auto Layout
      </button>

      <button
        onClick={() => {
          try {
            exportCanvasToPNG(`diagram-${activeDiagram.toUpperCase()}-${new Date().toISOString().slice(0,10)}.png`);
          } catch (e) {
            console.error('Export failed');
          }
        }}
        className={btnStyle}
        title="Export diagram as PNG"
      >
        ⬇ Export
      </button>

      {/* Divider */}
      <div className={isVertical ? 'h-px bg-gt-navy/10 w-full' : 'w-px bg-gt-navy/10 h-6'} />

      {/* Undo/Redo buttons */}
      <button onClick={handleUndo} className={btnStyleSecondary} title="Undo">
        ↶ Undo
      </button>
      <button onClick={handleRedo} className={btnStyleSecondary} title="Redo">
        ↷ Redo
      </button>

      <button
        onClick={() => setConnectMode(!connectMode)}
        className={connectMode ? `bg-gt-techgold hover:bg-[#e0a800] active:scale-95 text-gt-navy px-5 py-2.5 rounded-md text-sm font-bold border border-transparent transition-all hover:-translate-y-[2px] duration-300 ease-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gt-techgold/50 focus:ring-offset-2 inline-flex items-center gap-2 ${btnBase}` : btnStyleSecondary}
        title="Enable connect mode to draw relationships"
      >
        🔗 Connect {connectMode ? '✓' : ''}
      </button>
    </div>
  );
}
