import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Sliders,
  Play,
  CheckCircle2,
  Music,
  Flame,
  Gamepad2
} from 'lucide-react';
import { soundManager } from '../audio';
import blockBlastLogoV1 from '../assets/images/block_blast_logo_v1_1789042521855.jpg';
import blockBlastLogoV2 from '../assets/images/block_blast_logo_v2_1789042540416.jpg';

interface LoadingScreenProps {
  key?: React.Key;
  onComplete?: () => void;
  autoAdvance?: boolean;
}

interface TuningStage {
  progress: number;
  label: string;
  subtext: string;
  toneName: string;
  icon: string;
}

const TUNING_STAGES: TuningStage[] = [
  {
    progress: 18,
    label: 'Energizing Gem Blocks',
    subtext: 'Generating vibrant 3D crystal cubes',
    toneName: '261Hz (C4)',
    icon: '💎'
  },
  {
    progress: 42,
    label: 'Loading 150 Snake Levels',
    subtext: 'Mapping journey from Level 1 to 150',
    toneName: '329Hz (E4)',
    icon: '🗺️'
  },
  {
    progress: 70,
    label: 'Synthesizing Blast Combos',
    subtext: 'Harmonic resonance & particle physics',
    toneName: '392Hz (G4)',
    icon: '⚡'
  },
  {
    progress: 88,
    label: 'Calibrating 8x8 Grid Detector',
    subtext: 'Instant line clear & star calculations',
    toneName: '493Hz (B4)',
    icon: '🧩'
  },
  {
    progress: 100,
    label: 'Ready to Blast!',
    subtext: 'Block engine synchronized & tuned',
    toneName: '587Hz (D5)',
    icon: '🔥'
  }
];

const GAME_TIPS = [
  'Tip: Clear consecutive rows to trigger massive Combo Blasts! 🔥',
  'Tip: Always leave room for the 3x3 big square block! 🧩',
  'Tip: Blast multiple rows & columns in one move for 3-star ratings! ⭐',
  'Tip: Tap the "New Blocks" button if you ever need a fresh set! 🔄',
  'Tip: Progress through the 150-level Snake Map to master every challenge! 🚀'
];

const CHIME_KEYS = [
  { note: 'C4', freq: 261.63, color: 'border-cyan-400 text-cyan-300 bg-cyan-500/10' },
  { note: 'E4', freq: 329.63, color: 'border-blue-400 text-blue-300 bg-blue-500/10' },
  { note: 'G4', freq: 392.00, color: 'border-purple-400 text-purple-300 bg-purple-500/10' },
  { note: 'B4', freq: 493.88, color: 'border-pink-400 text-pink-300 bg-pink-500/10' },
  { note: 'D5', freq: 587.33, color: 'border-amber-400 text-amber-300 bg-amber-500/10' }
];

