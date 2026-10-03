import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Play, Map, RotateCcw, Trophy, Sparkles, FastForward } from 'lucide-react';
import { soundManager } from '../audio';

interface LevelSuccessModalProps {
  level: number;
  score: number;
  targetScore: number;
  stars: number;
  onNextLevel: () => void;
  onGoToMap: () => void;
  onReplay: () => void;
  onContinue?: () => void;
}

export default function LevelSuccessModal({
  level,
  score,
  targetScore,
  stars,
  onNextLevel,
  onGoToMap,
  onReplay,
  onContinue
}: LevelSuccessModalProps) {
  useEffect(() => {
    soundManager.playLevelComplete();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-emerald-500/40 p-6 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Glowing aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-28 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Victory Icon */}
        <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
          <Trophy className="w-8 h-8 fill-slate-950 text-slate-950" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold mb-1">
          <Sparkles className="w-3 h-3" />
          <span>LEVEL {level} CLEARED!</span>
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight mb-3">
          Awesome Blast!
        </h2>

        {/* Star Rating Animation */}
        <div className="flex items-center justify-center gap-3 my-4">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= stars;
            return (
              <motion.div
                key={starIndex}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: isEarned ? 1.15 : 0.9, rotate: 0 }}
                transition={{ delay: 0.2 + starIndex * 0.15, type: 'spring' }}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center ${
                  isEarned
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-xl shadow-amber-500/40'
                    : 'bg-slate-950/50 border-slate-800 text-slate-700'
                }`}
              >
                <Star
                  className={`w-8 h-8 ${
                    isEarned ? 'fill-amber-400 text-amber-400 drop-shadow-md' : 'text-slate-700'
                  }`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Score Breakdown Card */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-5 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400 font-semibold uppercase">Your Score</span>
            <span className="text-xl font-black text-white font-mono">{score.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold border-t border-slate-800/80 pt-1.5">
            <span>Target Score</span>
            <span className="font-mono">{targetScore.toLocaleString()} PTS (PASSED)</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          {level < 150 ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-98 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>NEXT LEVEL {level + 1}</span>
            </button>
          ) : (
            <div className="py-2 text-sm font-bold text-amber-300">
              🎉 Congratulations! You reached the pinnacle Level 150!
            </div>
          )}

          {onContinue && (
            <button
              onClick={onContinue}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
            >
              <FastForward className="w-3.5 h-3.5 text-emerald-400" />
              <span>CONTINUE CURRENT BOARD (PLAY MORE)</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onGoToMap}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Map className="w-3.5 h-3.5 text-blue-400" />
              <span>Level Map</span>
            </button>
            <button
              onClick={onReplay}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Replay</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
