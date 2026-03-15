export type EntityKind = 'class' | 'actor' | 'usecase' | 'lifeline'

export type RelationshipKind = 'association' | 'aggregation' | 'composition' | 'inheritance' | 'extends' | 'includes' | 'message'

export type DiagramType = 'ucd' | 'dcd' | 'sd'

export type Severity = 'error' | 'warning'

export type Entity = {
  id: string
  kind: EntityKind
  name: string
  attributes: string[]   // e.g. ["-id: String", "+name: String"]
  methods: string[]      // e.g. ["+rsvp(): void", "+cancel(): boolean"]
}

export type Relationship = {
  id: string
  source: string
  target: string
  kind: RelationshipKind
  label?: string         // multiplicity (e.g. "1..*") or message name
  sequenceIndex?: number // for SD messages ordering
}

export type ViewPosition = {
  entityId: string
  diagramType: DiagramType
  x: number
  y: number
}

export type ValidationFlag = {
  severity: Severity
  message: string
  entityId?: string
  diagram?: 'UCD' | 'DCD' | 'SD'
}

export type GraphStore = {
  entities: Record<string, Entity>
  relationships: Record<string, Relationship>
  positions: ViewPosition[]
  activeDiagram: DiagramType
  activeScenario: string | null
  validationResults: ValidationFlag[]
  connectMode: boolean
}
