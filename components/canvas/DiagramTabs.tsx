"use client"

import { useGraphStore } from '@/lib/store/graphStore';
import { DiagramType } from '@/types/graph';

export default function DiagramTabs() {
  const activeDiagram = useGraphStore(state => state.activeDiagram);
  const setActiveDiagram = useGraphStore(state => state.setActiveDiagram);

  const tabs: { id: DiagramType; label: string }[] = [
    { id: 'ucd', label: 'Use Case Diagram' },
    { id: 'dcd', label: 'Class Diagram' },
    { id: 'sd', label: 'Sequence Diagram' },
  ];

  return (
    <div className="flex border-b border-gray-200 bg-white pt-2 px-2 shadow-sm z-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-6 py-2.5 mx-1 mb-[-1px] text-sm font-semibold rounded-t-lg transition-all duration-200 border border-b-0 ${
            activeDiagram === tab.id
              ? 'bg-white border-gray-200 text-gt-navy shadow-[0_-2px_0_0_#EAAA00]'
              : 'bg-gray-50 border-transparent text-gray-500 hover:text-gt-navy hover:bg-gray-100'
          }`}
          onClick={() => setActiveDiagram(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
