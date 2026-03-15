"use client"

import { useEffect, useState } from 'react';
import { SCENARIOS, ScenarioKey } from '@/lib/scenarios';
import { useGraphStore } from '@/lib/store/graphStore';
import { awareness } from '@/lib/ydoc';

type Collaborator = {
  clientId: number;
  name: string;
  color: string;
}

const COLORS = ['#EAAA00', '#262262', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function LeftPanel() {
  const loadScenario = useGraphStore(state => state.loadScenario);
  const activeScenario = useGraphStore(state => state.activeScenario);
  const setActiveScenario = useGraphStore(state => state.setActiveScenario);
  
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    // Set my own name randomly for now
    const myColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const myName = `User ${Math.floor(Math.random() * 1000)}`;
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
    if (confirm(`Load scenario ${SCENARIOS[key].name}? This will replace your current canvas.`)) {
      loadScenario(SCENARIOS[key] as any);
      setActiveScenario(key);
    }
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-20 relative">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-gt-navy to-[#1a1744] text-white">
        <h1 className="font-extrabold text-xl tracking-wide flex items-center gap-2">
          <span className="text-gt-techgold">GT</span> UML Collab
        </h1>
        <p className="text-xs text-gt-light/70 mt-1 font-medium tracking-wider uppercase">CS 2340 Fall</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-8">
        <div>
          <h2 className="text-[11px] font-bold text-gt-navy mb-4 uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-[2px] bg-gt-techgold rounded-full"></span>
            Scenarios
          </h2>
          <div className="flex flex-col gap-3">
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map(key => (
              <button
                key={key}
                onClick={() => handleLoad(key)}
                className={`text-left text-sm px-4 py-3.5 rounded-lg transition-all font-medium border duration-200 ${
                  activeScenario === key
                    ? 'border-gt-techgold bg-gt-techgold/10 text-gt-navy shadow-md'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gt-techgold/30 hover:shadow-sm'
                }`}
              >
                {SCENARIOS[key].name}
              </button>
            ))}
          </div>
        </div>

        <div>
           <h2 className="text-[11px] font-bold text-gt-navy mb-3 uppercase tracking-widest flex items-center gap-2">
             <span className="w-4 h-[2px] bg-gt-techgold rounded-full"></span>
             Collaborators 
             <span className="bg-gt-navy text-white px-2 py-0.5 rounded-full text-[10px] ml-1">{collaborators.length}</span>
           </h2>
           <ul className="flex flex-col gap-3">
             {collaborators.map(c => (
               <li key={c.clientId} className="flex items-center gap-3 text-sm text-gray-700 font-medium bg-gray-50 p-2 rounded-lg border border-gray-100">
                 <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: c.color }}></div>
                 <span className="truncate">{c.name} {c.clientId === awareness.clientID && <span className="text-gray-400 text-xs font-normal ml-1">(You)</span>}</span>
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>
  );
}
