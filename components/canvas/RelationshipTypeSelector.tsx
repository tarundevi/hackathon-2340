"use client"

interface RelationshipTypeSelectorProps {
  position: { x: number; y: number };
  diagramType: 'ucd' | 'dmd' | 'dcd' | 'sd' | 'ssd';
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
  const types = diagramType === 'dcd' || diagramType === 'dmd' ? DCD_TYPES : diagramType === 'ucd' ? UCD_TYPES : SD_TYPES;

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white border-2 border-gt-navy rounded-xl shadow-2xl px-4 py-3 flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-xs font-bold text-gt-navy uppercase tracking-wider whitespace-nowrap pr-2 border-r border-gt-navy/20">
        Relationship Type
      </span>
      {types.map(t => (
        <button
          key={t.kind}
          onClick={() => onSelect(t.kind)}
          className="px-3 py-1.5 rounded-lg text-sm text-gt-navy font-semibold border border-gt-navy/20 hover:bg-gt-navy hover:text-white transition-colors whitespace-nowrap"
        >
          {t.label}
        </button>
      ))}
      <button
        onClick={onCancel}
        className="ml-1 px-2 py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
