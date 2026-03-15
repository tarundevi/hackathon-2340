"use client"

import { useGraphStore } from '@/lib/store/graphStore';
import { undoManager } from '@/lib/ydoc';
import { exportCanvasToPNG } from '@/lib/export';
import { computeAutoLayout } from '@/lib/autoLayout';
import { useReactFlow } from 'reactflow';

export default function Toolbar() {
  const addEntity = useGraphStore(state => state.addEntity);
  const activeDiagram = useGraphStore(state => state.activeDiagram);
  const entities = useGraphStore(state => state.entities);
  const relationships = useGraphStore(state => state.relationships);
  const updatePosition = useGraphStore(state => state.updatePosition);
  const [connectMode, setConnectMode] = useGraphStore(state => [state.connectMode, state.setConnectMode]);
  const { fitView } = useReactFlow();

  const btnStyle = "bg-gt-navy hover:bg-[#1a1744] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md border border-transparent hover:border-gt-techgold transition-all";
  const btnStyleSecondary = "bg-gray-100 hover:bg-gray-200 text-gt-navy px-5 py-2 rounded-lg text-sm font-semibold shadow-md border border-gray-300 transition-all";

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
    <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gray-200 flex gap-3">
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

      {/* Divider */}
      <div className="w-px bg-gray-300" />

      {/* Undo/Redo buttons */}
      <button onClick={handleUndo} className={btnStyleSecondary} title="Undo">
        ↶ Undo
      </button>
      <button onClick={handleRedo} className={btnStyleSecondary} title="Redo">
        ↷ Redo
      </button>

      <button
        onClick={() => setConnectMode(!connectMode)}
        className={connectMode ? "bg-gt-techgold text-gt-navy px-5 py-2 rounded-lg text-sm font-semibold shadow-md border border-transparent transition-all" : btnStyleSecondary}
        title="Enable connect mode to draw relationships"
      >
        🔗 Connect {connectMode ? '✓' : ''}
      </button>
    </div>
  );
}
