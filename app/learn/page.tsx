import Link from 'next/link'

type DiagramSlide = {
  id: string
  abbr: 'UCD' | 'DMD' | 'DCD' | 'SD' | 'SSD'
  title: string
  scenario: string
  purpose: string
  build: string[]
  connection: string
  color: string
  border: string
  badge: string
}

export const metadata = {
  title: 'Learn UML Diagrams | CampusConnect CS2340',
  description: 'Scroll-based slideshow for learning UML quickly with the CampusConnect case study.',
}

const diagrams: DiagramSlide[] = [
  {
    id: 'ucd',
    abbr: 'UCD',
    title: 'Use Case Diagram',
    scenario: 'Scenarios 1, 2, 3',
    purpose: 'Show who uses CampusConnect and what they can do.',
    build: [
      'List actors: Student, Officer, President, Auth System.',
      'Write use cases as verbs: login, request membership, create event, RSVP.',
      'Connect actors to use cases and mark include/extend when needed.',
    ],
    connection: 'Each use case should map to methods in DCD and message flows in SD/SSD.',
    color: 'text-emerald-800',
    border: 'border-emerald-200/60',
    badge: 'bg-emerald-100',
  },
  {
    id: 'dmd',
    abbr: 'DMD',
    title: 'Domain Model Diagram',
    scenario: 'CampusConnect context',
    purpose: 'Show core concepts and relationships without implementation details.',
    build: [
      'Extract nouns from requirements: Student, Organization, Event, MembershipRequest.',
      'Add attributes only, no methods.',
      'Set multiplicities (e.g., Organization 1..* Event).',
    ],
    connection: 'DMD concepts become DCD classes with types, visibility, and methods.',
    color: 'text-teal-800',
    border: 'border-teal-200/60',
    badge: 'bg-teal-100',
  },
  {
    id: 'dcd',
    abbr: 'DCD',
    title: 'Design Class Diagram',
    scenario: 'Scenario 2',
    purpose: 'Convert domain ideas into implementation-ready classes and methods.',
    build: [
      'Start from DMD classes and add visibility (+, -, #).',
      'Add typed attributes and method signatures.',
      'Model inheritance, association, aggregation, and composition explicitly.',
    ],
    connection: 'SD message labels should call real DCD methods.',
    color: 'text-blue-800',
    border: 'border-blue-200/60',
    badge: 'bg-blue-100',
  },
  {
    id: 'sd',
    abbr: 'SD',
    title: 'Sequence Diagram',
    scenario: 'Scenario 2',
    purpose: 'Show internal object collaboration in exact time order.',
    build: [
      'Pick one use case flow (e.g., createEvent + RSVP).',
      'Add lifelines for actor and internal objects.',
      'Number messages top-to-bottom and include returns.',
    ],
    connection: 'SD is the internal detailed version of SSD operations.',
    color: 'text-violet-800',
    border: 'border-violet-200/60',
    badge: 'bg-violet-100',
  },
  {
    id: 'ssd',
    abbr: 'SSD',
    title: 'System Sequence Diagram',
    scenario: 'Scenario 3',
    purpose: 'Show actor-to-system interactions while treating system as a black box.',
    build: [
      'Use one actor and one system lifeline.',
      'Write actor inputs: login(), viewProfile(), selectEvent().',
      'Write system outputs: authenticated(), profile(...), eventDetails(...).',
    ],
    connection: 'Each SSD operation should be realizable by SD flows and DCD methods.',
    color: 'text-orange-800',
    border: 'border-orange-200/60',
    badge: 'bg-orange-100',
  },
]

const quickChecks = [
  'Required 5 diagrams are present: UCD, DMD, DCD, SD, SSD.',
  'Required mapping is respected: SD -> Scenario 2, SSD -> Scenario 3, DCD -> Scenario 2.',
  'UCD covers Scenarios 1, 2, 3.',
  'DMD is based on CampusConnect context only (no methods).',
  'Diagram names and operations stay internally consistent.',
]

