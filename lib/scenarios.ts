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
    name: 'Priya - Capacity Management (DCD)',
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

  // ── Domain Model Diagram (DMD) ──────────────────────────────────────────────
  dmd_campus: {
    name: 'CampusConnect - Domain Model (DMD)',
    entities: {
      'dmd_student': {
        id: 'dmd_student',
        kind: 'domain' as const,
        name: 'Student',
        attributes: ['name: String', 'email: String', 'major: String', 'year: int'],
        methods: [],
      },
      'dmd_org': {
        id: 'dmd_org',
        kind: 'domain' as const,
        name: 'Organization',
        attributes: ['name: String', 'description: String', 'type: String'],
        methods: [],
      },
      'dmd_event': {
        id: 'dmd_event',
        kind: 'domain' as const,
        name: 'Event',
        attributes: ['title: String', 'date: Date', 'location: String', 'maxCapacity: int'],
        methods: [],
      },
      'dmd_membership': {
        id: 'dmd_membership',
        kind: 'domain' as const,
        name: 'Membership',
        attributes: ['status: String', 'joinDate: Date', 'role: String'],
        methods: [],
      },
      'dmd_notification': {
        id: 'dmd_notification',
        kind: 'domain' as const,
        name: 'Notification',
        attributes: ['type: String', 'message: String', 'sentAt: Date'],
        methods: [],
      },
      'dmd_authsystem': {
        id: 'dmd_authsystem',
        kind: 'domain' as const,
        name: 'AuthSystem',
        attributes: ['provider: String'],
        methods: [],
      },
    },
    relationships: {
      'dmd_rel1': {
        id: 'dmd_rel1',
        source: 'dmd_student',
        target: 'dmd_membership',
        kind: 'association' as const,
        label: '0..*',
      },
      'dmd_rel2': {
        id: 'dmd_rel2',
        source: 'dmd_org',
        target: 'dmd_membership',
        kind: 'association' as const,
        label: '1..*',
      },
      'dmd_rel3': {
        id: 'dmd_rel3',
        source: 'dmd_org',
        target: 'dmd_event',
        kind: 'composition' as const,
        label: '0..*',
      },
      'dmd_rel4': {
        id: 'dmd_rel4',
        source: 'dmd_student',
        target: 'dmd_event',
        kind: 'association' as const,
        label: 'rsvps',
      },
      'dmd_rel5': {
        id: 'dmd_rel5',
        source: 'dmd_student',
        target: 'dmd_notification',
        kind: 'association' as const,
        label: 'receives',
      },
      'dmd_rel6': {
        id: 'dmd_rel6',
        source: 'dmd_authsystem',
        target: 'dmd_student',
        kind: 'association' as const,
        label: 'authenticates',
      },
    },
  },

  // ── Use Case Diagram (UCD) — Scenarios 1, 2, 3 ─────────────────────────────
  ucd_all: {
    name: 'CampusConnect - Use Case Diagram (UCD)',
    entities: {
      'ucd_student': {
        id: 'ucd_student',
        kind: 'actor' as const,
        name: 'Student',
        attributes: [],
        methods: [],
      },
      'ucd_officer': {
        id: 'ucd_officer',
        kind: 'actor' as const,
        name: 'Club Officer',
        attributes: [],
        methods: [],
      },
      'ucd_president': {
        id: 'ucd_president',
        kind: 'actor' as const,
        name: 'Club President',
        attributes: [],
        methods: [],
      },
      'ucd_authsys': {
        id: 'ucd_authsys',
        kind: 'actor' as const,
        name: 'Auth System',
        attributes: [],
        methods: [],
      },
      'ucd_login': {
        id: 'ucd_login',
        kind: 'usecase' as const,
        name: 'Login via SSO',
        attributes: [],
        methods: [],
      },
      'ucd_logout': {
        id: 'ucd_logout',
        kind: 'usecase' as const,
        name: 'Logout',
        attributes: [],
        methods: [],
      },
      'ucd_search': {
        id: 'ucd_search',
        kind: 'usecase' as const,
        name: 'Search Organization',
        attributes: [],
        methods: [],
      },
      'ucd_request': {
        id: 'ucd_request',
        kind: 'usecase' as const,
        name: 'Submit Membership Request',
        attributes: [],
        methods: [],
      },
      'ucd_approve': {
        id: 'ucd_approve',
        kind: 'usecase' as const,
        name: 'Approve/Reject Membership',
        attributes: [],
        methods: [],
      },
      'ucd_review': {
        id: 'ucd_review',
        kind: 'usecase' as const,
        name: 'Review Membership Requests',
        attributes: [],
        methods: [],
      },
      'ucd_create_event': {
        id: 'ucd_create_event',
        kind: 'usecase' as const,
        name: 'Create Event',
        attributes: [],
        methods: [],
      },
      'ucd_rsvp': {
        id: 'ucd_rsvp',
        kind: 'usecase' as const,
        name: 'RSVP for Event',
        attributes: [],
        methods: [],
      },
      'ucd_cancel': {
        id: 'ucd_cancel',
        kind: 'usecase' as const,
        name: 'Cancel RSVP',
        attributes: [],
        methods: [],
      },
      'ucd_profile': {
        id: 'ucd_profile',
        kind: 'usecase' as const,
        name: 'View Profile & Events',
        attributes: [],
        methods: [],
      },
      'ucd_event_details': {
        id: 'ucd_event_details',
        kind: 'usecase' as const,
        name: 'View Event Details',
        attributes: [],
        methods: [],
      },
    },
    relationships: {
      'ucd_r1': { id: 'ucd_r1', source: 'ucd_student', target: 'ucd_login', kind: 'association' as const },
      'ucd_r2': { id: 'ucd_r2', source: 'ucd_officer', target: 'ucd_login', kind: 'association' as const },
      'ucd_r3': { id: 'ucd_r3', source: 'ucd_president', target: 'ucd_login', kind: 'association' as const },
      'ucd_r4': { id: 'ucd_r4', source: 'ucd_authsys', target: 'ucd_login', kind: 'association' as const },
      'ucd_r5': { id: 'ucd_r5', source: 'ucd_student', target: 'ucd_logout', kind: 'association' as const },
      'ucd_r6': { id: 'ucd_r6', source: 'ucd_student', target: 'ucd_search', kind: 'association' as const },
      'ucd_r7': { id: 'ucd_r7', source: 'ucd_student', target: 'ucd_request', kind: 'association' as const },
      'ucd_r8': { id: 'ucd_r8', source: 'ucd_president', target: 'ucd_review', kind: 'association' as const },
      'ucd_r9': { id: 'ucd_r9', source: 'ucd_review', target: 'ucd_approve', kind: 'includes' as const },
      'ucd_r10': { id: 'ucd_r10', source: 'ucd_officer', target: 'ucd_create_event', kind: 'association' as const },
      'ucd_r11': { id: 'ucd_r11', source: 'ucd_student', target: 'ucd_rsvp', kind: 'association' as const },
      'ucd_r12': { id: 'ucd_r12', source: 'ucd_student', target: 'ucd_cancel', kind: 'association' as const },
      'ucd_r13': { id: 'ucd_r13', source: 'ucd_student', target: 'ucd_profile', kind: 'association' as const },
      'ucd_r14': { id: 'ucd_r14', source: 'ucd_student', target: 'ucd_event_details', kind: 'association' as const },
      'ucd_r15': { id: 'ucd_r15', source: 'ucd_profile', target: 'ucd_event_details', kind: 'includes' as const },
    },
  },

  // ── Design Class Diagram (DCD) — Scenario 2: Daniel creates event ────────────
  dcd_daniel: {
    name: 'Daniel - Create Event (DCD)',
    entities: {
      'dcd_officer': {
        id: 'dcd_officer',
        kind: 'class' as const,
        name: 'Officer',
        attributes: ['-id: String', '-name: String', '-email: String', '-role: String'],
        methods: ['+createEvent(title: String, desc: String, date: Date, loc: String, cap: int): Event', '+viewRoster(): List<Student>'],
      },
      'dcd_student': {
        id: 'dcd_student',
        kind: 'class' as const,
        name: 'Student',
        attributes: ['-id: String', '-name: String', '-email: String', '-major: String'],
        methods: ['+rsvpEvent(e: Event): boolean', '+cancelRSVP(e: Event): void', '+getUpcomingEvents(): List<Event>'],
      },
      'dcd_org': {
        id: 'dcd_org',
        kind: 'class' as const,
        name: 'Organization',
        attributes: ['-id: String', '-name: String', '-description: String'],
        methods: ['+addEvent(e: Event): void', '+getEvents(): List<Event>', '+getMembers(): List<Student>'],
      },
      'dcd_event': {
        id: 'dcd_event',
        kind: 'class' as const,
        name: 'Event',
        attributes: ['-id: String', '-title: String', '-description: String', '-date: Date', '-location: String', '-maxCapacity: int', '-currentRSVPs: int'],
        methods: ['+isFull(): boolean', '+addRSVP(s: Student): boolean', '+cancelRSVP(s: Student): void', '+getAvailableSlots(): int'],
      },
      'dcd_notif': {
        id: 'dcd_notif',
        kind: 'class' as const,
        name: 'NotificationService',
        attributes: ['-channel: String'],
        methods: ['+notifyCapacityFull(e: Event): void', '+notifyRSVPConfirmed(s: Student, e: Event): void'],
      },
    },
    relationships: {
      'dcd_r1': { id: 'dcd_r1', source: 'dcd_officer', target: 'dcd_student', kind: 'inheritance' as const },
      'dcd_r2': { id: 'dcd_r2', source: 'dcd_officer', target: 'dcd_org', kind: 'association' as const, label: '1..*' },
      'dcd_r3': { id: 'dcd_r3', source: 'dcd_org', target: 'dcd_event', kind: 'composition' as const, label: '0..*' },
      'dcd_r4': { id: 'dcd_r4', source: 'dcd_student', target: 'dcd_event', kind: 'association' as const, label: '0..*' },
      'dcd_r5': { id: 'dcd_r5', source: 'dcd_org', target: 'dcd_notif', kind: 'association' as const },
    },
  },

  // ── Sequence Diagram (SD) — Scenario 2: Daniel creates event & students RSVP ─
  sd_daniel: {
    name: 'Daniel - Create Event & RSVP (SD)',
    entities: {
      'sd_daniel': {
        id: 'sd_daniel',
        kind: 'lifeline' as const,
        name: 'daniel:Officer',
        attributes: [],
        methods: [],
      },
      'sd_system': {
        id: 'sd_system',
        kind: 'lifeline' as const,
        name: ':CampusConnect',
        attributes: [],
        methods: [],
      },
      'sd_eventmgr': {
        id: 'sd_eventmgr',
        kind: 'lifeline' as const,
        name: ':EventManager',
        attributes: [],
        methods: [],
      },
      'sd_student': {
        id: 'sd_student',
        kind: 'lifeline' as const,
        name: 'student:Student',
        attributes: [],
        methods: [],
      },
      'sd_notif': {
        id: 'sd_notif',
        kind: 'lifeline' as const,
        name: ':NotificationService',
        attributes: [],
        methods: [],
      },
    },
    relationships: {
      'sd_m1': { id: 'sd_m1', source: 'sd_daniel', target: 'sd_system', kind: 'message' as const, label: '1: login()', sequenceIndex: 1 },
      'sd_m2': { id: 'sd_m2', source: 'sd_system', target: 'sd_daniel', kind: 'message' as const, label: '2: authenticated()', sequenceIndex: 2 },
      'sd_m3': { id: 'sd_m3', source: 'sd_daniel', target: 'sd_system', kind: 'message' as const, label: '3: navigateToRoboticsClub()', sequenceIndex: 3 },
      'sd_m4': { id: 'sd_m4', source: 'sd_daniel', target: 'sd_system', kind: 'message' as const, label: '4: createEvent(title, desc, date, location, capacity)', sequenceIndex: 4 },
      'sd_m5': { id: 'sd_m5', source: 'sd_system', target: 'sd_eventmgr', kind: 'message' as const, label: '5: addEvent(eventData)', sequenceIndex: 5 },
      'sd_m6': { id: 'sd_m6', source: 'sd_eventmgr', target: 'sd_system', kind: 'message' as const, label: '6: eventCreated(eventId)', sequenceIndex: 6 },
      'sd_m7': { id: 'sd_m7', source: 'sd_system', target: 'sd_daniel', kind: 'message' as const, label: '7: confirmEventCreated()', sequenceIndex: 7 },
      'sd_m8': { id: 'sd_m8', source: 'sd_student', target: 'sd_system', kind: 'message' as const, label: '8: rsvp(eventId)', sequenceIndex: 8 },
      'sd_m9': { id: 'sd_m9', source: 'sd_system', target: 'sd_eventmgr', kind: 'message' as const, label: '9: addAttendee(student)', sequenceIndex: 9 },
      'sd_m10': { id: 'sd_m10', source: 'sd_eventmgr', target: 'sd_system', kind: 'message' as const, label: '10: rsvpConfirmed()', sequenceIndex: 10 },
      'sd_m11': { id: 'sd_m11', source: 'sd_system', target: 'sd_notif', kind: 'message' as const, label: '11: sendConfirmation(student)', sequenceIndex: 11 },
      'sd_m12': { id: 'sd_m12', source: 'sd_system', target: 'sd_student', kind: 'message' as const, label: '12: rsvpSuccess()', sequenceIndex: 12 },
    },
  },

  // ── System Sequence Diagram (SSD) — Scenario 3: Priya views events ──────────
  ssd_priya: {
    name: 'Priya - View Events (SSD)',
    entities: {
      'ssd_priya': {
        id: 'ssd_priya',
        kind: 'actor' as const,
        name: 'Priya',
        attributes: [],
        methods: [],
      },
      'ssd_system': {
        id: 'ssd_system',
        kind: 'lifeline' as const,
        name: ':CampusConnect',
        attributes: [],
        methods: [],
      },
    },
    relationships: {
      'ssd_m1': { id: 'ssd_m1', source: 'ssd_priya', target: 'ssd_system', kind: 'message' as const, label: '1: login(credentials)', sequenceIndex: 1 },
      'ssd_m2': { id: 'ssd_m2', source: 'ssd_system', target: 'ssd_priya', kind: 'message' as const, label: '2: authenticated(user)', sequenceIndex: 2 },
      'ssd_m3': { id: 'ssd_m3', source: 'ssd_priya', target: 'ssd_system', kind: 'message' as const, label: '3: viewProfile()', sequenceIndex: 3 },
      'ssd_m4': { id: 'ssd_m4', source: 'ssd_system', target: 'ssd_priya', kind: 'message' as const, label: '4: profile(organizations, upcomingEvents)', sequenceIndex: 4 },
      'ssd_m5': { id: 'ssd_m5', source: 'ssd_priya', target: 'ssd_system', kind: 'message' as const, label: '5: selectEvent(eventId)', sequenceIndex: 5 },
      'ssd_m6': { id: 'ssd_m6', source: 'ssd_system', target: 'ssd_priya', kind: 'message' as const, label: '6: eventDetails(title, date, location, registeredCount)', sequenceIndex: 6 },
      'ssd_m7': { id: 'ssd_m7', source: 'ssd_priya', target: 'ssd_system', kind: 'message' as const, label: '7: logout()', sequenceIndex: 7 },
      'ssd_m8': { id: 'ssd_m8', source: 'ssd_system', target: 'ssd_priya', kind: 'message' as const, label: '8: loggedOut()', sequenceIndex: 8 },
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

