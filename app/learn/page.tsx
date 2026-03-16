import Link from 'next/link'

export const metadata = {
  title: 'Learn UML Diagrams | CampusConnect CS2340',
  description: 'Learn the 5 UML diagram types used in CS2340 through the CampusConnect case study',
}

// ─── Small Diagram Illustrations (pure HTML/SVG) ─────────────────────────────

function UCDIllustration() {
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-xl mx-auto" style={{ fontFamily: 'inherit' }}>
      {/* System boundary */}
      <rect x="130" y="20" width="360" height="250" rx="6" fill="none" stroke="#003057" strokeWidth="1.5" strokeDasharray="6,3" />
      <text x="310" y="14" textAnchor="middle" fontSize="11" fill="#003057" fontWeight="bold">CampusConnect System</text>

      {/* Actors */}
      {/* Jordan */}
      <circle cx="40" cy="80" r="14" fill="none" stroke="#10b981" strokeWidth="2" />
      <line x1="40" y1="94" x2="40" y2="130" stroke="#10b981" strokeWidth="2" />
      <line x1="20" y1="108" x2="60" y2="108" stroke="#10b981" strokeWidth="2" />
      <line x1="40" y1="130" x2="22" y2="155" stroke="#10b981" strokeWidth="2" />
      <line x1="40" y1="130" x2="58" y2="155" stroke="#10b981" strokeWidth="2" />
      <text x="40" y="170" textAnchor="middle" fontSize="11" fill="#003057" fontWeight="600">Jordan</text>
      <text x="40" y="183" textAnchor="middle" fontSize="9" fill="#666">(Student)</text>

      {/* Maya */}
      <circle cx="40" cy="220" r="14" fill="none" stroke="#10b981" strokeWidth="2" />
      <line x1="40" y1="234" x2="40" y2="265" stroke="#10b981" strokeWidth="2" />
      <line x1="20" y1="248" x2="60" y2="248" stroke="#10b981" strokeWidth="2" />
      <line x1="40" y1="265" x2="22" y2="285" stroke="#10b981" strokeWidth="2" />
      <line x1="40" y1="265" x2="58" y2="285" stroke="#10b981" strokeWidth="2" />
      <text x="40" y="300" textAnchor="middle" fontSize="11" fill="#003057" fontWeight="600" />

      {/* Use Cases */}
      <ellipse cx="270" cy="70" rx="90" ry="26" fill="#EFF6FF" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="270" y="74" textAnchor="middle" fontSize="11" fill="#1e3a5f" fontWeight="600">Login via SSO</text>

      <ellipse cx="270" cy="135" rx="100" ry="26" fill="#EFF6FF" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="270" y="139" textAnchor="middle" fontSize="11" fill="#1e3a5f" fontWeight="600">Submit Membership Request</text>

      <ellipse cx="270" cy="200" rx="95" ry="26" fill="#EFF6FF" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="270" y="204" textAnchor="middle" fontSize="11" fill="#1e3a5f" fontWeight="600">Approve / Reject Request</text>

      <ellipse cx="430" cy="135" rx="75" ry="26" fill="#EFF6FF" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="430" y="131" textAnchor="middle" fontSize="10" fill="#1e3a5f" fontWeight="600">Review</text>
      <text x="430" y="143" textAnchor="middle" fontSize="10" fill="#1e3a5f" fontWeight="600">Requests</text>

      {/* Association lines */}
      <line x1="54" y1="80" x2="180" y2="70" stroke="#555" strokeWidth="1.2" />
      <line x1="54" y1="88" x2="170" y2="135" stroke="#555" strokeWidth="1.2" />
      <line x1="54" y1="220" x2="175" y2="200" stroke="#555" strokeWidth="1.2" />
      <line x1="54" y1="214" x2="180" y2="135" stroke="#555" strokeWidth="1.2" />
      <line x1="365" y1="135" x2="355" y2="135" stroke="#555" strokeWidth="1.2" strokeDasharray="5,3" />
      <text x="360" y="128" fontSize="9" fill="#666" textAnchor="middle">«includes»</text>
    </svg>
  )
}

