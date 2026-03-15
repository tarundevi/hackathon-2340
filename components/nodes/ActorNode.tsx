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
