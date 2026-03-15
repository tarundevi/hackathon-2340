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
  const [tempValue, setTempValue] = useState('');

  const handleDoubleClick = () => {
    setEditing(true);
    setTempValue(entity.name);
  };

  const handleSave = () => {
    updateEntity(entity.id, { name: tempValue || 'Add your note here...' });
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditing(false);
    }
  };

  return (
    <div className="relative group bg-yellow-100 border-2 border-yellow-400 rounded-md shadow-md p-3 min-w-[160px] max-w-[240px]">
      <button
        onClick={(e) => { e.stopPropagation(); deleteEntity(entity.id); }}
        className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs leading-none hover:bg-red-600 transition-opacity"
        title="Delete comment"
      >×</button>

      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      {editing ? (
        <textarea
          autoFocus
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full bg-yellow-50 border border-yellow-400 rounded p-1 text-sm resize-none focus:outline-none"
          rows={4}
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="text-sm text-gray-700 whitespace-pre-wrap break-words cursor-pointer"
        >
          {entity.name}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}
