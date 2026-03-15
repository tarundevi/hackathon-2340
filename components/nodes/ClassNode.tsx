"use client"

import { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useGraphStore } from '@/lib/store/graphStore';
import { Entity } from '@/types/graph';
import SelectionRing from '../collab/SelectionRing';

export default function ClassNode({ data, isConnectable }: NodeProps) {
  if (!data.entity) {
    // Render a fallback or nothing if entity is not available
    return null;

  }

  const entity = data.entity as Entity;
  const remoteSelectors = data.remoteSelectors || [];
  const updateEntity = useGraphStore(state => state.updateEntity);
  const deleteEntity = useGraphStore(state => state.deleteEntity);

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
    <SelectionRing selectors={remoteSelectors}>
      <div className="relative group bg-white border-2 border-gt-navy rounded-lg shadow-lg p-0 min-w-[200px]">
        <button
          onClick={(e) => { e.stopPropagation(); deleteEntity(entity.id); }}
          className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs leading-none hover:bg-red-600 transition-opacity"
          title="Delete node"
        >×</button>
        <Handle type="target" position={Position.Top} />

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
    </SelectionRing>
  );
}
