import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GridCell, BlockShape, FloatingText } from '../types';
import BlockCell from './BlockCell';

interface GameBoardProps {
  grid: GridCell[][];
  gridRef: React.RefObject<HTMLDivElement | null>;
  ghostPreview: {
    startRow: number;
    startCol: number;
    shape: BlockShape;
    isValid: boolean;
  } | null;
  floatingTexts: FloatingText[];
  onCellClick: (row: number, col: number) => void;
}

export default function GameBoard({
  grid,
  gridRef,
  ghostPreview,
  floatingTexts,
  onCellClick
}: GameBoardProps) {
  // Check if a cell is part of the ghost preview
  const getGhostCell = (r: number, c: number) => {
    if (!ghostPreview) return null;
    const { startRow, startCol, shape, isValid } = ghostPreview;
    const relR = r - startRow;
    const relC = c - startCol;

    if (
      relR >= 0 &&
      relR < shape.matrix.length &&
      relC >= 0 &&
      relC < shape.matrix[0].length &&
      shape.matrix[relR][relC] === 1
    ) {
      return {
        color: shape.color,
        isValid
      };
    }
    return null;
  };

  return (
    <div className="relative w-full max-w-md aspect-square select-none">
      {/* Outer border / frame */}
      <div
        ref={gridRef}
        className="w-full h-full p-3 rounded-3xl bg-slate-900/90 border-2 border-slate-800 shadow-2xl shadow-blue-950/40 grid grid-cols-8 grid-rows-8 gap-1.5 touch-none"
        style={{
          boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.6), 0 10px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const ghost = getGhostCell(r, c);

            return (
              <div
                key={`${r}-${c}`}
                data-row={r}
                data-col={c}
                onClick={() => onCellClick(r, c)}
                className="relative rounded-lg bg-slate-800/40 border-2 border-yellow-500 flex items-center justify-center overflow-hidden cursor-pointer transition-colors duration-100 hover:border-yellow-400"
              >
                {/* Empty cell dot hint */}
                {!cell.filled && !ghost && (
                  <div className="w-3 h-3 rounded-lg bg-slate-900 border border-slate-700/50 pointer-events-none" />
                )}

                {/* Filled block cell */}
                {cell.filled && (
                  <BlockCell
                    color={cell.color}
                    isClearing={cell.isClearing}
                  />
                )}

                {/* Ghost preview block */}
                {!cell.filled && ghost && (
                  <BlockCell
                    color={ghost.color}
                    isGhost={true}
                    isInvalidGhost={!ghost.isValid}
                  />
                )}

                {/* If cell is filled and ghost overlaps, show collision warning */}
                {cell.filled && ghost && (
                  <div className="absolute inset-0 bg-rose-500/50 rounded-lg border-2 border-rose-400 animate-pulse" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating score / combo animations */}
      <AnimatePresence>
        {floatingTexts.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 0, scale: 0.7 }}
            animate={{ opacity: 1, y: -45, scale: 1.15 }}
            exit={{ opacity: 0, y: -70, scale: 0.9 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className={`absolute pointer-events-none font-black text-lg md:text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-30 ${
              item.color || 'text-yellow-300'
            }`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
