"use client"

interface RelationshipTypeSelectorProps {
  position: { x: number; y: number };
  diagramType: 'ucd' | 'dcd' | 'sd';
  onSelect: (kind: string) => void;
  onCancel: () => void;
}

const DCD_TYPES = [
  { kind: 'association', label: 'Association', symbol: '—' },
  { kind: 'aggregation', label: 'Aggregation', symbol: '◇—' },
  { kind: 'composition', label: 'Composition', symbol: '◆—' },
  { kind: 'inheritance', label: 'Inheritance', symbol: '△—' },
];

const UCD_TYPES = [
  { kind: 'association', label: 'Association', symbol: '—' },
  { kind: 'extends', label: 'Extends', symbol: '‹‹extend››' },
  { kind: 'includes', label: 'Includes', symbol: '‹‹include››' },
];

const SD_TYPES = [
  { kind: 'message', label: 'Message', symbol: '→' },
];

export default function RelationshipTypeSelector({ position, diagramType, onSelect, onCancel }: RelationshipTypeSelectorProps) {
  const types = diagramType === 'dcd' ? DCD_TYPES : diagramType === 'ucd' ? UCD_TYPES : SD_TYPES;

  return (
    <div
      className="absolute z-50 bg-white border-2 border-gt-navy rounded-lg shadow-xl p-2 min-w-[160px]"
      style={{ left: position.x - 80, top: position.y - 10 }}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-[10px] font-bold text-gt-navy/50 uppercase tracking-wider px-1 pb-1 mb-1 border-b border-gray-100">
        Relationship Type
      </p>
      {types.map(t => (
        <button
          key={t.kind}
          onClick={() => onSelect(t.kind)}
          className="w-full text-left px-2 py-1.5 rounded text-sm text-gt-navy font-medium hover:bg-gt-navy/5 transition-colors flex items-center justify-between gap-2"
        >
          <span>{t.label}</span>
          <span className="text-xs text-gt-navy/40 font-mono">{t.symbol}</span>
        </button>
      ))}
      <button
        onClick={onCancel}
        className="w-full mt-1 text-center text-xs text-gray-400 hover:text-gray-600 py-1"
      >
        Cancel
      </button>
    </div>
  );
}
