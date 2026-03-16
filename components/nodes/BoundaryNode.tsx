"use client"

import { useState, useRef, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useGraphStore } from '@/lib/store/graphStore';
import { Entity, BoundarySubtype } from '@/types/graph';

const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 420;
const MIN_WIDTH = 160;
const MIN_HEIGHT = 100;

function getBoundaryStyle(subtype: BoundarySubtype) {
  switch (subtype) {
    case 'system':
      return {
        border: '2px dashed #3b82f6',
        background: 'rgba(59,130,246,0.04)',
        headerBg: 'rgba(59,130,246,0.10)',
        headerColor: '#1d4ed8',
        label: 'System Boundary',
        icon: '⬜',
      };
    case 'package':
      return {
        border: '2px solid #7c3aed',
        background: 'rgba(124,58,237,0.04)',
        headerBg: 'rgba(124,58,237,0.12)',
        headerColor: '#5b21b6',
        label: 'Package',
        icon: '📦',
      };
    case 'frame':
    default:
      return {
        border: '2px solid #64748b',
        background: 'rgba(100,116,139,0.04)',
        headerBg: 'rgba(100,116,139,0.10)',
        headerColor: '#334155',
        label: 'Frame',
        icon: '▭',
      };
  }
}

export default function BoundaryNode({ data }: NodeProps) {
  if (!data.entity) return null;
  const entity = data.entity as Entity;
  const updateEntity = useGraphStore(state => state.updateEntity);
  const deleteEntity = useGraphStore(state => state.deleteEntity);

  const subtype = (entity.subtype ?? 'frame') as BoundarySubtype;
  const style = getBoundaryStyle(subtype);
  const width = entity.width ?? DEFAULT_WIDTH;
  const height = entity.height ?? DEFAULT_HEIGHT;

  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  // Package subtype draws a folder-tab at top
  const isPackage = subtype === 'package';
  const TAB_HEIGHT = isPackage ? 22 : 0;

  // ── Resize logic ────────────────────────────────────────────────────────────
  const resizeState = useRef<{
    startX: number; startY: number; startW: number; startH: number;
  } | null>(null);
  const [localSize, setLocalSize] = useState<{ w: number; h: number } | null>(null);

  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    resizeState.current = { startX: e.clientX, startY: e.clientY, startW: width, startH: height };

    const onMouseMove = (ev: MouseEvent) => {
      if (!resizeState.current) return;
      const { startX, startY, startW, startH } = resizeState.current;
      setLocalSize({
        w: Math.max(MIN_WIDTH, startW + ev.clientX - startX),
        h: Math.max(MIN_HEIGHT, startH + ev.clientY - startY),
      });
    };

    const onMouseUp = (ev: MouseEvent) => {
      if (!resizeState.current) return;
      const { startX, startY, startW, startH } = resizeState.current;
      const newW = Math.round(Math.max(MIN_WIDTH, startW + ev.clientX - startX));
      const newH = Math.round(Math.max(MIN_HEIGHT, startH + ev.clientY - startY));
      updateEntity(entity.id, { width: newW, height: newH });
      resizeState.current = null;
      setLocalSize(null);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [entity.id, width, height, updateEntity]);

  const displayW = localSize ? localSize.w : width;
  const displayH = localSize ? localSize.h : height;

  // ── Editing ─────────────────────────────────────────────────────────────────
  const startEditing = () => {
    setTempName(entity.name);
    setEditing(true);
  };

  const saveEdit = () => {
    updateEntity(entity.id, { name: tempName || entity.name });
    setEditing(false);
  };

  return (
    <div
      className="group relative"
      style={{
        width: displayW,
        height: displayH + TAB_HEIGHT,
        userSelect: 'none',
      }}
    >
      {/* Package folder tab */}
      {isPackage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: Math.min(120, displayW * 0.4),
            height: TAB_HEIGHT,
            background: style.headerBg,
            border: style.border,
            borderBottom: 'none',
            borderRadius: '4px 4px 0 0',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 8,
          }}
        >
          <span style={{ fontSize: 11, color: style.headerColor, fontWeight: 700 }}>
            {entity.name}
          </span>
        </div>
      )}

      {/* Main rectangle */}
      <div
        style={{
          position: 'absolute',
          top: TAB_HEIGHT,
          left: 0,
          width: displayW,
          height: displayH,
          border: style.border,
          background: style.background,
          borderRadius: isPackage ? '0 4px 4px 4px' : 6,
          boxSizing: 'border-box',
        }}
      >
        {/* Header bar (drag handle + label) — only for non-package */}
        {!isPackage && (
          <div
            className="boundary-drag-handle"
            style={{
              background: style.headerBg,
              borderBottom: style.border,
              borderRadius: '4px 4px 0 0',
              padding: '4px 8px',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              minHeight: 28,
            }}
          >
            <span style={{ fontSize: 12, opacity: 0.6 }}>{style.icon}</span>
            {editing ? (
              <input
                autoFocus
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') setEditing(false);
                }}
                className="nodrag flex-1 bg-transparent border-b border-current text-xs focus:outline-none"
                style={{ color: style.headerColor, fontWeight: 700 }}
              />
            ) : (
              <span
                onDoubleClick={startEditing}
                style={{ fontSize: 12, color: style.headerColor, fontWeight: 700, cursor: 'text', flex: 1 }}
              >
                {entity.name}
              </span>
            )}
          </div>
        )}

        {/* Package label editing area */}
        {isPackage && editing && (
          <input
            autoFocus
            value={tempName}
            onChange={e => setTempName(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={e => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') setEditing(false);
            }}
            className="nodrag absolute top-0 left-0 bg-transparent border-b border-current text-xs focus:outline-none px-2"
            style={{ color: style.headerColor, fontWeight: 700, height: TAB_HEIGHT, width: Math.min(120, displayW * 0.4), zIndex: 10 }}
          />
        )}

        {/* Package double-click zone for editing */}
        {isPackage && !editing && (
          <div
            onDoubleClick={startEditing}
            style={{ position: 'absolute', top: -TAB_HEIGHT, left: 0, width: Math.min(120, displayW * 0.4), height: TAB_HEIGHT, cursor: 'text', zIndex: 10 }}
          />
        )}

        {/* Resize handle */}
        <div
          className="nodrag opacity-80 group-hover:opacity-100 transition-opacity"
          onMouseDown={onResizeMouseDown}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 24,
            height: 24,
            cursor: 'se-resize',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: 4,
          }}
          title="Drag to resize"
        >
          <svg width="12" height="12" viewBox="0 0 10 10" fill={style.headerColor} opacity={0.8}>
            <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke={style.headerColor} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={e => { e.stopPropagation(); deleteEntity(entity.id); }}
        className="nodrag absolute top-0 right-0 z-20 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition-opacity"
        style={{ transform: 'translate(50%,-50%)' }}
        title="Delete boundary"
      >×</button>

      {/* ReactFlow connection handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
