"use client"

import { useState } from 'react';
import { useGraphStore } from '@/lib/store/graphStore';
import { validateDiagramsWithAI, getErrorCount, getWarningCount } from '@/lib/validation';

interface RightPanelProps {
  onToggle?: () => void;
}

export default function RightPanel({ onToggle }: RightPanelProps) {
  const [tab, setTab] = useState<'ai' | 'traceability'>('ai');
  const [isLoading, setIsLoading] = useState(false);

  const entities = useGraphStore(state => state.entities);
  const validationResults = useGraphStore(state => state.validationResults);
  const setValidationResults = useGraphStore(state => state.setValidationResults);
  const store = useGraphStore();

  const runAICheck = async () => {
    setIsLoading(true);
    setValidationResults([]);
    try {
      const graphState = {
        entities: store.entities,
        relationships: store.relationships,
        positions: store.positions,
        activeDiagram: store.activeDiagram,
        activeScenario: store.activeScenario,
        validationResults: [],
        connectMode: store.connectMode,
      };

      const flags = await validateDiagramsWithAI(graphState);
      setValidationResults(flags);

      // Show summary
      const errorCount = getErrorCount(flags);
      const warningCount = getWarningCount(flags);
      if (flags.length === 0) {
        setValidationResults([{ severity: 'warning', message: 'Validation passed! No issues found.' }]);
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Unknown error';
      setValidationResults([{ severity: 'error', message: `Validation error: ${errorMsg}` }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-80 bg-white border-l border-gt-gold/15 flex flex-col h-full shadow-[-4px_0_24px_rgba(0,0,0,0.05)] z-20 relative">
      <div className="bg-white border-b border-gt-gold/15 p-1.5 gap-1 flex items-center">
        <button
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-300 ease-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-gt-navy/30 focus:ring-offset-1 ${tab === 'ai' ? 'bg-gt-navy text-gt-gold shadow hover:-translate-y-[1px]' : 'text-gt-navy/60 hover:text-gt-navy hover:bg-gt-navy/5 hover:-translate-y-[1px]'}`}
          onClick={() => setTab('ai')}
        >
          🤖 AI Check
        </button>
        <button
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-300 ease-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-gt-navy/30 focus:ring-offset-1 ${tab === 'traceability' ? 'bg-gt-navy text-gt-gold shadow hover:-translate-y-[1px]' : 'text-gt-navy/60 hover:text-gt-navy hover:bg-gt-navy/5 hover:-translate-y-[1px]'}`}
          onClick={() => setTab('traceability')}
        >
          🔗 Trace
        </button>
        {onToggle && (
          <button
            onClick={onToggle}
            title="Hide panel"
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gt-navy transition-all duration-300 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 flex-shrink-0"
          >
            ▶
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'ai' ? (
          <div className="flex flex-col gap-5">
            <button
              onClick={runAICheck}
              disabled={isLoading}
              className="w-full bg-gt-techgold hover:bg-[#e0a800] text-gt-navy font-bold py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out active:scale-95 hover:-translate-y-[2px] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gt-techgold/50 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gt-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running check...
                </>
              ) : 'Run AI Validation Check'}
            </button>

            <div className="flex flex-col gap-3">
              {validationResults.length === 0 && !isLoading && (
                <div className="text-center p-6 bg-gray-50 border border-gt-gold/30 rounded-md mt-4">
                  <div className="text-4xl mb-3">🤖</div>
                  <h3 className="text-sm font-bold text-gt-navy">AI Assistant Ready</h3>
                  <p className="text-xs text-gt-navy/60 mt-2 leading-relaxed font-medium">Run a check to identify logic errors and inconsistencies across your diagrams.</p>
                </div>
              )}
              {validationResults.map((flag, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-md border text-sm ${
                    flag.severity === 'error' ? 'bg-red-50/50 border-red-200 text-red-900' : 'bg-yellow-50/50 border-yellow-200 text-yellow-900'
                  }`}
                >
                  <div className="font-bold mb-2 flex items-center gap-2">
                    {flag.severity === 'error' ? <span className="bg-red-100 text-red-600 p-1 rounded-md text-xs">🚨 Error</span> : <span className="bg-yellow-100 text-yellow-600 p-1 rounded-md text-xs">⚠️ Warning</span>}
                  </div>
                  <div className="leading-relaxed text-gray-700">{flag.message}</div>
                  {flag.entityId && entities[flag.entityId] && (
                    <div className="mt-3 text-[11px] font-semibold text-gt-navy uppercase tracking-wider bg-white px-2 py-1 rounded inline-block border border-gray-200 shadow-sm">
                      Target: {entities[flag.entityId].name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs font-bold text-gt-navy/70 uppercase tracking-widest mb-4 opacity-80">
              Entity Diagram Membership
            </div>
            {Object.values(entities).length === 0 ? (
              <div className="text-sm text-gt-navy/50 italic">No entities loaded</div>
            ) : (
              Object.values(entities).map(entity => (
                <div
                  key={entity.id}
                  className="bg-gt-navy/5 rounded-md p-3 border border-gt-navy/15 text-xs hover:bg-gt-navy/8 transition-colors"
                >
                  <div className="font-bold text-gt-navy mb-2">{entity.name}</div>
                  <div className="flex flex-wrap gap-2">
                    {entity.kind === 'class' && (
                      <span className="bg-blue-100/70 text-blue-900 px-2.5 py-1 rounded-lg text-xs font-semibold">▭ DCD</span>
                    )}
                    {(entity.kind === 'actor' || entity.kind === 'usecase') && (
                      <span className="bg-emerald-100/70 text-emerald-900 px-2.5 py-1 rounded-lg text-xs font-semibold">◯ UCD</span>
                    )}
                    {entity.kind === 'lifeline' && (
                      <span className="bg-gray-200/70 text-gray-800 px-2.5 py-1 rounded-lg text-xs font-semibold">∥ SD</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
