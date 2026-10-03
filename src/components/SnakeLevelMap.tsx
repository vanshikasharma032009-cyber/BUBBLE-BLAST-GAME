import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Lock, 
  Play, 
  Trophy, 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Compass, 
  Gift, 
  Crown,
  ChevronRight,
  Flame
} from 'lucide-react';
import { soundManager } from '../audio';

interface SnakeLevelMapProps {
  key?: React.Key;
  unlockedLevel: number;
  levelStars: Record<number, number>; // levelNumber -> stars (0 to 3)
  onSelectLevel: (level: number) => void;
  onBackToLoading: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

const TOTAL_LEVELS = 150;
const ROW_HEIGHT = 94; // px vertical distance between each level node
const VIEW_WIDTH = 380; // virtual svg coordinate width

export function getLevelTargetScore(level: number): number {
  // Balanced progression: Level 1 starts at 300, escalates smoothly
  if (level <= 5) return 200 + level * 100;
  if (level <= 20) return 600 + (level - 5) * 120;
  if (level <= 50) return 2400 + (level - 20) * 140;
  if (level <= 100) return 6600 + (level - 50) * 160;
  return 14600 + (level - 100) * 180;
}

interface Realm {
  name: string;
  range: [number, number];
  color: string;
  accent: string;
  badge: string;
  bgGradient: string;
}

const REALMS: Realm[] = [
  { name: 'Crystal Realm', range: [1, 30], color: 'text-cyan-400', accent: '#06b6d4', badge: '💎', bgGradient: 'from-cyan-500/20 to-blue-500/20' },
  { name: 'Emerald Grove', range: [31, 60], color: 'text-emerald-400', accent: '#10b981', badge: '🌿', bgGradient: 'from-emerald-500/20 to-teal-500/20' },
  { name: 'Amethyst Peaks', range: [61, 90], color: 'text-purple-400', accent: '#a855f7', badge: '🔮', bgGradient: 'from-purple-500/20 to-pink-500/20' },
  { name: 'Topaz Dunes', range: [91, 120], color: 'text-amber-400', accent: '#f59e0b', badge: '⚡', bgGradient: 'from-amber-500/20 to-orange-500/20' },
  { name: 'Cosmic Summit', range: [121, 150], color: 'text-rose-400', accent: '#f43f5e', badge: '🌌', bgGradient: 'from-rose-500/20 to-fuchsia-500/20' }
];

export function getRealmForLevel(lvl: number): Realm {
  for (const realm of REALMS) {
    if (lvl >= realm.range[0] && lvl <= realm.range[1]) return realm;
  }
  return REALMS[0];
}

export default function SnakeLevelMap({
  unlockedLevel,
  levelStars,
  onSelectLevel,
  onBackToLoading,
  isMuted,
  onToggleSound
}: SnakeLevelMapProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Calculate coordinates for all 150 levels along a snake wave
  const levelPositions = React.useMemo(() => {
    const list = [];
    for (let lvl = 1; lvl <= TOTAL_LEVELS; lvl++) {
      // Y goes from top to bottom
      const y = (lvl - 1) * ROW_HEIGHT + 70;
      // Continuous sinusoidal winding snake path: swings between ~80px and ~300px
      const x = VIEW_WIDTH / 2 + 110 * Math.sin((lvl - 1) * 0.52);
      list.push({ level: lvl, x, y });
    }
    return list;
  }, []);

  const totalMapHeight = TOTAL_LEVELS * ROW_HEIGHT + 140;

  // Auto-scroll to current unlocked level on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToLevel(unlockedLevel);
    }, 350);
    return () => clearTimeout(timer);
  }, [unlockedLevel]);

  const scrollToLevel = (lvl: number) => {
    const targetNode = nodeRefs.current.get(lvl);
    if (targetNode && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const nodeTop = targetNode.offsetTop;
      const targetScroll = nodeTop - container.clientHeight / 2 + 40;
      container.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
    }
  };

  // Total stars calculated
  const totalStars = Object.values(levelStars).reduce((acc, stars) => acc + stars, 0);
  const maxPossibleStars = TOTAL_LEVELS * 3;

  const handleNodeClick = (lvl: number) => {
    if (lvl <= unlockedLevel) {
      soundManager.playLevelClick();
      setSelectedLevel(lvl);
    }
  };

  const handleStartLevel = (lvl: number) => {
    soundManager.playLevelClick();
    setSelectedLevel(null);
    onSelectLevel(lvl);
  };

  return (
    <div className="w-full max-w-md h-screen flex flex-col bg-slate-950 text-white relative select-none overflow-hidden">
      {/* Dynamic Background Starfield / Lights */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      {/* Sticky Top Header */}
      <header className="shrink-0 z-30 p-3 bg-slate-900/95 border-b border-slate-800/90 shadow-xl backdrop-blur-md flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToLoading}
              aria-label="Back to loading / intro"
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-wide bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-400">
                  LEVEL MAP
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10px] font-bold text-blue-300">
                  1 - 150
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Current: <span className="text-white font-bold">Level {unlockedLevel}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stars pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 shadow-inner">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-black font-mono tracking-tight">{totalStars}</span>
              <span className="text-[10px] text-amber-400/60 font-mono">/{maxPossibleStars}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Quick Realm Jump Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {REALMS.map((realm) => {
            const isInside = unlockedLevel >= realm.range[0] && unlockedLevel <= realm.range[1];
            return (
              <button
                key={realm.name}
                onClick={() => scrollToLevel(realm.range[0])}
                className={`shrink-0 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all active:scale-95 border ${
                  isInside
                    ? 'bg-blue-600/30 border-blue-400/70 text-white shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{realm.badge}</span>
                <span>{realm.range[0]}-{realm.range[1]}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Snake Road Scroll Canvas */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative scroll-smooth p-2"
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className="relative mx-auto"
          style={{ width: `${VIEW_WIDTH}px`, height: `${totalMapHeight}px` }}
        >
          {/* SVG Snake Trail connecting all 150 level nodes */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${VIEW_WIDTH} ${totalMapHeight}`}
            fill="none"
          >
            <defs>
              <linearGradient id="clearedSnakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="30%" stopColor="#818cf8" />
                <stop offset="70%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting curve paths */}
            {levelPositions.map((pos, idx) => {
              if (idx === levelPositions.length - 1) return null;
              const nextPos = levelPositions[idx + 1];
              const isClearedSegment = pos.level < unlockedLevel;
              const isCurrentSegment = pos.level === unlockedLevel;

              const pathData = `M ${pos.x} ${pos.y} C ${pos.x} ${(pos.y + nextPos.y) / 2}, ${nextPos.x} ${(pos.y + nextPos.y) / 2}, ${nextPos.x} ${nextPos.y}`;

              return (
                <g key={`path-${pos.level}`}>
                  {/* Outer glow aura for unlocked path */}
                  {(isClearedSegment || isCurrentSegment) && (
                    <path
                      d={pathData}
                      stroke={isClearedSegment ? '#38bdf8' : '#818cf8'}
                      strokeWidth="10"
                      strokeOpacity="0.25"
                      strokeLinecap="round"
                      filter="url(#glowEffect)"
                    />
                  )}

                  {/* Main snake line */}
                  <path
                    d={pathData}
                    stroke={
                      isClearedSegment
                        ? 'url(#clearedSnakeGrad)'
                        : isCurrentSegment
                        ? '#60a5fa'
                        : '#334155'
                    }
                    strokeWidth={isClearedSegment || isCurrentSegment ? 6 : 4}
                    strokeDasharray={isClearedSegment ? 'none' : '6 6'}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </svg>

          {/* Render Realm Banner Markers on the Snake trail */}
          {REALMS.map((realm) => {
            const startPos = levelPositions[realm.range[0] - 1];
            if (!startPos) return null;
            return (
              <div
                key={`banner-${realm.name}`}
                className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none"
                style={{ top: `${startPos.y - 48}px` }}
              >
                <div className={`px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5 ${realm.color}`}>
                  <span>{realm.badge}</span>
                  <span>{realm.name}</span>
                  <span className="text-slate-500 font-mono text-[10px]">({realm.range[0]}-{realm.range[1]})</span>
                </div>
              </div>
            );
          })}

          {/* 150 Level Nodes */}
          {levelPositions.map(({ level, x, y }) => {
            const isCurrent = level === unlockedLevel;
            const isCompleted = level < unlockedLevel;
            const isLocked = level > unlockedLevel;
            const stars = levelStars[level] || 0;
            const isMilestone = level % 10 === 0 || level === 150;
            const realm = getRealmForLevel(level);

            return (
              <div
                key={`node-${level}`}
                ref={(el) => {
                  if (el) nodeRefs.current.set(level, el);
                }}
                onClick={() => handleNodeClick(level)}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute z-20 flex flex-col items-center cursor-pointer group ${
                  isLocked ? 'cursor-not-allowed opacity-75' : ''
                }`}
              >
                {/* Active Player Pin Marker ("YOU") */}
                {isCurrent && (
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-11 z-30 flex flex-col items-center pointer-events-none"
                  >
                    <div className="px-2.5 py-0.5 rounded-full bg-linear-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[10px] shadow-lg flex items-center gap-1 border border-yellow-200">
                      <Flame className="w-3 h-3 fill-slate-950" />
                      <span>YOU</span>
                    </div>
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-amber-400" />
                  </motion.div>
                )}

                {/* Level Circle Button */}
                <div className="relative flex items-center justify-center">
                  {/* Current Level Pulsing Ring */}
                  {isCurrent && (
                    <span className="absolute -inset-2.5 rounded-full bg-cyan-400/40 animate-ping pointer-events-none" />
                  )}

                  <div
                    className={`rounded-full flex items-center justify-center transition-all duration-200 ${
                      isMilestone ? 'w-15 h-15' : 'w-12 h-12'
                    } ${
                      isCompleted
                        ? 'bg-linear-to-tr from-blue-600 via-indigo-600 to-cyan-500 border-2 border-cyan-300 shadow-lg shadow-blue-500/30'
                        : isCurrent
                        ? 'bg-linear-to-tr from-amber-500 via-orange-500 to-yellow-400 border-2 border-white shadow-xl shadow-amber-500/50 scale-110'
                        : 'bg-slate-900 border-2 border-slate-700/80 text-slate-500'
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-slate-500" />
                    ) : isMilestone ? (
                      <div className="flex flex-col items-center">
                        <Crown className={`w-3.5 h-3.5 ${isCurrent ? 'text-slate-950 fill-slate-950' : 'text-yellow-300'}`} />
                        <span className={`font-black text-xs ${isCurrent ? 'text-slate-950' : 'text-white'}`}>
                          {level}
                        </span>
                      </div>
                    ) : (
                      <span className={`font-black text-sm tracking-tight ${isCurrent ? 'text-slate-950 text-base' : 'text-white'}`}>
                        {level}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stars awarded under completed nodes */}
                {!isLocked && (
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-2.5 h-2.5 ${
                          starIdx <= stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-800 text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Quick Action Bar */}
      <footer className="shrink-0 p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-3 z-30 backdrop-blur-md">
        <button
          onClick={() => scrollToLevel(unlockedLevel)}
          className="flex-1 py-3 px-4 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-sm shadow-lg shadow-indigo-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>PLAY LEVEL {unlockedLevel}</span>
        </button>

        <button
          onClick={() => scrollToLevel(unlockedLevel)}
          title="Scroll to current level"
          className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-cyan-400 active:scale-95 shadow-md"
        >
          <Compass className="w-5 h-5" />
        </button>
      </footer>

      {/* Level Preview Modal */}
      <AnimatePresence>
        {selectedLevel !== null && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-xs rounded-3xl bg-slate-900 border-2 border-slate-700 p-6 text-center shadow-2xl relative overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-blue-500/20 blur-2xl rounded-full pointer-events-none" />

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold mb-2">
                <Sparkles className="w-3 h-3" />
                <span>{getRealmForLevel(selectedLevel).name}</span>
              </div>

              <h3 className="text-3xl font-black text-white tracking-tight mb-1">
                Level {selectedLevel}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Blast blocks to achieve the target score!
              </p>

              {/* Target Score Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 mb-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Score
                </span>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-yellow-200 to-amber-400 mt-0.5">
                  {getLevelTargetScore(selectedLevel).toLocaleString()} PTS
                </div>
              </div>

              {/* Stars preview */}
              <div className="flex items-center justify-center gap-2 mb-5">
                {[1, 2, 3].map((starIdx) => {
                  const hasStar = starIdx <= (levelStars[selectedLevel] || 0);
                  return (
                    <div
                      key={starIdx}
                      className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
                        hasStar
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/30'
                          : 'bg-slate-950/40 border-slate-800 text-slate-700'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${hasStar ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </div>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleStartLevel(selectedLevel)}
                  className="w-full py-3.5 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/40 active:scale-98 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>PLAY NOW</span>
                </button>

                <button
                  onClick={() => setSelectedLevel(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
