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
