import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, Flame, Trophy, Sliders, Map, Star, Sparkles } from 'lucide-react';
import { soundManager } from '../audio';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  combo: number;
  isMuted: boolean;
  currentLevel: number;
  targetScore: number;
  onToggleSound: () => void;
  onRestart: () => void;
  onOpenTuner?: () => void;
  onOpenMap?: () => void;
}

export default function ScoreBoard({
  score,
  highScore,
  combo,
  isMuted,
  currentLevel,
  targetScore,
  onToggleSound,
  onRestart,
  onOpenTuner,
  onOpenMap
}: ScoreBoardProps) {
  const progressPercent = Math.min(Math.round((score / targetScore) * 100), 100);

  return (
    <header className="w-full max-w-md flex flex-col gap-2.5 mb-3 select-none">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onOpenMap && (
            <button
              onClick={onOpenMap}
              title="Return to Level Map"
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 text-xs font-bold text-cyan-400 active:scale-95 shadow-sm cursor-pointer"
            >
              <Map className="w-3.5 h-3.5" />
              <span>MAP</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-wide bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-sky-300 to-indigo-400">
                LEVEL {currentLevel}
              </span>
              <span className="text-[10px] font-bold text-slate-400">/ 150</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-0.5">
              Target: <span className="text-amber-300 font-bold">{targetScore.toLocaleString()} PTS</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenTuner && (
            <button
              id="open-tuner-btn"
              onClick={onOpenTuner}
              aria-label="Open tuner & loading screen"
              title="Calibrate & tune sounds"
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            id="restart-game-btn"
            onClick={onRestart}
            aria-label="Restart game"
            title="Restart level"
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Level Progress Bar */}
      <div className="w-full bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-inner">
        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
          <span className="flex items-center gap-1 text-slate-300">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>Target Goal: {targetScore.toLocaleString()} PTS</span>
          </span>
          <span className="text-cyan-300 font-mono">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Current Score */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/60 p-2.5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <span>Score</span>
            {combo > 1 && (
              <div className="flex items-center gap-1 text-amber-400 font-black animate-bounce text-[10px]">
                <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{combo}x</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-black text-white tracking-tight mt-0.5">
            {score.toLocaleString()}
          </div>
        </div>

        {/* High Score */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/60 p-2.5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
            <Trophy className="w-3 h-3" />
            <span>High Score</span>
          </div>
          <div className="text-2xl font-black text-amber-300 tracking-tight mt-0.5">
            {highScore.toLocaleString()}
          </div>
        </div>
      </div>
    </header>
  );
}
