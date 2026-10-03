import React from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Trophy,
  Map,
  Volume2,
  VolumeX,
  Flame,
  Star,
  Zap,
  Crosshair,
  Shield,
  Activity
} from 'lucide-react';
import blockBlastLogoV2 from '../assets/images/block_blast_logo_v2_1789042540416.jpg';
import ticTacGoLogo from '../assets/images/tic_tac_go_logo_1789104573917.jpg';
import { soundManager } from '../audio';

interface StartScreenProps {
  key?: React.Key;
  highScore: number;
  currentLevel: number;
  totalStars: number;
  isMuted: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  onToggleMute: () => void;
  onTapToPlay: () => void;
  onOpenLevelMap: () => void;
  onOpenTicTacGo: () => void;
  onSetDifficulty: (d: 'easy' | 'medium' | 'hard') => void;
}

export default function StartScreen({
  highScore,
  currentLevel,
  totalStars,
  isMuted,
  difficulty,
  onToggleMute,
  onTapToPlay,
  onOpenLevelMap,
  onOpenTicTacGo,
  onSetDifficulty
}: StartScreenProps) {
  const handlePlayClick = () => {
    soundManager.playLevelClick();
    onTapToPlay();
  };

  const handleMapClick = () => {
    soundManager.playLevelClick();
    onOpenLevelMap();
  };

  const handleSelectDifficulty = (level: 'easy' | 'medium' | 'hard') => {
    soundManager.playLevelClick();
    onSetDifficulty(level);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-screen flex flex-col items-center justify-center select-none px-3 sm:px-4 py-4 relative overflow-hidden bg-slate-950 text-slate-100"
    >
      {/* Precision Tactical Grid & Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Console Frame */}
      <div className="w-full max-w-sm relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl p-5 overflow-hidden">
        {/* Decorative corner crosshairs */}
        <div className="absolute top-2 left-2 text-slate-600 pointer-events-none">
          <Crosshair className="w-3.5 h-3.5 opacity-60" />
        </div>
        <div className="absolute top-2 right-2 text-slate-600 pointer-events-none">
          <Crosshair className="w-3.5 h-3.5 opacity-60" />
        </div>

        {/* Top Telemetry Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/90 relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-[11px] font-semibold text-slate-300 font-mono tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LEVEL {String(currentLevel).padStart(3, '0')}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-[11px] font-semibold text-amber-400 font-mono">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{totalStars}</span>
            </div>
          </div>

          <button
            onClick={onToggleMute}
            className="w-8 h-8 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>

        {/* Tactical Logo & Identity */}
        <div className="flex flex-col items-center justify-center my-4 relative">
          <div className="relative p-1.5 rounded-xl bg-slate-950 border border-slate-700/60 shadow-lg group">
            <img
              src={blockBlastLogoV2}
              alt="Block Blast"
              className="w-36 h-36 object-contain rounded-lg shadow-inner"
            />
          </div>

          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
              <Shield className="w-3 h-3" />
              <span>TACTICAL GRID SYSTEM</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase font-sans">
              BLOCK BLAST <span className="text-cyan-400">PRO</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Spatial logic • High-order line elimination
            </p>
          </div>
        </div>

        {/* Performance Metric / High Score Terminal */}
        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/90 text-left">
          <div className="flex flex-col justify-center pl-1">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider flex items-center gap-1 uppercase">
              <Trophy className="w-3 h-3 text-amber-400 inline" /> Record Score
            </span>
            <span className="text-lg font-black font-mono tracking-tight text-white mt-0.5">
              {highScore.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col justify-center pl-2 border-l border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider flex items-center gap-1 uppercase">
              <Activity className="w-3 h-3 text-cyan-400 inline" /> Campaign
            </span>
            <span className="text-xs font-semibold text-slate-300 mt-1">
              Level {currentLevel} <span className="text-slate-400 font-normal">/ 150</span>
            </span>
          </div>
        </div>

        {/* Tactical Difficulty Selector */}
        <div className="my-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase mb-1.5 px-0.5">
            <span>Protocol Mode</span>
            <span className="text-cyan-400 font-semibold">{difficulty.toUpperCase()}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800">
            {(['easy', 'medium', 'hard'] as const).map((lvl) => {
              const active = difficulty === lvl;
              const labels = {
                easy: 'CASUAL',
                medium: 'STANDARD',
                hard: 'EXPERT'
              };
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleSelectDifficulty(lvl)}
                  className={`py-1.5 text-[11px] font-bold tracking-wider rounded-md font-mono transition-all ${
                    active
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {labels[lvl]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Command Button (START MISSION / PLAY NOW) */}
        <div className="my-3">
          <button
            id="start-game-btn"
            onClick={handlePlayClick}
            type="button"
            className="w-full group relative py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-base tracking-wider uppercase transition-all duration-150 active:scale-[0.98] shadow-lg shadow-cyan-950/50 border border-cyan-400/30 flex items-center justify-center gap-2 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <Play className="w-4 h-4 fill-white text-white" />
            <span>START GAME</span>
          </button>
        </div>

        {/* Secondary Navigation Modes */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800/80">
          <button
            onClick={handleMapClick}
            type="button"
            className="py-2.5 px-3 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[11px]">LEVEL MAP</span>
          </button>

          <button
            onClick={onOpenTicTacGo}
            type="button"
            className="py-2.5 px-3 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <img src={ticTacGoLogo} alt="Tic Tac Go" className="w-3.5 h-3.5 rounded-sm object-cover" />
            <span className="font-mono text-[11px]">TIC TAC GO</span>
          </button>
        </div>

        {/* Footer Status */}
        <div className="mt-3 pt-2 text-center border-t border-slate-900 text-[10px] font-mono text-slate-400 tracking-wider">
          CORE ENGINE SYNCHRONIZED • 150 LEVELS LOADED
        </div>
      </div>
    </motion.div>
  );
}

