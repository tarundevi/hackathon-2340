"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SCENARIOS, ScenarioKey } from '@/lib/scenarios';
import { useGraphStore } from '@/lib/store/graphStore';
import { DiagramType } from '@/types/graph';
import { awareness } from '@/lib/ydoc';

type Collaborator = {
  clientId: number;
  name: string;
  color: string;
}

const COLORS = ['#EAAA00', '#262262', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

interface LeftPanelProps {
  onToggle?: () => void;
}

// Map each scenario key to the diagram tab it should open
const SCENARIO_DIAGRAM_MAP: Partial<Record<ScenarioKey, DiagramType>> = {
  ucd_all: 'ucd',
  dmd_campus: 'dmd',
  dcd_daniel: 'dcd',
  jordan: 'dcd',
  daniel: 'dcd',
  priya: 'dcd',
  sd_daniel: 'sd',
  ssd_priya: 'ssd',
};

export default function LeftPanel({ onToggle }: LeftPanelProps) {
  const loadScenario = useGraphStore(state => state.loadScenario);
  const activeScenario = useGraphStore(state => state.activeScenario);
  const setActiveScenario = useGraphStore(state => state.setActiveScenario);
  const setActiveDiagram = useGraphStore(state => state.setActiveDiagram);
  const entities = useGraphStore(state => state.entities);

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [search, setSearch] = useState('');

  const filteredEntities = Object.values(entities).filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const kindLabel: Record<string, string> = { class: 'DCD', domain: 'DMD', actor: 'UCD/SSD', usecase: 'UCD', lifeline: 'SD/SSD', comment: 'All' };
  const kindColor: Record<string, string> = { class: 'bg-blue-100 text-blue-800', domain: 'bg-teal-100 text-teal-800', actor: 'bg-emerald-100 text-emerald-800', usecase: 'bg-emerald-100 text-emerald-800', lifeline: 'bg-purple-100 text-purple-800', comment: 'bg-gray-100 text-gray-700' };

  useEffect(() => {
    const myColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const myName = localStorage.getItem('uml-username') || `User ${Math.floor(Math.random() * 1000)}`;
    awareness.setLocalStateField('user', { name: myName, color: myColor });

    const updatePresence = () => {
      const states = Array.from(awareness.getStates().entries());
      const users = states
        .filter(([_, state]) => state?.user)
        .map(([clientId, state]) => ({
          clientId,
          name: state.user.name,
          color: state.user.color,
        }));
      setCollaborators(users);
    };

    awareness.on('change', updatePresence);
    updatePresence();

    return () => {
      awareness.off('change', updatePresence);
    };
  }, []);

  const handleLoad = (key: ScenarioKey) => {
    if (confirm(`Load "${SCENARIOS[key].name}"? This will replace your current canvas.`)) {
      loadScenario(SCENARIOS[key] as any);
      setActiveScenario(key);
      const targetDiagram = SCENARIO_DIAGRAM_MAP[key];
      if (targetDiagram) setActiveDiagram(targetDiagram);
    }
  };

  return (
    <div className="w-72 bg-white border-r border-gt-gold/15 flex flex-col h-full z-20 relative">
      <div className="p-6 border-b border-gt-gold/20 bg-gt-navy text-white flex items-center justify-between">
        <div>
          <h1 className="font-black text-2xl tracking-tight flex items-center gap-2">
            🏛️ <span className="text-gt-techgold">UML</span>
          </h1>
          <p className="text-xs text-gt-gold/70 mt-2 font-bold tracking-widest uppercase">Georgia Tech CS2340</p>
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            title="Hide panel"
            className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition-all duration-300 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-1 flex-shrink-0 ml-2"
          >
            ◀
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
        {/* Learn Link */}
        <Link
          href="/learn"
          className="flex items-center gap-2 px-4 py-3 rounded-md bg-gt-techgold/20 border-2 border-gt-techgold text-gt-navy font-bold text-sm hover:bg-gt-techgold/30 transition-all"
        >
          📚 <span>Learn UML Diagrams</span>
        </Link>

        <div>
          <h2 className="text-[10px] font-black text-gt-navy mb-3 uppercase tracking-widest flex items-center gap-2 opacity-80">
            ▣ CampusConnect Scenarios
          </h2>
          <p className="text-[10px] text-gt-navy/50 mb-3 leading-relaxed">Loading a scenario auto-switches the active diagram tab.</p>
          <div className="flex flex-col gap-2">
            {/* Blank */}
            {(['blank'] as ScenarioKey[]).map(key => (
              <button key={key} onClick={() => handleLoad(key)}
                className={`text-left text-xs px-3 py-2 rounded-md transition-all font-semibold border duration-200 active:scale-95 ${activeScenario === key ? 'border-gt-techgold bg-gt-techgold/15 text-gt-navy' : 'border-gray-200 text-gt-navy/60 hover:text-gt-navy hover:bg-gt-navy/5'}`}>
                {SCENARIOS[key].name}
              </button>
            ))}

            {/* UCD */}
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">UCD</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {(['ucd_all'] as ScenarioKey[]).map(key => (
              <button key={key} onClick={() => handleLoad(key)}
                className={`text-left text-xs px-3 py-2 rounded-md transition-all font-semibold border duration-200 active:scale-95 ${activeScenario === key ? 'border-gt-techgold bg-gt-techgold/15 text-gt-navy' : 'border-gray-200 text-gt-navy/60 hover:text-gt-navy hover:bg-gt-navy/5'}`}>
                {SCENARIOS[key].name}
              </button>
            ))}

            {/* DMD */}
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">DMD</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {(['dmd_campus'] as ScenarioKey[]).map(key => (
              <button key={key} onClick={() => handleLoad(key)}
                className={`text-left text-xs px-3 py-2 rounded-md transition-all font-semibold border duration-200 active:scale-95 ${activeScenario === key ? 'border-gt-techgold bg-gt-techgold/15 text-gt-navy' : 'border-gray-200 text-gt-navy/60 hover:text-gt-navy hover:bg-gt-navy/5'}`}>
                {SCENARIOS[key].name}
              </button>
            ))}

            {/* DCD */}
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">DCD</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {(['dcd_daniel', 'jordan', 'daniel', 'priya'] as ScenarioKey[]).map(key => (
              <button key={key} onClick={() => handleLoad(key)}
                className={`text-left text-xs px-3 py-2 rounded-md transition-all font-semibold border duration-200 active:scale-95 ${activeScenario === key ? 'border-gt-techgold bg-gt-techgold/15 text-gt-navy' : 'border-gray-200 text-gt-navy/60 hover:text-gt-navy hover:bg-gt-navy/5'}`}>
                {SCENARIOS[key].name}
              </button>
            ))}

            {/* SD */}
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">SD</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {(['sd_daniel'] as ScenarioKey[]).map(key => (
              <button key={key} onClick={() => handleLoad(key)}
                className={`text-left text-xs px-3 py-2 rounded-md transition-all font-semibold border duration-200 active:scale-95 ${activeScenario === key ? 'border-gt-techgold bg-gt-techgold/15 text-gt-navy' : 'border-gray-200 text-gt-navy/60 hover:text-gt-navy hover:bg-gt-navy/5'}`}>
                {SCENARIOS[key].name}
              </button>
            ))}

            {/* SSD */}
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded">SSD</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {(['ssd_priya'] as ScenarioKey[]).map(key => (
              <button key={key} onClick={() => handleLoad(key)}
                className={`text-left text-xs px-3 py-2 rounded-md transition-all font-semibold border duration-200 active:scale-95 ${activeScenario === key ? 'border-gt-techgold bg-gt-techgold/15 text-gt-navy' : 'border-gray-200 text-gt-navy/60 hover:text-gt-navy hover:bg-gt-navy/5'}`}>
                {SCENARIOS[key].name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[10px] font-black text-gt-navy mb-3 uppercase tracking-widest flex items-center gap-2 opacity-80">
            🔍 Search Nodes
          </h2>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full text-sm px-3 py-2 rounded-md border border-gt-navy/10 bg-gt-navy/5 text-gt-navy/80 placeholder:text-gt-navy/40 focus:outline-none focus:ring-2 focus:ring-gt-navy/20 mb-2"
          />
          {search && (
            <ul className="flex flex-col gap-1 max-h-48 overflow-y-auto">
              {filteredEntities.length === 0 ? (
                <li className="text-xs text-gt-navy/40 px-2 py-1.5">No matches</li>
              ) : (
                filteredEntities.map(e => (
                  <li key={e.id} className="flex items-center justify-between gap-2 text-sm text-gt-navy/70 font-semibold bg-gt-navy/5 px-3 py-2 rounded-md border border-gt-navy/10">
                    <span className="truncate">{e.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${kindColor[e.kind] ?? 'bg-gray-100 text-gray-700'}`}>
                      {kindLabel[e.kind] ?? e.kind}
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div>
           <h2 className="text-[10px] font-black text-gt-navy mb-3 uppercase tracking-widest flex items-center gap-2 opacity-80">
             👥 Collaborators
             <span className="bg-gt-navy text-gt-gold px-2.5 py-1 rounded-full text-[9px] ml-auto font-bold">{collaborators.length}</span>
           </h2>
           <ul className="flex flex-col gap-2">
             {collaborators.map(c => (
               <li key={c.clientId} className="flex items-center gap-3 text-sm text-gt-navy/70 font-semibold bg-gt-navy/5 px-3 py-2.5 rounded-md border border-gt-navy/10 hover:bg-gt-navy/10 transition-all">
                 <div className="w-3 h-3 rounded-full shadow-md ring-2 ring-white" style={{ backgroundColor: c.color }}></div>
                 <span className="truncate text-sm">{c.name}</span>
                 {c.clientId === awareness.clientID && <span className="text-gt-gold text-[9px] font-bold ml-auto uppercase tracking-wider">(You)</span>}
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>
  );
}
