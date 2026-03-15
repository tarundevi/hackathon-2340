import { useGraphStore } from './graphStore'
import { yEntities, yRelationships, yPositions, ydoc } from '../ydoc'
import type { Entity, Relationship, ViewPosition } from '@/types/graph'

/**
 * Initialize Yjs ↔ Zustand sync
 * - Observe Yjs maps/arrays → update Zustand store
 * - Wrap Zustand actions → write to Yjs
 * Call this once in app/layout.tsx after provider is ready
 */
export function initializeYjsBridge() {
  const store = useGraphStore.getState()

  // 1. Hydrate store from Yjs on init
  hydrateFromYjs()

  // 2. Observe Yjs changes and sync to Zustand
  observeYjs()

  // 3. Wrap Zustand actions to also write to Yjs
  wrapZustandActions()
}

function hydrateFromYjs() {
  const store = useGraphStore.getState()
  const entities = Object.fromEntries(yEntities.entries())
  const relationships = Object.fromEntries(yRelationships.entries())
  const positions = yPositions.toArray()

  store.loadScenario({ entities, relationships })
  // Restore positions separately
  positions.forEach((pos) => {
    store.updatePosition(pos.entityId, pos.diagramType, pos.x, pos.y)
  })
}

function observeYjs() {
  const store = useGraphStore.getState()

  // Observe entities map
  yEntities.observe((event) => {
    const entities = Object.fromEntries(yEntities.entries())
    useGraphStore.setState({ entities })
  })

  // Observe relationships map
  yRelationships.observe((event) => {
    const relationships = Object.fromEntries(yRelationships.entries())
    useGraphStore.setState({ relationships })
  })

  // Observe positions array
  yPositions.observe((event) => {
    const positions = yPositions.toArray()
    useGraphStore.setState({ positions })
  })
}

function wrapZustandActions() {
  const originalAddEntity = useGraphStore.getState().addEntity
  const originalUpdateEntity = useGraphStore.getState().updateEntity
  const originalDeleteEntity = useGraphStore.getState().deleteEntity
  const originalAddRelationship = useGraphStore.getState().addRelationship
  const originalUpdateRelationship = useGraphStore.getState().updateRelationship
  const originalDeleteRelationship = useGraphStore.getState().deleteRelationship
  const originalUpdatePosition = useGraphStore.getState().updatePosition

  // Wrap addEntity
  useGraphStore.setState({
    addEntity: (kind, name) => {
      const id = originalAddEntity(kind, name)
      const entity = useGraphStore.getState().entities[id]
      ydoc.transact(() => {
        yEntities.set(id, entity)
      })
      return id
    },
  })

  // Wrap updateEntity
  useGraphStore.setState({
    updateEntity: (id, patch) => {
      originalUpdateEntity(id, patch)
      const entity = useGraphStore.getState().entities[id]
      ydoc.transact(() => {
        yEntities.set(id, entity)
      })
    },
  })

  // Wrap deleteEntity
  useGraphStore.setState({
    deleteEntity: (id) => {
      originalDeleteEntity(id)
      ydoc.transact(() => {
        yEntities.delete(id)
        // Also remove only relationships touching this entity
        const rels = Object.entries(useGraphStore.getState().relationships)
        rels.forEach(([relId, rel]) => {
          if (rel.source === id || rel.target === id) {
            yRelationships.delete(relId)
          }
        })
      })
    },
  })

  // Wrap addRelationship
  useGraphStore.setState({
    addRelationship: (source, target, kind, label) => {
      const id = originalAddRelationship(source, target, kind, label)
      const rel = useGraphStore.getState().relationships[id]
      ydoc.transact(() => {
        yRelationships.set(id, rel)
      })
      return id
    },
  })

  // Wrap updateRelationship
  useGraphStore.setState({
    updateRelationship: (id, patch) => {
      originalUpdateRelationship(id, patch)
      const rel = useGraphStore.getState().relationships[id]
      ydoc.transact(() => {
        yRelationships.set(id, rel)
      })
    },
  })

  // Wrap deleteRelationship
  useGraphStore.setState({
    deleteRelationship: (id) => {
      originalDeleteRelationship(id)
      ydoc.transact(() => {
        yRelationships.delete(id)
      })
    },
  })

  // Wrap updatePosition
  useGraphStore.setState({
    updatePosition: (entityId, diagramType, x, y) => {
      originalUpdatePosition(entityId, diagramType, x, y)
      const positions = useGraphStore.getState().positions
      ydoc.transact(() => {
        yPositions.delete(0, yPositions.length)
        positions.forEach((pos) => {
          yPositions.push([pos])
        })
      })
    },
  })
}
