"use client"

import { useMemo, useCallback, useState, useEffect } from 'react';
import ReactFlow, { 
  Background,
  Controls,
  MiniMap,
  Node, 
  Edge, 
  NodeChange, 
  applyNodeChanges,
  Connection,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useGraphStore } from '@/lib/store/graphStore';
import { usePresenceSelection } from '@/lib/usePresenceSelection';
import ClassNode from '../nodes/ClassNode';
import ActorNode from '../nodes/ActorNode';
import UseCaseNode from '../nodes/UseCaseNode';
import LifelineNode from '../nodes/LifelineNode';
import CommentNode from '../nodes/CommentNode';
import { EntityKind, DiagramType, RelationshipKind } from '@/types/graph';
import EdgeLabelEditor from './EdgeLabelEditor';
import DeletableEdge from './DeletableEdge';
import RelationshipTypeSelector from './RelationshipTypeSelector';

const nodeTypes = {
  class: ClassNode,
  actor: ActorNode,
  usecase: UseCaseNode,
  lifeline: LifelineNode,
  comment: CommentNode,
};

const edgeTypes = {
  deletable: DeletableEdge,
};

function getRelevantKinds(diagram: DiagramType): EntityKind[] {
  switch (diagram) {
    case 'ucd': return ['actor', 'usecase'];
    case 'dcd': return ['class'];
    case 'sd': return ['lifeline'];
    default: return [];
  }
}

function getMarkerEnd(kind: RelationshipKind) {
  switch (kind) {
    case 'aggregation':
    case 'composition':
    case 'inheritance':
      return { type: MarkerType.ArrowClosed, color: '#000' };
    case 'association':
    case 'extends':
    case 'includes':
    case 'message':
    default:
      return { type: MarkerType.ArrowClosed };
  }
}

export default function DiagramCanvas() {
  const entities = useGraphStore(state => state.entities);
  const relationships = useGraphStore(state => state.relationships);
  const positions = useGraphStore(state => state.positions);
  const activeDiagram = useGraphStore(state => state.activeDiagram);
  const updatePosition = useGraphStore(state => state.updatePosition);
  const addRelationship = useGraphStore(state => state.addRelationship);
  const connectMode = useGraphStore(state => state.connectMode);
  const deleteEntity = useGraphStore(state => state.deleteEntity);
  const deleteRelationship = useGraphStore(state => state.deleteRelationship);
  const updateRelationship = useGraphStore(state => state.updateRelationship);
  const { remoteSelections, setLocalSelection } = usePresenceSelection();

  const [editingEdge, setEditingEdge] = useState<{ id: string; label: string; x: number; y: number } | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [pendingConnection, setPendingConnection] = useState<{ connection: Connection; x: number; y: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          deleteEntity(selectedNodeId);
          setSelectedNodeId(null);
        } else if (selectedEdgeId) {
          deleteRelationship(selectedEdgeId);
          setSelectedEdgeId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, deleteEntity, deleteRelationship]);

  const relevantKinds = useMemo(() => getRelevantKinds(activeDiagram), [activeDiagram]);

  const nodes: Node[] = useMemo(() => {
    return Object.values(entities)
      .filter(e => relevantKinds.includes(e.kind) || e.kind === 'comment')
      .map(e => {
        const pos = positions.find(p => p.entityId === e.id && p.diagramType === activeDiagram);
        const selectors = remoteSelections.filter(s => s.selectedNodeId === e.id);
        return {
          id: e.id,
          type: e.kind,
          position: pos ? { x: pos.x, y: pos.y } : { x: 100, y: 100 },
          data: { entity: e, remoteSelectors: selectors }
        };
      });
  }, [entities, positions, activeDiagram, relevantKinds, remoteSelections]);

  const edges: Edge[] = useMemo(() => {
    return Object.values(relationships)
      // basic filtering: only show edges if both source and target are in current view
      .filter(rel => {
        const sourceEnt = entities[rel.source];
        const targetEnt = entities[rel.target];
        return sourceEnt && targetEnt && 
               relevantKinds.includes(sourceEnt.kind) && 
               relevantKinds.includes(targetEnt.kind);
      })
      .map(rel => ({
        id: rel.id,
        source: rel.source,
        target: rel.target,
        label: rel.label,
        type: 'deletable', // custom edge with hover delete button
        animated: rel.kind === 'message',
        style: { 
          strokeWidth: 2, 
          stroke: '#333',
          strokeDasharray: ['extends', 'includes', 'message'].includes(rel.kind) ? '5,5' : 'none'
        },
        markerEnd: getMarkerEnd(rel.kind)
      }));
  }, [relationships, entities, relevantKinds]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    // We only care about position updates to sync with store
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        // Debouncing / throttling would typically go here in a real app
        // For hackathon, just dispatching occasionally or simply relying on the node drag end is fine.
        updatePosition(change.id, activeDiagram, change.position.x, change.position.y);
      }
    });
  }, [updatePosition, activeDiagram]);

  const onConnect = useCallback((connection: Connection) => {
    if (connection.source === connection.target) return;
    if (!connection.source || !connection.target) return;
    if (!entities[connection.source] || !entities[connection.target]) return;
    setPendingConnection({ connection, x: window.innerWidth / 2, y: window.innerHeight / 2 - 50 });
  }, [entities]);

  const handleRelationshipTypeSelect = useCallback((kind: string) => {
    if (!pendingConnection) return;
    const { connection } = pendingConnection;
    addRelationship(connection.source!, connection.target!, kind as RelationshipKind);
    setPendingConnection(null);
  }, [pendingConnection, addRelationship]);

  const onEdgeDoubleClick = useCallback((e: React.MouseEvent, edge: Edge) => {
    const rel = relationships[edge.id];
    setEditingEdge({ id: edge.id, label: rel?.label || '', x: e.clientX, y: e.clientY });
  }, [relationships]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setLocalSelection(node.id);
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  }, [setLocalSelection]);

  const onPaneClick = useCallback(() => {
    setLocalSelection(null);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [setLocalSelection]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }, []);

  return (
    <div className="flex-1 w-full h-full bg-slate-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onConnect={connectMode ? onConnect : undefined}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onEdgeClick={onEdgeClick}
        fitView
        style={{ background: 'transparent' }}
      >
        <Background gap={16} color="#e2e8f0" />
        <Controls />
        <MiniMap
          nodeStrokeColor="#003057"
          nodeColor={(node) => {
            switch (node.type) {
              case 'class': return '#003057'
              case 'actor': return '#10b981'
              case 'usecase': return '#B3A369'
              case 'lifeline': return '#3b82f6'
              default: return '#B3A369'
            }
          }}
          maskColor="rgba(0,0,0,0.08)"
          position="top-right"
          pannable
          zoomable
          style={{ borderRadius: 8, width: 180, height: 130 }}
        />
      </ReactFlow>
      {editingEdge && (
        <EdgeLabelEditor
          edgeId={editingEdge.id}
          initialLabel={editingEdge.label}
          position={{ x: editingEdge.x, y: editingEdge.y }}
          onSave={(id, label) => updateRelationship(id, { label })}
          onClose={() => setEditingEdge(null)}
        />
      )}
      {pendingConnection && connectMode && (
        <RelationshipTypeSelector
          position={{ x: pendingConnection.x, y: pendingConnection.y }}
          diagramType={activeDiagram}
          onSelect={handleRelationshipTypeSelect}
          onCancel={() => setPendingConnection(null)}
        />
      )}
    </div>
  );
}
