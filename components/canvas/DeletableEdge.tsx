"use client"

import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import { useGraphStore } from '@/lib/store/graphStore';

export default function DeletableEdge({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
  style, label, markerEnd, data
}: EdgeProps) {
  const deleteRelationship = useGraphStore(state => state.deleteRelationship);
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{ position: 'absolute', transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`, pointerEvents: 'all' }}
          className="nodrag nopan group"
        >
          {label && (
            <span className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-xs font-medium text-gray-700 shadow-sm mr-1">
              {label as string}
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); deleteRelationship(id); }}
            className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 inline-flex"
            title="Delete relationship"
          >×</button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
