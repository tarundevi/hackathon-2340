"use client"

import { useGraphStore } from '@/lib/store/graphStore';
import { SCENARIOS, ScenarioKey } from '@/lib/scenarios';

export default function TitleDisplay() {
  const activeScenario = useGraphStore(state => state.activeScenario);

  const title = activeScenario ? SCENARIOS[activeScenario as ScenarioKey]?.name : 'New Canvas';

  return (
    <div className="bg-white px-4 py-2 rounded-md border border-gray-200 flex items-center">
      <h2 className="text-gt-navy font-extrabold text-sm tracking-wide flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-gt-techgold"></span>
        {title}
      </h2>
    </div>
  );
}
