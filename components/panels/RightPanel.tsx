"use client"

import { useState } from 'react';
import { useGraphStore } from '@/lib/store/graphStore';
import { validateDiagramsWithAI, getErrorCount, getWarningCount } from '@/lib/validation';

export default function RightPanel() {
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
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-20 relative">
      <div className="flex bg-gray-50/80 border-b border-gray-200 p-1">
        <button
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${tab === 'ai' ? 'bg-white text-gt-navy shadow-sm' : 'text-gray-500 hover:text-gt-navy'}`}
          onClick={() => setTab('ai')}
        >
          AI TA Check
        </button>
        <button
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${tab === 'traceability' ? 'bg-white text-gt-navy shadow-sm' : 'text-gray-500 hover:text-gt-navy'}`}
          onClick={() => setTab('traceability')}
        >
          Traceability
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'ai' ? (
          <div className="flex flex-col gap-5">
            <button
              onClick={runAICheck}
              disabled={isLoading}
              className="w-full bg-gt-techgold hover:bg-[#d49a00] text-gt-navy font-bold py-3 px-4 rounded-xl shadow-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
                <div className="text-center p-8 bg-gray-50 border border-gray-100 rounded-xl mt-4">
                  <div className="text-3xl mb-2">🤖</div>
                  <h3 className="text-sm font-semibold text-gray-900">AI Assistant Ready</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Run a check to identify logic errors and inconsistencies across your diagrams.</p>
                </div>
              )}
              {validationResults.map((flag, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-xl border text-sm shadow-sm ${
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
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">
              Entity Diagram Membership
            </div>
            {Object.values(entities).length === 0 ? (
              <div className="text-sm text-gray-500">No entities loaded</div>
            ) : (
              Object.values(entities).map(entity => (
                <div
                  key={entity.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-xs"
                >
                  <div className="font-semibold text-gray-900 mb-2">{entity.name}</div>
                  <div className="flex flex-wrap gap-1">
                    {entity.kind === 'class' && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">DCD</span>
                    )}
                    {(entity.kind === 'actor' || entity.kind === 'usecase') && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">UCD</span>
                    )}
                    {entity.kind === 'lifeline' && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">SD</span>
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
