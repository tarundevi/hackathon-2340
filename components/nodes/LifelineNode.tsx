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