export default function LoadingScreen({ onComplete, autoAdvance = true }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [showTuner, setShowTuner] = useState(false);
  const [activeTone, setActiveTone] = useState<string | null>(null);
  const [logoVersion, setLogoVersion] = useState<1 | 2>(1);

  const playedStagesRef = useRef<Set<number>>(new Set());
  const completedRef = useRef(false);

  // Rotate tips periodically
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % GAME_TIPS.length);
    }, 2000);
    return () => clearInterval(tipInterval);
  }, []);

  // Progressive loading simulation - exactly 4.0 seconds (4000ms) total duration
  useEffect(() => {
    if (!autoAdvance) return;

    const DURATION_MS = 4000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProg = Math.min(100, Math.floor((elapsed / DURATION_MS) * 100));
      setProgress(currentProg);

      // Determine current stage index based on exact progress
      let stageIdx = 0;
      for (let i = 0; i < TUNING_STAGES.length; i++) {
        if (currentProg >= TUNING_STAGES[i].progress) {
          stageIdx = i;
        }
      }
      setCurrentStageIndex(stageIdx);

      // Play audio tuning tone on each stage transition
      if (!playedStagesRef.current.has(stageIdx)) {
        playedStagesRef.current.add(stageIdx);
        soundManager.playTuneStep(stageIdx);
      }

      // When reached 4 seconds (100%)
      if (elapsed >= DURATION_MS) {
        clearInterval(interval);
        setProgress(100);
        if (!completedRef.current) {
          completedRef.current = true;
          soundManager.playLoadingFanfare();
          setTimeout(() => {
            onComplete?.();
          }, 400);
        }
      }
    }, 40);

    return () => clearInterval(interval);
  }, [autoAdvance, onComplete]);

  const handleManualComplete = () => {
    soundManager.playLoadingFanfare();
    onComplete?.();
  };

  const handlePlayKeyTone = (freq: number, note: string) => {
    setActiveTone(note);
    soundManager.playTuneTone(freq);
    setTimeout(() => setActiveTone(null), 300);
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const currentStage = TUNING_STAGES[currentStageIndex] || TUNING_STAGES[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md flex flex-col items-center select-none text-center px-4 py-4 sm:py-6"
    >
      {/* Block Blast Signature Arcade Container */}
      <div className="w-full relative rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-2xl p-5 sm:p-6 backdrop-blur-2xl overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/70 border border-cyan-500/30 text-[11px] font-bold text-cyan-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 inline" />
            <span>Block Blast v2.5</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
            <button
              onClick={() => setShowTuner(!showTuner)}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all active:scale-95 shadow-sm ${
                showTuner
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/40'
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/80 text-slate-300'
              }`}
              title="Toggle Audio Tuning Studio"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hero Block Blast 3D Game Logo */}
        <div className="relative flex flex-col items-center justify-center my-3">
          {/* Animated Glow Aura behind logo */}
          <div className="absolute w-44 h-44 rounded-3xl bg-linear-to-tr from-cyan-500/25 via-indigo-500/25 to-pink-500/25 blur-2xl pointer-events-none animate-pulse" />
          
          <motion.div
            animate={{
              y: [-4, 4, -4],
              rotate: [0, 1, -1, 0]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="relative p-2 rounded-3xl bg-slate-950/80 border-2 border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.3)] group"
          >
            {/* Glossy top reflection */}
            <div className="absolute inset-x-4 top-1 h-1 bg-linear-to-r from-transparent via-white/50 to-transparent rounded-full z-20 pointer-events-none" />

            {/* Block Blast Official Game Logo Image (Design 1 & Design 2) */}
            <img
              src={logoVersion === 1 ? blockBlastLogoV1 : blockBlastLogoV2}
              alt="Block Blast Game Logo"
              referrerPolicy="no-referrer"
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-2xl relative z-10 transition-all duration-200"
            />

            {/* Floating corner energy badges */}
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30 z-20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 z-20">
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
            </div>
          </motion.div>

          {/* Logo Design Switcher (1 or 2) */}
          <div className="mt-2.5 flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 px-1.5">Logo Style:</span>
            <button
              type="button"
              onClick={() => setLogoVersion(1)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                logoVersion === 1
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Neon Blast
            </button>
            <button
              type="button"
              onClick={() => setLogoVersion(2)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                logoVersion === 2
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Gem Emblem
            </button>
          </div>

          {/* Vibrant Title & Tagline */}
          <div className="mt-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              BLOCK <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-yellow-300 to-pink-500 font-extrabold">BLAST</span>
            </h1>
            <p className="text-xs text-slate-300 font-semibold tracking-wider uppercase mt-0.5 flex items-center justify-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400 inline" />
              <span>150 Snake Levels • Classic Puzzle</span>
              <Flame className="w-3.5 h-3.5 text-amber-400 inline" />
            </p>
          </div>
        </div>

        {/* 5 Bouncing Mini Gem Blocks */}
        <div className="flex items-center justify-center gap-2 my-2 py-1">
          {[
            { bg: 'bg-cyan-500', shadow: 'shadow-cyan-500/50' },
            { bg: 'bg-purple-500', shadow: 'shadow-purple-500/50' },
            { bg: 'bg-amber-400', shadow: 'shadow-amber-400/50' },
            { bg: 'bg-emerald-400', shadow: 'shadow-emerald-400/50' },
            { bg: 'bg-pink-500', shadow: 'shadow-pink-500/50' }
          ].map((gem, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.18,
                ease: 'easeInOut'
              }}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md ${gem.bg} border border-white/50 shadow-md ${gem.shadow}`}
            />
          ))}
        </div>

        {/* Progress & Tuning Stage Display */}
        <div className="mt-3 mb-2 px-1">
          <div className="flex items-center justify-between text-xs font-black mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-200">
              <span className="text-sm">{currentStage.icon}</span>
              <span>{currentStage.label}</span>
            </span>
            <span className="font-mono text-cyan-300 text-sm font-black tracking-wider">
              {progress}%
            </span>
          </div>

          {/* Glowing Animated Progress Bar */}
          <div className="w-full h-3.5 rounded-full bg-slate-950 border border-slate-700/80 p-0.5 relative overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-cyan-400 via-indigo-500 via-purple-500 to-pink-500 relative transition-all duration-150"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer light beam */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent animate-pulse" />
              {/* Glowing tip */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#38bdf8]" />
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-1.5">
            <span>{currentStage.subtext}</span>
            <span className="text-cyan-400 font-mono text-[10px] font-bold">{currentStage.toneName}</span>
          </div>
        </div>

        {/* Dynamic Game Tips Banner */}
        <div className="mt-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 min-h-[36px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="text-[11px] text-slate-300 font-semibold"
            >
              {GAME_TIPS[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Stage Milestones */}
        <div className="grid grid-cols-5 gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80">
          {TUNING_STAGES.map((stg, i) => {
            const isPassed = progress >= stg.progress;
            const isCurrent = currentStageIndex === i;
            return (
              <div
                key={i}
                className={`flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-md shadow-cyan-500/20 scale-105'
                    : isPassed
                    ? 'bg-slate-800/70 border-slate-700 text-slate-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-600'
                }`}
              >
                <span className="text-xs mb-0.5">{stg.icon}</span>
                <span className="text-[9px] font-bold font-mono">
                  {isPassed ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 inline" /> : `${stg.progress}%`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Interactive Soundboard / Chime Tuning Set (Preserved from user request) */}
        <AnimatePresence>
          {showTuner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-slate-800 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-pink-400" />
                  <span>Manual Chime Tuning</span>
                </span>
                <span className="text-[10px] text-slate-400">Tap note to test audio</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {CHIME_KEYS.map((k) => (
                  <button
                    key={k.note}
                    onClick={() => handlePlayKeyTone(k.freq, k.note)}
                    className={`h-10 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-90 ${k.color} ${
                      activeTone === k.note ? 'scale-95 brightness-150 ring-2 ring-white' : ''
                    }`}
                  >
                    <span className="text-[11px] font-black">{k.note}</span>
                    <span className="text-[8px] font-mono opacity-80">{Math.round(k.freq)}Hz</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Loading Status Bar (Tap to play is now on its own dedicated screen) */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <div>
              <p className="text-xs font-bold text-white tracking-wide">
                {progress >= 100 ? 'Starting Engine...' : 'Loading Block Blast...'}
              </p>
              <p className="text-[10px] text-slate-400">
                {progress >= 100 ? 'Get ready to blast lines!' : 'Preparing blocks & 150 levels'}
              </p>
            </div>
          </div>
          <button
            onClick={handleManualComplete}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-cyan-300 text-xs font-semibold active:scale-95 transition-all shadow-sm flex items-center gap-1"
          >
            <span>Skip</span>
            <span>››</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
