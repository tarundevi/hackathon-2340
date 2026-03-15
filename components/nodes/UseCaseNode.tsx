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
      className="bg-white border-2 border-gt-navy rounded-full px-6 py-4 text-center font-semibold cursor-pointer hover:bg-gray-50 min-w-[120px]"
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