function Slide({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="snap-start min-h-screen px-6 md:px-12 py-16 md:py-20 flex items-center relative z-10 w-full max-w-7xl mx-auto">
      <div className="w-full">{children}</div>
    </section>
  )
}

function DotNav() {
  const items = [
    { id: 'start', label: 'Start' },
    { id: 'scenarios', label: 'Scenarios' },
    { id: 'cards', label: 'Diagram Cards' },
    { id: 'flow', label: 'Connections' },
    { id: 'practice', label: 'Practice' },
  ]

  return (
    <div className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
      {items.map(item => (
        <a
          key={item.id}
          href={`#${item.id}`}
          title={item.label}
          className="w-3.5 h-3.5 rounded-full border-2 border-gt-navy/20 bg-white shadow-sm hover:scale-125 hover:border-gt-techgold hover:bg-gt-techgold transition-all duration-300"
        />
      ))}
    </div>
  )
}

function DiagramCard({ diagram }: { diagram: DiagramSlide }) {
  return (
    <article
      id={diagram.id}
      className={`snap-start shrink-0 w-[88vw] md:w-[520px] rounded-[32px] border ${diagram.border} bg-white/70 backdrop-blur-xl p-8 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300`}
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${diagram.badge} ${diagram.color} shadow-sm`}>
          {diagram.abbr}
        </span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{diagram.scenario}</span>
      </div>
      <h3 className={`text-4xl font-black ${diagram.color} tracking-tight`}>{diagram.title}</h3>
      <p className="text-[16px] font-medium text-gray-600 mt-4 leading-relaxed">{diagram.purpose}</p>

      <div className="mt-8">
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">3-Step Build</p>
        <ol className="space-y-4 text-[15px] text-gray-700 font-medium">
          {diagram.build.map((step, idx) => (
            <li key={step} className="flex gap-4 items-start">
              <span className={`w-7 h-7 shrink-0 rounded-full text-[12px] font-black flex items-center justify-center mt-0.5 shadow-sm ${diagram.badge} ${diagram.color}`}>
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={`mt-8 rounded-2xl border ${diagram.border} ${diagram.badge} bg-opacity-50 p-5 text-[15px] font-medium`}>
        <span className="font-black uppercase tracking-widest text-[10px] opacity-60 block mb-1.5">Connects to others</span>
        <span className={diagram.color}>{diagram.connection}</span>
      </div>
    </article>
  )
}

export default function LearnPage() {
  return (
    <main className="h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-[#f8fafc] text-gt-navy selection:bg-gt-techgold/30 scroll-smooth">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gt-techgold/20 blur-[130px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gt-navy/10 blur-[160px] pointer-events-none z-0"></div>
      
      <DotNav />

      <div className="relative z-10 w-full">
        <Slide id="start">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div className="relative">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-gray-200/60 shadow-sm text-gt-navy font-black text-[11px] tracking-widest uppercase mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-gt-techgold animate-pulse"></span>
                CS 2340 • CampusConnect
              </div>
              <h1 className="text-6xl md:text-[80px] font-black text-transparent bg-clip-text bg-gradient-to-br from-gt-navy via-slate-800 to-gt-navy/60 leading-[1.05] tracking-tight -ml-1">
                UML in <br /> Slide Mode.
              </h1>
              <p className="mt-6 text-xl text-gray-500 max-w-xl leading-relaxed font-medium">
                Master UML at your own pace! Explore bite-sized cards and interactive, scroll-snapping lessons designed to help you confidently build the <span className="text-gt-navy font-bold">perfect architecture</span>.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#cards" className="group px-7 py-4 rounded-2xl bg-gt-navy text-white font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-3 text-lg">
                  <span>Start Slides</span>
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </a>
                <Link href="/" className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-gt-techgold to-[#fcdb73] text-gt-navy font-black hover:to-gt-techgold hover:from-[#fcdb73] transition-all shadow-lg shadow-gt-techgold/20 hover:shadow-[0_8px_25px_rgba(234,170,0,0.4)] hover:-translate-y-1 flex items-center gap-3 text-lg border border-[#ffeaa7]">
                  <span>Open Sandbox</span>
                  <span className="text-xl group-hover:scale-110 group-hover:-rotate-12 transition-transform">✍️</span>
                </Link>
              </div>
            </div>

            <div className="rounded-[40px] border border-white/50 bg-white/60 backdrop-blur-2xl p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] relative overflow-hidden transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gt-techgold/10 rounded-bl-full -mr-10 -mt-10 blur-3xl"></div>
              <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 mb-6 relative z-10 flex items-center gap-2">
                <span className="w-full h-px bg-gray-200 block"></span>
                <span className="shrink-0">What You Need to Submit</span>
                <span className="w-full h-px bg-gray-200 block"></span>
              </p>
              <ul className="space-y-4 text-[15px] text-gt-navy font-bold relative z-10">
                <li className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-0.5 transition-transform">
                  <span className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 font-black flex items-center justify-center shrink-0">1</span>
                  <span>Public website URL</span>
                </li>
                <li className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-0.5 transition-transform">
                  <span className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 font-black flex items-center justify-center shrink-0">2</span>
                  <span>GitHub repo URL</span>
                </li>
                <li className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-0.5 transition-transform">
                  <span className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 font-black flex items-center justify-center shrink-0">3</span>
                  <span>Video walkthrough URL</span>
                </li>
                <li className="flex gap-4 items-center bg-emerald-50 p-4 rounded-2xl shadow-sm border border-emerald-100 hover:-translate-y-0.5 transition-transform">
                  <span className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">✓</span>
                  <span className="text-emerald-950">All 5 required diagrams</span>
                </li>
              </ul>
            </div>
          </div>
        </Slide>

        <Slide id="scenarios">
          <div className="rounded-[48px] border border-white/60 bg-white/70 backdrop-blur-2xl p-10 md:p-16 shadow-[0_8px_40px_rgb(0,0,0,0.05)] w-full relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gt-navy/5 rounded-full blur-3xl -z-10"></div>
            <h2 className="text-5xl md:text-6xl font-black text-gt-navy tracking-tight">3 Scenarios <span className="text-transparent bg-clip-text bg-gradient-to-r from-gt-techgold to-orange-400">Made Simple.</span></h2>
            <p className="mt-4 text-xl font-medium text-gray-500">Swipe horizontally to explore these core scenarios and understand exactly what you need to build.</p>

            <div className="mt-12 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 px-2 -mx-2 hide-scrollbar">
              <article className="snap-start shrink-0 w-[85vw] md:w-[440px] rounded-[32px] border border-emerald-200/60 bg-gradient-to-b from-white to-emerald-50/60 p-10 shadow-sm hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-8 shadow-sm">🤝</div>
                <p className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Scenario 1</p>
                <h3 className="text-3xl font-black text-emerald-950 mt-2 tracking-tight">Jordan joins AI Club</h3>
                <p className="mt-4 text-[16px] font-medium text-emerald-900/70 leading-relaxed">Jordan logs in, searches org, submits membership request; Maya approves; system confirms.</p>
                <div className="mt-8 pt-6 border-t border-emerald-200/60">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wilder">Primary diagrams: UCD + DMD context</p>
                </div>
              </article>

              <article className="snap-start shrink-0 w-[85vw] md:w-[440px] rounded-[32px] border border-blue-200/60 bg-gradient-to-b from-white to-blue-50/60 p-10 shadow-sm hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-8 shadow-sm">📅</div>
                <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">Scenario 2</p>
                <h3 className="text-3xl font-black text-blue-950 mt-2 tracking-tight">Daniel creates an event</h3>
                <p className="mt-4 text-[16px] font-medium text-blue-900/70 leading-relaxed">Officer creates workshop, students RSVP, event fills, cancellation re-opens capacity instantly.</p>
                <div className="mt-8 pt-6 border-t border-blue-200/60">
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wilder">Required diagrams: DCD + SD</p>
                </div>
              </article>

              <article className="snap-start shrink-0 w-[85vw] md:w-[440px] rounded-[32px] border border-orange-200/60 bg-gradient-to-b from-white to-orange-50/60 p-10 shadow-sm hover:shadow-[0_8px_30px_rgba(249,115,22,0.1)] hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-8 shadow-sm">🔍</div>
                <p className="text-[11px] font-black uppercase tracking-widest text-orange-600">Scenario 3</p>
                <h3 className="text-3xl font-black text-orange-950 mt-2 tracking-tight">Priya views events</h3>
                <p className="mt-4 text-[16px] font-medium text-orange-900/70 leading-relaxed">Priya logs in, sees organizations and upcoming events, opens event details with live counts.</p>
                <div className="mt-8 pt-6 border-t border-orange-200/60">
                  <p className="text-xs font-bold text-orange-800 uppercase tracking-wilder">Required diagram: SSD</p>
                </div>
              </article>
            </div>
          </div>
        </Slide>

        <Slide id="cards">
          <div className="w-full">
            <div className="flex items-end justify-between gap-6 flex-wrap mb-10 pl-2">
              <div>
                <h2 className="text-5xl md:text-6xl font-black text-gt-navy tracking-tight">Diagram <span className="text-transparent bg-clip-text bg-gradient-to-r from-gt-techgold to-[#f5c642]">Cards.</span></h2>
                <p className="mt-4 text-xl font-medium text-gray-500">Scroll sideways to discover the purpose and structure of each diagram type.</p>
              </div>
              <a href="#flow" className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm text-sm font-bold text-gt-navy hover:shadow-md hover:-translate-y-1 transition-all">
                <span>Next: Flow</span>
                <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </a>
            </div>

            <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-10 px-2 -mx-2 hide-scrollbar">
              {diagrams.map(diagram => (
                <DiagramCard key={diagram.id} diagram={diagram} />
              ))}
            </div>
          </div>
        </Slide>

        <Slide id="flow">
          <div className="rounded-[48px] border border-white/60 bg-white/70 backdrop-blur-2xl p-10 md:p-16 shadow-[0_8px_40px_rgb(0,0,0,0.05)] w-full">
            <div className="max-w-4xl">
              <h2 className="text-5xl md:text-6xl font-black text-gt-navy tracking-tight">Seamless Consistency</h2>
              <p className="mt-4 text-xl font-medium text-gray-500">Follow these simple rules so your diagrams always work perfectly together.</p>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-5">
              {[
                { abbr: 'UCD', desc: 'Actors + goals', tone: 'bg-emerald-50 text-emerald-800 border-emerald-200/60', icon: '👤' },
                { abbr: 'DMD', desc: 'Domain concepts', tone: 'bg-teal-50 text-teal-800 border-teal-200/60', icon: '🧊' },
                { abbr: 'DCD', desc: 'Classes + methods', tone: 'bg-blue-50 text-blue-800 border-blue-200/60', icon: '⚙️' },
                { abbr: 'SD', desc: 'Internal messages', tone: 'bg-violet-50 text-violet-800 border-violet-200/60', icon: '⏱️' },
                { abbr: 'SSD', desc: 'Actor-system contract', tone: 'bg-orange-50 text-orange-800 border-orange-200/60', icon: '📦' },
              ].map((item, i) => (
                <div key={item.abbr} className={`relative rounded-[24px] p-8 text-center border shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 ${item.tone}`}>
                  {i < 4 && <div className="hidden md:block absolute top-1/2 -right-2.5 w-5 h-5 rounded-full bg-white border border-gray-200 z-10 shadow-sm" />}
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <p className="text-4xl font-black tracking-tight">{item.abbr}</p>
                  <p className="text-[11px] font-bold mt-3 opacity-70 uppercase tracking-widest">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[32px] bg-gradient-to-br from-gt-navy to-slate-900 p-8 md:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gt-techgold/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
              <p className="text-[16px] text-gray-300 leading-relaxed font-medium relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <span className="shrink-0 w-12 h-12 rounded-2xl bg-gt-techgold/20 flex items-center justify-center text-gt-techgold font-black text-xl border border-gt-techgold/30">!</span>
                <span><strong className="text-white">Rule of thumb:</strong> If you add a new operation in SSD or UCD, make sure it appears exactly as a method in your DCD and exactly as a numbered message in your SD. Keep the naming identical to pass consistency checks.</span>
              </p>
            </div>
          </div>
        </Slide>

        <Slide id="practice">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-stretch pb-24 h-full">
            <div className="rounded-[40px] border border-emerald-200/60 bg-gradient-to-br from-white to-emerald-50/60 p-10 md:p-14 shadow-sm hover:shadow-lg transition-shadow duration-500 h-full relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-300/20 rounded-tl-full blur-3xl -mr-10 -mb-10 z-0"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] tracking-widest uppercase mb-8 shadow-sm">
                  Checklist
                </div>
                <h2 className="text-5xl font-black text-emerald-950 tracking-tight leading-tight">Submission<br/>Ready?</h2>
                <p className="mt-4 text-lg font-medium text-emerald-900/70">Final checks before you record your demo.</p>
                
                <ul className="mt-10 space-y-4">
                  {quickChecks.map((item, i) => (
                    <li key={i} className="flex gap-4 items-start bg-white/80 backdrop-blur p-4 rounded-2xl border border-emerald-100 shadow-sm hover:translate-x-1 transition-transform">
                      <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs mt-0.5 font-bold shadow-md shadow-emerald-500/30">✓</span>
                      <span className="text-[15px] font-medium text-emerald-950 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-[40px] border border-white/60 bg-white/70 backdrop-blur-2xl p-10 md:p-14 shadow-[0_8px_40px_rgb(0,0,0,0.06)] h-full flex flex-col justify-center relative overflow-hidden hover:shadow-[0_8px_50px_rgb(0,0,0,0.1)] transition-shadow duration-500">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gt-techgold/20 rounded-bl-full blur-3xl -mr-20 -mt-20 z-0 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-5xl md:text-6xl font-black text-gt-navy tracking-tight leading-[1.1]">Time to <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gt-techgold to-orange-400">Build.</span></h3>
                <p className="mt-6 text-xl font-medium text-gray-500 leading-relaxed max-w-sm">
                  Open the collaborative canvas, load each required scenario from the left panel, and screen record your walkthrough. You're ready.
                </p>
                <div className="mt-12 flex flex-col sm:flex-row gap-5">
                  <Link href="/" className="group px-8 py-5 rounded-2xl bg-gradient-to-r from-gt-techgold to-[#fcdb73] text-gt-navy font-black hover:to-gt-techgold hover:from-[#fcdb73] transition-all shadow-lg shadow-gt-techgold/20 hover:shadow-[0_8px_30px_rgba(234,170,0,0.4)] hover:-translate-y-1.5 flex items-center justify-center gap-3 text-lg border border-[#ffeaa7]">
                    <span>Open Sandbox</span>
                    <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-xl block">🚀</span>
                  </Link>
                  <a href="#start" className="group px-8 py-5 rounded-2xl bg-white border border-gray-200 text-gt-navy font-bold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 text-lg flex items-center justify-center gap-2">
                    <span>Back to Top</span>
                    <span className="group-hover:-translate-y-1 transition-transform">↑</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Slide>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </main>
  )
}