function DMDIllustration() {
  return (
    <svg viewBox="0 0 500 300" className="w-full max-w-xl mx-auto">
      {/* Student */}
      <rect x="10" y="100" width="130" height="80" rx="4" fill="white" stroke="#0f766e" strokeWidth="2" />
      <rect x="10" y="100" width="130" height="26" rx="4" fill="#0f766e" />
      <rect x="10" y="122" width="130" height="4" fill="#0f766e" />
      <text x="75" y="118" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">Student</text>
      <text x="18" y="140" fontSize="10" fill="#333">name: String</text>
      <text x="18" y="154" fontSize="10" fill="#333">email: String</text>
      <text x="18" y="168" fontSize="10" fill="#333">major: String</text>

      {/* Organization */}
      <rect x="185" y="30" width="140" height="90" rx="4" fill="white" stroke="#0f766e" strokeWidth="2" />
      <rect x="185" y="30" width="140" height="26" rx="4" fill="#0f766e" />
      <rect x="185" y="52" width="140" height="4" fill="#0f766e" />
      <text x="255" y="48" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">Organization</text>
      <text x="193" y="68" fontSize="10" fill="#333">orgId: String</text>
      <text x="193" y="82" fontSize="10" fill="#333">name: String</text>
      <text x="193" y="96" fontSize="10" fill="#333">description: String</text>

      {/* Event */}
      <rect x="340" y="100" width="145" height="100" rx="4" fill="white" stroke="#0f766e" strokeWidth="2" />
      <rect x="340" y="100" width="145" height="26" rx="4" fill="#0f766e" />
      <rect x="340" y="122" width="145" height="4" fill="#0f766e" />
      <text x="412" y="118" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">Event</text>
      <text x="348" y="140" fontSize="10" fill="#333">title: String</text>
      <text x="348" y="154" fontSize="10" fill="#333">date: Date</text>
      <text x="348" y="168" fontSize="10" fill="#333">location: String</text>
      <text x="348" y="182" fontSize="10" fill="#333">maxCapacity: int</text>

      {/* MembershipRequest */}
      <rect x="185" y="200" width="140" height="70" rx="4" fill="white" stroke="#0f766e" strokeWidth="2" />
      <rect x="185" y="200" width="140" height="26" rx="4" fill="#0f766e" />
      <rect x="185" y="222" width="140" height="4" fill="#0f766e" />
      <text x="255" y="215" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">MembershipRequest</text>
      <text x="193" y="238" fontSize="10" fill="#333">status: String</text>
      <text x="193" y="252" fontSize="10" fill="#333">submittedAt: Date</text>

      {/* Relationships */}
      {/* Student → Organization (member) */}
      <line x1="140" y1="120" x2="185" y2="80" stroke="#555" strokeWidth="1.5" />
      <text x="157" y="96" fontSize="9" fill="#666">member</text>
      <text x="138" y="116" fontSize="9" fill="#555">0..*</text>

      {/* Organization → Event (composition) */}
      <polygon points="325,95 335,90 335,100" fill="#555" />
      <rect x="320" y="92" width="8" height="8" fill="#555" transform="rotate(45 324 96)" />
      <line x1="325" y1="95" x2="340" y2="120" stroke="#555" strokeWidth="1.5" />
      <text x="352" y="112" fontSize="9" fill="#555">1..*</text>

      {/* Student → MembershipRequest */}
      <line x1="75" y1="180" x2="185" y2="220" stroke="#555" strokeWidth="1.5" />
      <text x="108" y="207" fontSize="9" fill="#555">0..*</text>

      {/* MembershipRequest → Organization */}
      <line x1="255" y1="200" x2="255" y2="120" stroke="#555" strokeWidth="1.5" />
    </svg>
  )
}

