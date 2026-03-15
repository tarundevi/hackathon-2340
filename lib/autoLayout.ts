import dagre from 'dagre'
import type { Entity, Relationship, DiagramType, EntityKind } from '@/types/graph'

function getRelevantKinds(diagram: DiagramType): EntityKind[] {
  switch (diagram) {
    case 'ucd': return ['actor', 'usecase']
    case 'dcd': return ['class']
    case 'sd': return ['lifeline']
    default: return []
  }
}

function getNodeSize(entity: Entity): { width: number; height: number } {
  switch (entity.kind) {
    case 'class': {
      const nameWidth = entity.name.length * 9 + 40
      const attrWidth = entity.attributes.reduce((max, a) => Math.max(max, a.length * 7 + 30), 0)
      const methodWidth = entity.methods.reduce((max, m) => Math.max(max, m.length * 7 + 30), 0)
      const width = Math.max(200, nameWidth, attrWidth, methodWidth)
      const height = 50 + Math.max(60, entity.attributes.length * 20 + 24) + Math.max(60, entity.methods.length * 20 + 24)
      return { width, height }
    }
    case 'actor':
      return { width: 80, height: 120 }
    case 'usecase':
      return { width: 180, height: 70 }
    case 'lifeline':
      return { width: 120, height: 200 }
    default:
      return { width: 150, height: 100 }
  }
}

function layoutSequenceDiagram(
  entities: Entity[],
  relationships: Relationship[]
): { entityId: string; x: number; y: number }[] {
  // Sort lifelines by how early they appear in messages (by lowest sequenceIndex)
  const firstAppearance = new Map<string, number>()
  const sortedRels = Object.values(relationships)
    .filter(r => r.kind === 'message' && r.sequenceIndex != null)
    .sort((a, b) => (a.sequenceIndex ?? 0) - (b.sequenceIndex ?? 0))

  for (const rel of sortedRels) {
    if (!firstAppearance.has(rel.source)) firstAppearance.set(rel.source, rel.sequenceIndex ?? 999)
    if (!firstAppearance.has(rel.target)) firstAppearance.set(rel.target, rel.sequenceIndex ?? 999)
  }

  const sorted = [...entities].sort((a, b) => {
    const aIdx = firstAppearance.get(a.id) ?? 999
    const bIdx = firstAppearance.get(b.id) ?? 999
    return aIdx - bIdx
  })

  const spacing = Math.max(160, 200 - sorted.length * 5)
  return sorted.map((entity, i) => ({
    entityId: entity.id,
    x: 50 + i * spacing,
    y: 50,
  }))
}

function layoutUseCaseDiagram(
  entities: Entity[],
  relationships: Relationship[]
): { entityId: string; x: number; y: number }[] {
  const actors = entities.filter(e => e.kind === 'actor')
  const usecases = entities.filter(e => e.kind === 'usecase')

  // Find which actors connect to which use cases
  const relSet = new Set(relationships.map(r => `${r.source}::${r.target}`))
  const reverseRelSet = new Set(relationships.map(r => `${r.target}::${r.source}`))

  // Place actors on the left, use cases on the right
  // Group use cases by which actor they connect to
  const actorSpacing = Math.max(140, 180 - actors.length * 5)
  const actorsStartY = 50

  const result: { entityId: string; x: number; y: number }[] = []

  // Place actors in a column on the left
  actors.forEach((actor, i) => {
    result.push({
      entityId: actor.id,
      x: 50,
      y: actorsStartY + i * actorSpacing,
    })
  })

  // For use cases: if connected to an actor, try to place them near that actor's Y level
  // Otherwise just spread them out
  const usedY = new Set<number>()
  const ucSpacing = Math.max(100, 140 - usecases.length * 3)
  const ucX = 350

  // First pass: assign use cases to actors
  const assignedUCs = new Map<string, string[]>() // actorId -> ucIds
  const unassignedUCs: Entity[] = []

  for (const uc of usecases) {
    let assigned = false
    for (const actor of actors) {
      if (relSet.has(`${actor.id}::${uc.id}`) || reverseRelSet.has(`${actor.id}::${uc.id}`)) {
        if (!assignedUCs.has(actor.id)) assignedUCs.set(actor.id, [])
        assignedUCs.get(actor.id)!.push(uc.id)
        assigned = true
        break
      }
    }
    if (!assigned) unassignedUCs.push(uc)
  }

  // Place connected use cases near their actor
  let nextFreeY = actorsStartY
  for (let i = 0; i < actors.length; i++) {
    const actor = actors[i]
    const actorY = actorsStartY + i * actorSpacing
    const ucIds = assignedUCs.get(actor.id) || []
    const startY = actorY - ((ucIds.length - 1) * ucSpacing) / 2

    ucIds.forEach((ucId, j) => {
      const y = startY + j * ucSpacing
      result.push({ entityId: ucId, x: ucX, y })
      nextFreeY = Math.max(nextFreeY, y + ucSpacing)
    })
  }

  // Place unassigned use cases below
  unassignedUCs.forEach((uc, i) => {
    result.push({
      entityId: uc.id,
      x: ucX,
      y: nextFreeY + i * ucSpacing,
    })
  })

  return result
}

