import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type {
  Entity,
  Relationship,
  ViewPosition,
  GraphStore,
  DiagramType,
  EntityKind,
  RelationshipKind,
  ValidationFlag,
} from '@/types/graph'

type GraphStoreState = GraphStore & {
  // Actions
  addEntity: (kind: EntityKind, name: string) => string // returns entity id
  updateEntity: (id: string, patch: Partial<Entity>) => void
  deleteEntity: (id: string) => void
  addRelationship: (source: string, target: string, kind: RelationshipKind, label?: string) => string // returns relationship id
  updateRelationship: (id: string, patch: Partial<Relationship>) => void
  deleteRelationship: (id: string) => void
  updatePosition: (entityId: string, diagramType: DiagramType, x: number, y: number) => void
  setActiveDiagram: (type: DiagramType) => void
  setActiveScenario: (name: string | null) => void
  setValidationResults: (flags: ValidationFlag[]) => void
  loadScenario: (scenario: { entities: Record<string, Entity>; relationships: Record<string, Relationship> }) => void
  connectMode: boolean
  setConnectMode: (enabled: boolean) => void
  reset: () => void
}

const initialState: GraphStore = {
  entities: {},
  relationships: {},
  positions: [],
  activeDiagram: 'dcd',
  activeScenario: null,
  validationResults: [],
  connectMode: false,
}

export const useGraphStore = create<GraphStoreState>((set) => ({
  ...initialState,

  addEntity: (kind: EntityKind, name: string) => {
    const id = uuidv4()
    set((state) => ({
      entities: {
        ...state.entities,
        [id]: {
          id,
          kind,
          name,
          attributes: [],
          methods: [],
        },
      },
    }))
    return id
  },

  updateEntity: (id: string, patch: Partial<Entity>) => {
    set((state) => ({
      entities: {
        ...state.entities,
        [id]: { ...state.entities[id], ...patch },
      },
    }))
  },

  deleteEntity: (id: string) => {
    set((state) => {
      const newEntities = { ...state.entities }
      delete newEntities[id]
      // Also remove all relationships touching this entity
      const newRelationships = Object.fromEntries(
        Object.entries(state.relationships).filter(
          ([_, rel]) => rel.source !== id && rel.target !== id
        )
      )
      // Remove positions for this entity
      const newPositions = state.positions.filter((p) => p.entityId !== id)
      return {
        entities: newEntities,
        relationships: newRelationships,
        positions: newPositions,
      }
    })
  },

  addRelationship: (source: string, target: string, kind: RelationshipKind, label?: string) => {
    const id = uuidv4()
    set((state) => ({
      relationships: {
        ...state.relationships,
        [id]: {
          id,
          source,
          target,
          kind,
          label,
        },
      },
    }))
    return id
  },

  updateRelationship: (id: string, patch: Partial<Relationship>) => {
    set((state) => ({
      relationships: {
        ...state.relationships,
        [id]: { ...state.relationships[id], ...patch },
      },
    }))
  },

  deleteRelationship: (id: string) => {
    set((state) => {
      const newRelationships = { ...state.relationships }
      delete newRelationships[id]
      return { relationships: newRelationships }
    })
  },

  updatePosition: (entityId: string, diagramType: DiagramType, x: number, y: number) => {
    set((state) => {
      const existing = state.positions.findIndex(
        (p) => p.entityId === entityId && p.diagramType === diagramType
      )
      if (existing >= 0) {
        const updated = [...state.positions]
        updated[existing] = { entityId, diagramType, x, y }
        return { positions: updated }
      } else {
        return {
          positions: [...state.positions, { entityId, diagramType, x, y }],
        }
      }
    })
  },

  setActiveDiagram: (type: DiagramType) => {
    set({ activeDiagram: type })
  },

  setActiveScenario: (name: string | null) => {
    set({ activeScenario: name })
  },

  setValidationResults: (flags: ValidationFlag[]) => {
    set({ validationResults: flags })
  },

  loadScenario: (scenario: { entities: Record<string, Entity>; relationships: Record<string, Relationship> }) => {
    set({
      entities: scenario.entities,
      relationships: scenario.relationships,
      positions: [],
      validationResults: [],
    })
  },

  setConnectMode: (enabled: boolean) => {
    set({ connectMode: enabled })
  },

  reset: () => {
    set(initialState)
  },
}))
