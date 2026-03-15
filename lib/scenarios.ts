import type { Entity, Relationship } from '@/types/graph'

export const SCENARIOS = {
  blank: {
    name: 'Blank Canvas',
    entities: {},
    relationships: {},
  },

  jordan: {
    name: 'Jordan - Event Management',
    entities: {
      'event': {
        id: 'event',
        kind: 'class' as const,
        name: 'Event',
        attributes: ['-id: String', '-name: String', '-capacity: int', '-registeredCount: int'],
        methods: ['+rsvp(student: Student): boolean', '+cancel(student: Student): void', '+isFull(): boolean'],
      },
      'student': {
        id: 'student',
        kind: 'class' as const,
        name: 'Student',
        attributes: ['-id: String', '-name: String', '-email: String'],
        methods: ['+register(event: Event): void', '+unregister(event: Event): void'],
      },
      'organization': {
        id: 'organization',
        kind: 'class' as const,
        name: 'Organization',
        attributes: ['-name: String', '-president: Student'],
        methods: ['+getPresident(): Student', '+addEvent(event: Event): void'],
      },
    },
    relationships: {
      'rel1': {
        id: 'rel1',
        source: 'event',
        target: 'student',
        kind: 'association' as const,
        label: '*',
      },
      'rel2': {
        id: 'rel2',
        source: 'organization',
        target: 'event',
        kind: 'composition' as const,
        label: '1..*',
      },
    },
  },

  daniel: {
    name: 'Daniel - RSVP System',
    entities: {
      'event': {
        id: 'event',
        kind: 'class' as const,
        name: 'Event',
        attributes: ['-id: String', '-title: String', '-date: Date', '-attendees: List<Student>'],
        methods: ['+addAttendee(s: Student): void', '+removeAttendee(s: Student): void', '+getAttendeeCount(): int'],
      },
      'student': {
        id: 'student',
        kind: 'class' as const,
        name: 'Student',
        attributes: ['-id: String', '-name: String', '-rsvpList: List<Event>'],
        methods: ['+rsvpEvent(e: Event): boolean', '+cancelRSVP(e: Event): void', '+getEvents(): List<Event>'],
      },
      'notification': {
        id: 'notification',
        kind: 'class' as const,
        name: 'Notification',
        attributes: ['-type: String', '-recipient: Student', '-message: String'],
        methods: ['+send(): void'],
      },
    },
    relationships: {
      'rel1': {
        id: 'rel1',
        source: 'event',
        target: 'student',
        kind: 'association' as const,
        label: 'attends',
      },
      'rel2': {
        id: 'rel2',
        source: 'event',
        target: 'notification',
        kind: 'aggregation' as const,
      },
    },
  },

  priya: {
    name: 'Priya - Capacity Management',
    entities: {
      'event': {
        id: 'event',
        kind: 'class' as const,
        name: 'Event',
        attributes: ['-id: String', '-name: String', '-maxCapacity: int', '-currentLoad: int'],
        methods: ['+checkCapacity(): boolean', '+addAttendee(a: Attendee): boolean', '+removeAttendee(a: Attendee): void'],
      },
      'attendee': {
        id: 'attendee',
        kind: 'class' as const,
        name: 'Attendee',
        attributes: ['-id: String', '-name: String', '-registeredEvents: List<Event>'],
        methods: ['+registerForEvent(e: Event): boolean', '+unregisterFromEvent(e: Event): void'],
      },
      'capacity': {
        id: 'capacity',
        kind: 'class' as const,
        name: 'CapacityManager',
        attributes: ['-maxPerEvent: int'],
        methods: ['+enforceLimit(event: Event): void', '+getAvailableSlots(event: Event): int'],
      },
    },
    relationships: {
      'rel1': {
        id: 'rel1',
        source: 'event',
        target: 'attendee',
        kind: 'association' as const,
        label: '0..*',
      },
      'rel2': {
        id: 'rel2',
        source: 'event',
        target: 'capacity',
        kind: 'association' as const,
      },
    },
  },
}

export type ScenarioKey = keyof typeof SCENARIOS

export function getScenario(key: ScenarioKey) {
  return SCENARIOS[key]
}

export function getScenarioNames(): ScenarioKey[] {
  return Object.keys(SCENARIOS) as ScenarioKey[]
}

