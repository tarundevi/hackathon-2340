"use client"

import { useGraphStore } from '@/lib/store/graphStore';
import { DiagramType } from '@/types/graph';

export default function DiagramTabs() {
  const activeDiagram = useGraphStore(state => state.activeDiagram);
  const setActiveDiagram = useGraphStore(state => state.setActiveDiagram);

  const tabs: { id: DiagramType; label: string; abbr: string }[] = [
    { id: 'ucd', label: 'Use Case Diagram', abbr: 'UCD' },
    { id: 'dmd', label: 'Domain Model', abbr: 'DMD' },
    { id: 'dcd', label: 'Design Class Diagram', abbr: 'DCD' },
    { id: 'sd', label: 'Sequence Diagram', abbr: 'SD' },
    { id: 'ssd', label: 'System Sequence Diagram', abbr: 'SSD' },
  ];

  return (
    <div className="flex border-b border-gt-gold/20 bg-white pt-3 px-3 z-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          title={tab.label}
          className={`px-4 py-3 mx-0.5 mb-[-1px] text-sm font-bold rounded-t-md transition-all duration-300 border-b-2 ${
            activeDiagram === tab.id
              ? 'bg-white border-gt-techgold text-gt-navy'
              : 'bg-transparent border-transparent text-gt-navy/50 hover:text-gt-navy hover:bg-gt-navy/5'
          }`}
          onClick={() => setActiveDiagram(tab.id)}
        >
          <span className="hidden xl:inline">{tab.label}</span>
          <span className="xl:hidden">{tab.abbr}</span>
        </button>
      ))}
    </div>
  );
}
