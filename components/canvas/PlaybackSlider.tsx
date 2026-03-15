"use client"

import { useState, useEffect } from 'react';
import { useGraphStore } from '@/lib/store/graphStore';

export default function PlaybackSlider() {
  const activeDiagram = useGraphStore(state => state.activeDiagram);
  const relationships = useGraphStore(state => state.relationships);

  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get messages ordered by sequenceIndex
  const messages = Object.values(relationships)
    .filter(rel => rel.kind === 'message')
    .sort((a, b) => (a.sequenceIndex || 0) - (b.sequenceIndex || 0));

  const maxIndex = messages.length;

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying || activeDiagram !== 'sd') return;

    const timer = setTimeout(() => {
      setPlaybackIndex(prev => prev < maxIndex ? prev + 1 : maxIndex);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isPlaying, playbackIndex, maxIndex, activeDiagram]);

  // Only show in SD diagram
  if (activeDiagram !== 'sd') {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-gray-200 flex items-center gap-3 max-w-md">
      {/* Play/Pause */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-gt-navy hover:bg-[#1a1744] text-white px-3 py-2 rounded-lg font-semibold transition-all"
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max={maxIndex}
        value={playbackIndex}
        onChange={(e) => {
          setPlaybackIndex(parseInt(e.target.value));
          setIsPlaying(false);
        }}
        className="flex-1 h-2 bg-gray-200 rounded-lg cursor-pointer appearance-none"
        style={{
          background: `linear-gradient(to right, #262262 0%, #262262 ${(playbackIndex / maxIndex) * 100}%, #e5e7eb ${(playbackIndex / maxIndex) * 100}%, #e5e7eb 100%)`
        }}
      />

      {/* Counter */}
      <span className="text-sm font-semibold text-gt-navy min-w-[60px] text-right">
        {playbackIndex} / {maxIndex}
      </span>

      {/* Reset */}
      <button
        onClick={() => {
          setPlaybackIndex(0);
          setIsPlaying(false);
        }}
        className="bg-gray-200 hover:bg-gray-300 text-gt-navy px-3 py-2 rounded-lg font-semibold transition-all"
      >
        ↻
      </button>
    </div>
  );
}