function DCDIllustration() {
  return (
    <svg viewBox="0 0 540 320" className="w-full max-w-xl mx-auto">
      {/* Officer */}
      <rect x="10" y="10" width="150" height="120" rx="3" fill="white" stroke="#003057" strokeWidth="2" />
      <rect x="10" y="10" width="150" height="28" rx="3" fill="#003057" />
      <rect x="10" y="34" width="150" height="4" fill="#003057" />
      <line x1="10" y1="72" x2="160" y2="72" stroke="#ddd" strokeWidth="1" />
      <text x="85" y="30" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">Officer</text>
      <text x="16" y="52" fontSize="9" fill="#333">-id: String</text>
      <text x="16" y="63" fontSize="9" fill="#333">-role: String</text>
      <text x="16" y="84" fontSize="9" fill="#333">+createEvent(): Event</text>
      <text x="16" y="96" fontSize="9" fill="#333">+viewRoster(): List</text>

      {/* Student */}
      <rect x="10" y="200" width="150" height="110" rx="3" fill="white" stroke="#003057" strokeWidth="2" />
      <rect x="10" y="200" width="150" height="28" rx="3" fill="#003057" />
      <rect x="10" y="224" width="150" height="4" fill="#003057" />
      <line x1="10" y1="262" x2="160" y2="262" stroke="#ddd" strokeWidth="1" />
      <text x="85" y="220" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">Student</text>
      <text x="16" y="242" fontSize="9" fill="#333">-id: String</text>
      <text x="16" y="253" fontSize="9" fill="#333">-email: String</text>
      <text x="16" y="274" fontSize="9" fill="#333">+rsvpEvent(e): boolean</text>
      <text x="16" y="286" fontSize="9" fill="#333">+cancelRSVP(e): void</text>

      {/* Inheritance arrow */}
      <line x1="85" y1="130" x2="85" y2="200" stroke="#003057" strokeWidth="1.5" />
      <polygon points="85,130 79,142 91,142" fill="white" stroke="#003057" strokeWidth="1.5" />
      <text x="92" y="167" fontSize="9" fill="#666">extends</text>

      {/* Organization */}
      <rect x="195" y="10" width="155" height="110" rx="3" fill="white" stroke="#003057" strokeWidth="2" />
      <rect x="195" y="10" width="155" height="28" rx="3" fill="#003057" />
      <rect x="195" y="34" width="155" height="4" fill="#003057" />
      <line x1="195" y1="72" x2="350" y2="72" stroke="#ddd" strokeWidth="1" />
      <text x="272" y="30" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">Organization</text>
      <text x="201" y="52" fontSize="9" fill="#333">-id: String</text>
      <text x="201" y="63" fontSize="9" fill="#333">-name: String</text>
      <text x="201" y="84" fontSize="9" fill="#333">+addEvent(e): void</text>
      <text x="201" y="96" fontSize="9" fill="#333">+getMembers(): List</text>

      {/* Event */}
      <rect x="375" y="10" width="155" height="145" rx="3" fill="white" stroke="#003057" strokeWidth="2" />
      <rect x="375" y="10" width="155" height="28" rx="3" fill="#003057" />
      <rect x="375" y="34" width="155" height="4" fill="#003057" />
      <line x1="375" y1="86" x2="530" y2="86" stroke="#ddd" strokeWidth="1" />
      <text x="452" y="30" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">Event</text>
      <text x="381" y="52" fontSize="9" fill="#333">-title: String</text>
      <text x="381" y="63" fontSize="9" fill="#333">-date: Date</text>
      <text x="381" y="74" fontSize="9" fill="#333">-maxCapacity: int</text>
      <text x="381" y="98" fontSize="9" fill="#333">+isFull(): boolean</text>
      <text x="381" y="110" fontSize="9" fill="#333">+addRSVP(s): boolean</text>
      <text x="381" y="122" fontSize="9" fill="#333">+cancelRSVP(s): void</text>

      {/* Officer → Organization (association) */}
      <line x1="160" y1="60" x2="195" y2="60" stroke="#555" strokeWidth="1.5" />
      <polygon points="195,55 195,65 205,60" fill="#555" />
      <text x="173" y="54" fontSize="9" fill="#555">1..*</text>

      {/* Organization → Event (composition) */}
      <line x1="350" y1="60" x2="375" y2="60" stroke="#555" strokeWidth="1.5" />
      <polygon points="350,55 350,65 340,60" fill="#555" />
      <rect x="340" y="56" width="8" height="8" fill="#555" />
      <text x="358" y="54" fontSize="9" fill="#555">0..*</text>

      {/* Student → Event (association) */}
      <line x1="160" y1="255" x2="452" y2="155" stroke="#555" strokeWidth="1.5" />
      <text x="300" y="220" fontSize="9" fill="#555">rsvps 0..*</text>
    </svg>
  )
}