function layoutClassDiagram(
  entities: Entity[],
  relationships: Relationship[]
): { entityId: string; x: number; y: number }[] {
  // Split into connected and unconnected nodes
  const entityIds = new Set(entities.map(e => e.id))
  const connectedIds = new Set<string>()
  const relevantRels = relationships.filter(
    r => entityIds.has(r.source) && entityIds.has(r.target)
  )
  for (const rel of relevantRels) {
    connectedIds.add(rel.source)
    connectedIds.add(rel.target)
  }

  const connectedEntities = entities.filter(e => connectedIds.has(e.id))
  const unconnectedEntities = entities.filter(e => !connectedIds.has(e.id))

  const result: { entityId: string; x: number; y: number }[] = []

  // Layout connected nodes with dagre
  if (connectedEntities.length > 0) {
    const g = new dagre.graphlib.Graph()
    const count = connectedEntities.length
    const nodesep = Math.max(60, 120 - count * 5)
    const ranksep = Math.max(80, 140 - count * 5)

    g.setGraph({
      rankdir: 'TB',
      nodesep,
      ranksep,
      marginx: 40,
      marginy: 40,
    })
    g.setDefaultEdgeLabel(() => ({}))

    for (const entity of connectedEntities) {
      const size = getNodeSize(entity)
      g.setNode(entity.id, { width: size.width, height: size.height })
    }

    for (const rel of relevantRels) {
      const weight = rel.kind === 'inheritance' ? 10 : 1
      g.setEdge(rel.source, rel.target, { weight })
    }

    dagre.layout(g)

    for (const entity of connectedEntities) {
      const node = g.node(entity.id)
      result.push({
        entityId: entity.id,
        x: node.x - node.width / 2,
        y: node.y - node.height / 2,
      })
    }
  }

  // Layout unconnected nodes in a grid
  if (unconnectedEntities.length > 0) {
    const cols = Math.ceil(Math.sqrt(unconnectedEntities.length))
    const colWidth = 260
    const rowHeight = 220

    // Place grid below connected nodes
    let startY = 40
    if (result.length > 0) {
      startY = Math.max(...result.map(r => r.y)) + 250
    }

    unconnectedEntities.forEach((entity, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      result.push({
        entityId: entity.id,
        x: 40 + col * colWidth,
        y: startY + row * rowHeight,
      })
    })
  }

  return result
}

export function computeAutoLayout(
  entities: Record<string, Entity>,
  relationships: Record<string, Relationship>,
  activeDiagram: DiagramType
): { entityId: string; x: number; y: number }[] {
  const relevantKinds = getRelevantKinds(activeDiagram)
  const relevantEntities = Object.values(entities).filter(e => relevantKinds.includes(e.kind))

  if (relevantEntities.length === 0) return []

  const relevantIds = new Set(relevantEntities.map(e => e.id))
  const relevantRels = Object.values(relationships).filter(
    r => relevantIds.has(r.source) && relevantIds.has(r.target)
  )

  switch (activeDiagram) {
    case 'sd':
      return layoutSequenceDiagram(relevantEntities, relevantRels)
    case 'ucd':
      return layoutUseCaseDiagram(relevantEntities, relevantRels)
    case 'dcd':
      return layoutClassDiagram(relevantEntities, relevantRels)
    default:
      return []
  }
}
