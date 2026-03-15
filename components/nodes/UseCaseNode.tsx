"use client"

import { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useGraphStore } from '@/lib/store/graphStore';
import { Entity } from '@/types/graph';
import SelectionRing from '../collab/SelectionRing';

export default function UseCaseNode({ data }: NodeProps) {
  const entity = data.entity as Entity;
  const remoteSelectors = data.remoteSelectors || [];
  const updateEntity = useGraphStore(state => state.updateEntity);
  const deleteEntity = useGraphStore(state => state.deleteEntity);

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
    <SelectionRing selectors={remoteSelectors}>
      <div
        onDoubleClick={() => setIsEditing(true)}
        className="relative group bg-white border-2 border-gt-navy rounded-full px-6 py-4 text-center font-semibold shadow-lg cursor-pointer hover:bg-gray-50 min-w-[120px]"
      >
        <button
          onClick={(e) => { e.stopPropagation(); deleteEntity(entity.id); }}
          className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs leading-none hover:bg-red-600 transition-opacity"
          title="Delete node"
        >×</button>
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
    </SelectionRing>
  );
}