function SDIllustration() {
  const lifelines = [
    { x: 65,  label: 'daniel:Officer' },
    { x: 195, label: ':CampusConnect\nUI' },
    { x: 325, label: ':Event\nController' },
    { x: 440, label: ':Event\nRepository' },
  ]
  const msgs = [
    { from: 0, to: 1, y: 105, label: '1: login()', dashed: false },
    { from: 1, to: 0, y: 125, label: '2: showDashboard()', dashed: true },
    { from: 0, to: 1, y: 150, label: '3: createEvent(data)', dashed: false },
    { from: 1, to: 2, y: 175, label: '4: createEvent(eventData)', dashed: false },
    { from: 2, to: 3, y: 200, label: '5: save(event)', dashed: false },
    { from: 3, to: 2, y: 220, label: '6: eventId: String', dashed: true },
    { from: 2, to: 1, y: 245, label: '7: eventCreated(event)', dashed: true },
    { from: 1, to: 0, y: 270, label: '8: confirmCreated()', dashed: true },
  ]

  return (
    <svg viewBox="0 0 520 310" className="w-full max-w-2xl mx-auto">
      {lifelines.map((ll, i) => (
        <g key={i}>
          <rect x={ll.x - 55} y="10" width="110" height="42" rx="4" fill="#003057" />
          {ll.label.split('\n').map((line, j) => (
            <text key={j} x={ll.x} y={28 + j * 14} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">{line}</text>
          ))}
          <line x1={ll.x} y1="52" x2={ll.x} y2="300" stroke="#003057" strokeWidth="1.5" strokeDasharray="5,4" />
        </g>
      ))}

      {msgs.map((m, i) => {
        const x1 = lifelines[m.from].x
        const x2 = lifelines[m.to].x
        const dir = x2 > x1 ? 1 : -1
        const arrowX = x2 - dir * 8
        return (
          <g key={i}>
            <line x1={x1} y1={m.y} x2={x2} y2={m.y} stroke="#374151" strokeWidth="1.5" strokeDasharray={m.dashed ? '5,3' : 'none'} />
            <polygon points={`${x2},${m.y} ${arrowX},${m.y - 4} ${arrowX},${m.y + 4}`} fill="#374151" />
            <text x={(x1 + x2) / 2} y={m.y - 4} textAnchor="middle" fontSize="9" fill="#374151">{m.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function SSDIllustration() {
  const msgs = [
    { fromActor: true, y: 105, label: '1: login(credentials)' },
    { fromActor: false, y: 130, label: '2: authenticated(session)' },
    { fromActor: true, y: 160, label: '3: viewProfile()' },
    { fromActor: false, y: 185, label: '4: profile(orgs, events)' },
    { fromActor: true, y: 215, label: '5: getUpcomingEvents()' },
    { fromActor: false, y: 240, label: '6: eventList([...])' },
    { fromActor: true, y: 270, label: '7: selectEvent(eventId)' },
    { fromActor: false, y: 295, label: '8: eventDetails(...)' },
  ]

  return (
    <svg viewBox="0 0 480 330" className="w-full max-w-xl mx-auto">
      {/* Actor - Priya */}
      <circle cx="60" cy="25" r="15" fill="none" stroke="#10b981" strokeWidth="2" />
      <line x1="60" y1="40" x2="60" y2="75" stroke="#10b981" strokeWidth="2" />
      <line x1="40" y1="52" x2="80" y2="52" stroke="#10b981" strokeWidth="2" />
      <line x1="60" y1="75" x2="44" y2="95" stroke="#10b981" strokeWidth="2" />
      <line x1="60" y1="75" x2="76" y2="95" stroke="#10b981" strokeWidth="2" />
      <text x="60" y="108" textAnchor="middle" fontSize="11" fill="#003057" fontWeight="bold">Priya</text>
      <line x1="60" y1="115" x2="60" y2="330" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,4" />

      {/* System box */}
      <rect x="315" y="10" width="150" height="50" rx="4" fill="#003057" />
      <text x="390" y="30" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">:CampusConnect</text>
      <text x="390" y="46" textAnchor="middle" fontSize="10" fill="#B3A369">System</text>
      <line x1="390" y1="60" x2="390" y2="330" stroke="#003057" strokeWidth="1.5" strokeDasharray="5,4" />

      {/* System boundary label */}
      <rect x="120" y="4" width="340" height="322" rx="4" fill="none" stroke="#003057" strokeWidth="1" strokeDasharray="6,3" />
      <text x="290" y="338" textAnchor="middle" fontSize="9" fill="#555">«system»</text>

      {msgs.map((m, i) => {
        const x1 = m.fromActor ? 60 : 390
        const x2 = m.fromActor ? 390 : 60
        const dir = x2 > x1 ? 1 : -1
        const arrowX = x2 - dir * 8
        return (
          <g key={i}>
            <line x1={x1} y1={m.y} x2={x2} y2={m.y} stroke="#374151" strokeWidth="1.5" strokeDasharray={m.fromActor ? 'none' : '5,3'} />
            <polygon points={`${x2},${m.y} ${arrowX},${m.y - 4} ${arrowX},${m.y + 4}`} fill="#374151" />
            <text x={(x1 + x2) / 2} y={m.y - 4} textAnchor="middle" fontSize="9" fill="#374151">{m.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Diagram Info Card ────────────────────────────────────────────────────────

type DiagramInfo = {
  id: string
  abbr: string
  name: string
  color: string
  bgColor: string
  borderColor: string
  scenario: string
  purpose: string
  keyElements: string[]
  steps: string[]
  connections: { to: string; how: string }[]
  illustration: React.ReactNode
}

const DIAGRAMS: DiagramInfo[] = [
  {
    id: 'ucd',
    abbr: 'UCD',
    name: 'Use Case Diagram',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-400',
    scenario: 'Scenarios 1, 2 & 3 — Jordan joins AI Club, Daniel creates an event, Priya views her profile',
    purpose:
      'A UCD captures what the system does from an external perspective. It identifies actors (people or systems that interact with CampusConnect) and use cases (the actions they can perform). UCDs answer the question: "Who uses the system and what can they do?" They serve as the starting point for requirements gathering.',
    keyElements: [
      'Actor — a stick figure representing a person or external system (e.g., Jordan, Maya, Auth System)',
      'Use Case — an oval naming a system function (e.g., "Submit Membership Request")',
      'Association — a line connecting an actor to a use case they initiate',
      '«include» — a dashed arrow meaning one use case always calls another (e.g., every RSVP sends a notification)',
      '«extend» — a dashed arrow meaning one use case optionally extends another',
      'System Boundary — a rectangle showing what is inside vs outside the system',
    ],
    steps: [
      'Identify the actors: who interacts with CampusConnect? (Students, Officers, Presidents, Auth System)',
      'List all actions users can perform: login, search orgs, submit request, create event, RSVP, view profile…',
      'Draw ovals for each use case inside the system boundary',
      'Connect each actor to the use cases they initiate with a solid line',
      'Find shared behaviors — if "RSVP" always triggers "Send Notification", draw an «include» arrow',
      'Find optional extensions — if "View Event Details" extends "View Upcoming Events", draw «extend»',
    ],
    connections: [
      { to: 'DMD', how: 'Actors in UCD become domain concepts in the DMD (Student, Organization, etc.)' },
      { to: 'DCD', how: 'Use cases map to methods on classes in the DCD' },
      { to: 'SD', how: 'Each use case can be detailed as a sequence of messages in an SD' },
      { to: 'SSD', how: 'SSD shows the actor-to-system interactions for one use case flow' },
    ],
    illustration: <UCDIllustration />,
  },
  {
    id: 'dmd',
    abbr: 'DMD',
    name: 'Domain Model Diagram',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-400',
    scenario: 'Full CampusConnect context — Student, Organization, Event, MembershipRequest, RSVP',
    purpose:
      'A DMD represents the real-world concepts in the problem domain and the relationships between them, without any implementation details. Think of it as a vocabulary for CampusConnect. It shows what things exist (Student, Event, Organization) and how they relate, but NOT how the code is structured. It bridges the gap between requirements and design.',
    keyElements: [
      'Domain Class — a rectangle with the concept name and its real-world attributes (no methods)',
      'Association — a line between two concepts showing they are related (e.g., Student "rsvps" Event)',
      'Composition — a filled diamond showing that one concept owns another (Organization owns Events)',
      'Multiplicity — numbers on each end of a relationship (1, *, 0..1, 1..*) showing cardinality',
      'Role labels — text on a relationship line describing the role (e.g., "is president of")',
    ],
    steps: [
      'Identify all real-world concepts from the requirements: Student, Organization, Event, MembershipRequest, RSVP',
      'List only the key attributes for each concept (no methods, no visibility modifiers)',
      'Find relationships: a Student can belong to many Organizations; an Organization hosts many Events',
      'Determine multiplicities: a Student "is president of" exactly 1 Organization at a time',
      'Add role labels where the relationship type is not obvious',
      'Confirm with the requirements: can every concept and relationship be traced back to a requirement?',
    ],
    connections: [
      { to: 'UCD', how: 'Domain concepts come from actors and the things they interact with in the UCD' },
      { to: 'DCD', how: 'Every domain concept becomes a class in the DCD; associations become typed relationships' },
      { to: 'SD', how: 'Domain concepts become lifelines in the SD when they participate in message flows' },
    ],
    illustration: <DMDIllustration />,
  },
  {
    id: 'dcd',
    abbr: 'DCD',
    name: 'Design Class Diagram',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    scenario: 'Scenario 2 — Daniel (Officer) creates a Robotics Club workshop; students RSVP until capacity',
    purpose:
      'A DCD is the implementation-ready version of the domain model. It adds methods, visibility modifiers (+ public, - private, # protected), typed attributes, and precise relationships (aggregation, composition, inheritance). The DCD is what developers use to write code. Every class in a DCD has both data (attributes) and behavior (methods).',
    keyElements: [
      'Class box — three sections: class name (top), attributes (middle), methods (bottom)',
      'Visibility modifiers — + (public), - (private), # (protected) before attribute/method names',
      'Typed attributes — e.g., -title: String, -maxCapacity: int',
      'Methods with signatures — e.g., +addRSVP(s: Student): boolean',
      'Association — a line, optionally with role names and multiplicity',
      'Aggregation — an open diamond (◇) meaning a "has-a" relationship without ownership',
      'Composition — a filled diamond (◆) meaning strong ownership (if Organization is deleted, its Events are too)',
      'Inheritance — a hollow triangle (△) pointing to the parent class (Officer extends Student)',
    ],
    steps: [
      'Start from the Domain Model — every domain concept becomes a class',
      'Add visibility modifiers to all attributes (- for private, + for public)',
      'Add the data types to each attribute (-title: String, -date: Date)',
      'Identify the methods each class needs based on the use cases (RSVP → +addRSVP(s: Student): boolean)',
      'Refine relationships: is it aggregation or composition? Does one class inherit from another?',
      'Add multiplicity to all relationships (1..*, 0..*)',
      'Cross-check: every use case from the UCD should be traceable to a method in the DCD',
    ],
    connections: [
      { to: 'DMD', how: 'Every DCD class refines a DMD concept — adds methods, visibility, and types' },
      { to: 'SD', how: 'Messages in the SD call methods defined in the DCD (e.g., save(event) maps to +save(): void)' },
      { to: 'UCD', how: 'Each use case maps to one or more methods on DCD classes' },
    ],
    illustration: <DCDIllustration />,
  },
  {
    id: 'sd',
    abbr: 'SD',
    name: 'Sequence Diagram',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-400',
    scenario: 'Scenario 2 — Daniel creates a workshop event; the system persists it and confirms creation',
    purpose:
      'An SD shows how objects inside the system collaborate to complete a use case. It focuses on the ORDER of messages and the internal delegation of responsibilities. Unlike an SSD (which treats the system as a black box), an SD shows the internal components (EventController, EventRepository, NotificationService) and how they talk to each other.',
    keyElements: [
      'Lifeline — a rectangle at the top with a dashed vertical line below, representing an object (e.g., :EventController)',
      'Message — a horizontal solid arrow from sender to receiver, labeled with the method call',
      'Return message — a horizontal dashed arrow returning a value from receiver to sender',
      'Activation box — an optional narrow rectangle on a lifeline showing when the object is active',
      'Sequence numbers — numbers at the start of message labels (1:, 2:, …) showing order',
      'Self-call — a message from a lifeline back to itself (looping)',
    ],
    steps: [
      'Pick the use case to model (e.g., "Create Event" from Scenario 2)',
      'List the objects that participate: Daniel:Officer, :CampusConnectUI, :EventController, :EventRepository',
      'Draw each object as a lifeline from left to right in order of first involvement',
      'Trace the messages from top to bottom: Daniel calls login(), UI calls EventController, controller calls repository',
      'Add return messages (dashed arrows) wherever the caller needs a result',
      'Verify: every message label must correspond to a method in the DCD',
    ],
    connections: [
      { to: 'UCD', how: 'Each SD models one use case from the UCD in detail' },
      { to: 'DCD', how: 'Message labels in the SD must match method signatures in the DCD' },
      { to: 'SSD', how: 'The SSD is the "black box" view of the same flow — the SD shows what happens inside' },
      { to: 'DMD', how: 'Lifeline names are the domain concepts from the DMD, now as objects' },
    ],
    illustration: <SDIllustration />,
  },
  {
    id: 'ssd',
    abbr: 'SSD',
    name: 'System Sequence Diagram',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-400',
    scenario: 'Scenario 3 — Priya logs in, views her profile, sees upcoming events, and selects one to view details',
    purpose:
      'An SSD treats the entire system as a single black box and shows the messages between an actor and the system. Unlike an SD, the SSD does not show internal components. Its purpose is to define the system operations — the "API" that the system exposes to the outside world. SSDs are often the first diagrams created after use cases, since they define the interface without committing to internal design.',
    keyElements: [
      'Actor — a stick figure on the left representing the external user (Priya)',
      'System box — a single lifeline named ":CampusConnect" representing the whole system',
      'System operation — a message from the actor to the system (a named operation the system must support)',
      'System output — a dashed return message from the system to the actor',
      'Sequence numbers — numbered messages (1:, 2:, …) defining the interaction order',
    ],
    steps: [
      'Choose the scenario to model (Scenario 3: Priya views profile and events)',
      'Identify the actor: Priya:Student',
      'Draw the system as a single lifeline: :CampusConnectSystem',
      'Write all input operations from the actor to the system: login(), viewProfile(), selectEvent()',
      'Write all outputs from the system back to the actor: authenticated(), profile(…), eventDetails(…)',
      'Number each message in order to show the sequence',
      'Note: do NOT show internal classes — the whole system is one box',
    ],
    connections: [
      { to: 'UCD', how: 'Each SSD models one actor–system flow from the UCD' },
      { to: 'SD', how: 'Each system operation in the SSD becomes a detailed message flow in the SD' },
      { to: 'DCD', how: 'System operations in the SSD map to methods on the controller/facade classes in the DCD' },
    ],
    illustration: <SSDIllustration />,
  },
]

// ─── Connections Overview ─────────────────────────────────────────────────────

function TraceabilityMap() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-1 items-center text-center text-sm font-semibold">
      {[
        { abbr: 'UCD', bg: 'bg-emerald-100', text: 'text-emerald-800', desc: 'What can actors do?' },
        { abbr: 'DMD', bg: 'bg-teal-100', text: 'text-teal-800', desc: 'What things exist?' },
        { abbr: 'DCD', bg: 'bg-blue-100', text: 'text-blue-800', desc: 'How is it structured?' },
        { abbr: 'SD', bg: 'bg-violet-100', text: 'text-violet-800', desc: 'How do objects collaborate?' },
        { abbr: 'SSD', bg: 'bg-orange-100', text: 'text-orange-800', desc: 'What does the actor see?' },
      ].map((d, i) => (
        <div key={d.abbr} className="flex flex-col items-center gap-2">
          <div className={`w-16 h-16 rounded-full ${d.bg} ${d.text} flex items-center justify-center text-xl font-black border-2 border-current`}>
            {d.abbr}
          </div>
          <p className="text-xs text-gray-600 max-w-[100px] leading-tight">{d.desc}</p>
          {i < 4 && (
            <div className="hidden md:flex items-center absolute right-0 translate-x-1/2">
              <span className="text-gray-400 text-lg">→</span>
            </div>
          )}
        </div>
      ))}
      <div className="col-span-full hidden md:block">
        <div className="flex items-center justify-center gap-0">
          {[0,1,2,3].map(i => (
            <div key={i} className="flex items-center">
              <div className="w-8 h-0.5 bg-gray-300" />
              <div className="text-gray-400 text-sm">→</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-1">Design process flows left to right — each diagram builds on the previous</p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-gt-navy text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gt-techgold font-black text-xl tracking-tight hover:opacity-80 transition-opacity">
              🏛️ UML Studio
            </Link>
            <span className="text-white/30">|</span>
            <span className="text-white/80 text-sm font-semibold">Learn UML Diagrams</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-1">
              {DIAGRAMS.map(d => (
                <a key={d.id} href={`#${d.id}`}
                  className="px-3 py-1.5 rounded text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all">
                  {d.abbr}
                </a>
              ))}
            </nav>
            <Link href="/"
              className="px-4 py-2 bg-gt-techgold text-gt-navy rounded-lg font-bold text-sm hover:bg-[#e0a800] transition-colors">
              Open Canvas →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gt-navy text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-gt-techgold/20 text-gt-techgold px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-2">
            CS 2340 • Georgia Tech
          </div>
          <h1 className="text-5xl font-black tracking-tight">
            Learn UML Diagramming
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Master the 5 UML diagrams used in CS2340 through the{' '}
            <span className="text-gt-techgold font-bold">CampusConnect</span> case study —
            a platform for managing student organizations and events at Georgia Tech.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {DIAGRAMS.map(d => (
              <a key={d.id} href={`#${d.id}`}
                className={`px-4 py-2 rounded-lg text-sm font-bold ${d.bgColor} ${d.color} ${d.borderColor} border hover:opacity-80 transition-opacity`}>
                {d.abbr} — {d.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Context */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-2xl font-black text-gt-navy mb-4">The CampusConnect Case Study</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Georgia Tech needs a centralized platform called <strong>CampusConnect</strong> to manage student
            organizations, memberships, and events. We will use three scenarios to drive our diagrams:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Scenario 1 — Jordan Joins a Club', text: 'Jordan searches for the AI Club, submits a membership request. Maya (president) reviews and approves it. Jordan receives a confirmation.' },
              { title: 'Scenario 2 — Daniel Creates an Event', text: 'Daniel (Robotics Club officer) creates a workshop event. Students RSVP until capacity. One student cancels, freeing a slot for another.' },
              { title: 'Scenario 3 — Priya Views Events', text: 'Priya (member of 3 orgs) logs in, views her profile, sees upcoming events from her organizations, and selects one for details.' },
            ].map(s => (
              <div key={s.title} className="bg-gt-navy/5 rounded-xl p-4 border border-gt-navy/10">
                <h3 className="font-bold text-gt-navy text-sm mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Diagrams Connect */}
      <section className="max-w-4xl mx-auto px-6 pb-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-2xl font-black text-gt-navy mb-2">How the 5 Diagrams Connect</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Each diagram builds on the previous one. Together they form a complete, consistent model of CampusConnect.
            The same concepts — Student, Event, Organization — appear across all diagrams, just at different levels of detail.
          </p>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="flex items-stretch gap-0">
                {[
                  { abbr: 'UCD', title: 'Requirements', desc: 'Who uses the system?', color: 'bg-emerald-500', example: 'Jordan submits a membership request' },
                  { abbr: 'DMD', title: 'Domain', desc: 'What concepts exist?', color: 'bg-teal-500', example: 'Student, Org, MembershipRequest' },
                  { abbr: 'DCD', title: 'Design', desc: 'How is it structured?', color: 'bg-blue-500', example: 'Class Student with +rsvpEvent()' },
                  { abbr: 'SD', title: 'Interaction', desc: 'Internal collaboration', color: 'bg-violet-500', example: ':EventController calls .save()' },
                  { abbr: 'SSD', title: 'Interface', desc: 'External contract', color: 'bg-orange-500', example: 'Priya → System: viewProfile()' },
                ].map((item, i) => (
                  <div key={item.abbr} className="flex items-center flex-1">
                    <div className="flex-1">
                      <div className={`${item.color} text-white rounded-xl p-4 text-center`}>
                        <div className="text-2xl font-black">{item.abbr}</div>
                        <div className="text-xs font-bold opacity-90 mt-1">{item.title}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">{item.desc}</div>
                      </div>
                      <p className="text-[10px] text-gray-500 text-center mt-2 px-1 leading-tight">{item.example}</p>
                    </div>
                    {i < 4 && (
                      <div className="flex flex-col items-center mx-1 shrink-0">
                        <span className="text-gray-400 text-xl">→</span>
                        <span className="text-[9px] text-gray-400 whitespace-nowrap">refines</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gt-navy/5 rounded-xl p-4">
            <h3 className="font-bold text-gt-navy text-sm mb-3">Internal Consistency Rules</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2"><span className="text-gt-techgold font-bold shrink-0">→</span> Every <strong>use case</strong> in the UCD must map to one or more <strong>methods</strong> in the DCD.</li>
              <li className="flex gap-2"><span className="text-gt-techgold font-bold shrink-0">→</span> Every <strong>domain concept</strong> in the DMD must become a <strong>class</strong> in the DCD.</li>
              <li className="flex gap-2"><span className="text-gt-techgold font-bold shrink-0">→</span> Every <strong>message label</strong> in the SD must match a <strong>method signature</strong> in the DCD.</li>
              <li className="flex gap-2"><span className="text-gt-techgold font-bold shrink-0">→</span> Every <strong>system operation</strong> in the SSD must appear as an <strong>SD message</strong> in the corresponding SD.</li>
              <li className="flex gap-2"><span className="text-gt-techgold font-bold shrink-0">→</span> The multiplicities in the DCD and DMD must <strong>agree</strong> (e.g., Organization 1..* Events in both).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Diagram Sections */}
      {DIAGRAMS.map((d, idx) => (
        <section key={d.id} id={d.id} className="max-w-4xl mx-auto px-6 pb-12 scroll-mt-20">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className={`p-8 ${d.bgColor} border-b ${d.borderColor}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className={`text-xs font-black uppercase tracking-widest ${d.color} mb-2`}>
                    Diagram {idx + 1} of 5
                  </div>
                  <h2 className={`text-3xl font-black ${d.color}`}>
                    <span className="opacity-60">{d.abbr} —</span> {d.name}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 font-medium">
                    <span className="font-bold">CampusConnect scenario:</span> {d.scenario}
                  </p>
                </div>
                <Link href="/"
                  className={`px-4 py-2 rounded-lg text-sm font-bold ${d.color} border-2 ${d.borderColor} bg-white hover:bg-gray-50 transition-colors shrink-0`}>
                  Try {d.abbr} →
                </Link>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Purpose */}
              <div>
                <h3 className="text-lg font-black text-gt-navy mb-3 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${d.bgColor} ${d.color} flex items-center justify-center text-xs font-black border ${d.borderColor}`}>?</span>
                  Purpose
                </h3>
                <p className="text-gray-700 leading-relaxed">{d.purpose}</p>
              </div>

              {/* Illustration */}
              <div>
                <h3 className="text-lg font-black text-gt-navy mb-3 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${d.bgColor} ${d.color} flex items-center justify-center text-xs font-black border ${d.borderColor}`}>◎</span>
                  CampusConnect Example
                </h3>
                <div className={`${d.bgColor} rounded-xl p-4 border ${d.borderColor}`}>
                  {d.illustration}
                </div>
              </div>

              {/* Key Elements */}
              <div>
                <h3 className="text-lg font-black text-gt-navy mb-3 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${d.bgColor} ${d.color} flex items-center justify-center text-xs font-black border ${d.borderColor}`}>☰</span>
                  Key Elements
                </h3>
                <ul className="space-y-2">
                  {d.keyElements.map((el, i) => {
                    const [term, ...rest] = el.split(' — ')
                    return (
                      <li key={i} className="flex gap-3 text-sm text-gray-700">
                        <span className={`mt-0.5 w-5 h-5 shrink-0 rounded ${d.bgColor} ${d.color} flex items-center justify-center text-xs font-bold border ${d.borderColor}`}>{i + 1}</span>
                        <span><span className="font-bold text-gray-900">{term}</span>{rest.length > 0 ? ' — ' + rest.join(' — ') : ''}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Building Process */}
              <div>
                <h3 className="text-lg font-black text-gt-navy mb-3 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${d.bgColor} ${d.color} flex items-center justify-center text-xs font-black border ${d.borderColor}`}>▶</span>
                  How to Build a {d.abbr}
                </h3>
                <ol className="space-y-3">
                  {d.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700">
                      <span className={`mt-0.5 w-6 h-6 shrink-0 rounded-full ${d.color} border-2 ${d.borderColor} flex items-center justify-center text-xs font-black`}>{i + 1}</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Connections */}
              <div>
                <h3 className="text-lg font-black text-gt-navy mb-3 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${d.bgColor} ${d.color} flex items-center justify-center text-xs font-black border ${d.borderColor}`}>↔</span>
                  Connections to Other Diagrams
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {d.connections.map(c => (
                    <div key={c.to} className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <a href={`#${c.to.toLowerCase()}`}
                        className={`shrink-0 w-10 h-10 rounded-lg ${d.bgColor} ${d.color} font-black text-sm flex items-center justify-center border ${d.borderColor} hover:opacity-80 transition-opacity`}>
                        {c.to}
                      </a>
                      <p className="text-xs text-gray-600 leading-relaxed">{c.how}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-gt-navy py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-black text-white">Ready to Practice?</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Load a pre-built CampusConnect scenario in our collaborative canvas and explore the diagrams interactively.
            Use AI validation to check your work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/"
              className="px-8 py-4 bg-gt-techgold text-gt-navy rounded-xl font-black text-lg hover:bg-[#e0a800] transition-colors">
              Open UML Canvas →
            </Link>
            <a href="#ucd"
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-colors border border-white/20">
              Review Diagrams ↑
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
