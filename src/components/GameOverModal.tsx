import { motion } from 'motion/react';
import { RotateCcw, Trophy, Award, Flame, Map } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  totalLinesCleared: number;
  maxCombo: number;
  level?: number;
  targetScore?: number;
  onRestart: () => void;
  onGoToMap?: () => void;
}

export default function GameOverModal({
  score,
  highScore,
  isNewHighScore,
  totalLinesCleared,
  maxCombo,
  level,
  targetScore,
  onRestart,
  onGoToMap
}: GameOverModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700/80 p-6 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-blue-500/20 blur-2xl rounded-full pointer-events-none" />

        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-3">
          <Award className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          {level ? `Level ${level} Failed` : 'No More Moves!'}
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Remaining blocks couldn't fit on the grid.
        </p>

        {/* Score display card */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 mb-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Final Score</span>
            <div className="text-2xl font-black text-white tracking-tight">
              {score.toLocaleString()}
            </div>
          </div>

          {targetScore !== undefined && (
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold border-t border-slate-800/80 pt-2 mt-2">
              <span>Target to Pass</span>
              <span>{targetScore.toLocaleString()} PTS</span>
            </div>
          )}

          {isNewHighScore && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black animate-pulse">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>NEW HIGH SCORE!</span>
            </div>
          )}
        </div>

        {/* Extra stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 text-left">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/30">
            <span className="text-[11px] text-slate-400 font-medium">Lines Cleared</span>
            <div className="text-lg font-black text-blue-300">{totalLinesCleared}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Max Combo</span>
            </div>
            <div className="text-lg font-black text-amber-300">{maxCombo}x</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            id="play-again-btn"
            onClick={onRestart}
            className="w-full py-3.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/40 active:scale-98 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>

          {onGoToMap && (
            <button
              onClick={onGoToMap}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Map className="w-4 h-4 text-cyan-400" />
              <span>RETURN TO LEVEL MAP</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
