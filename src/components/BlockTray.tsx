import React from 'react';
import { RefreshCw } from 'lucide-react';
import { BlockShape } from '../types';
import BlockCell from './BlockCell';

interface BlockTrayProps {
  availableBlocks: (BlockShape | null)[];
  selectedBlockIndex: number | null;
  draggingIndex: number | null;
  onBlockPointerDown: (e: React.PointerEvent, index: number) => void;
  onBlockSelect: (index: number) => void;
  onReroll?: () => void;
}

export default function BlockTray({
  availableBlocks,
  selectedBlockIndex,
  draggingIndex,
  onBlockPointerDown,
  onBlockSelect,
  onReroll
}: BlockTrayProps) {
  return (
    <div className="w-full max-w-md mt-5 select-none">
      <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/80 border border-slate-800/80 rounded-3xl shadow-xl">
        {availableBlocks.map((block, index) => {
          if (!block) {
            return (
              <div
                key={`empty-${index}`}
                className="h-28 rounded-2xl border-2 border-dashed border-slate-800/50 flex items-center justify-center bg-slate-950/20"
              >
                <span className="w-2 h-2 rounded-full bg-slate-800/60" />
              </div>
            );
          }

          const isSelected = selectedBlockIndex === index;
          const isDragging = draggingIndex === index;

          // Calculate cell size in tray
          const maxDim = Math.max(block.matrix.length, block.matrix[0].length);
          const miniCellSize = maxDim <= 2 ? 26 : maxDim === 3 ? 20 : 16;
          const miniGap = 3;

          return (
            <div
              key={block.id}
              data-block-index={index}
              onPointerDown={(e) => onBlockPointerDown(e, index)}
              onClick={() => onBlockSelect(index)}
              className={`relative h-28 rounded-2xl flex flex-col items-center justify-center p-2 cursor-grab active:cursor-grabbing touch-none transition-all duration-150 ${
                isSelected
                  ? 'bg-slate-800/90 ring-2 ring-blue-400 scale-102 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/40 hover:border-slate-600'
              } ${isDragging ? 'opacity-25 scale-95' : 'opacity-100'}`}
              title="Drag onto board or tap to place"
            >
              {/* Block shape rendering */}
              <div
                className="grid"
                style={{
                  gridTemplateRows: `repeat(${block.matrix.length}, ${miniCellSize}px)`,
                  gridTemplateColumns: `repeat(${block.matrix[0].length}, ${miniCellSize}px)`,
                  gap: `${miniGap}px`
                }}
              >
                {block.matrix.map((row, r) =>
                  row.map((cell, c) => (
                    <div key={`${r}-${c}`} className="w-full h-full flex items-center justify-center">
                      {cell === 1 ? (
                        <BlockCell
                          color={block.color}
                          size={miniCellSize}
                          className="shadow-sm"
                        />
                      ) : (
                        <div style={{ width: miniCellSize, height: miniCellSize }} />
                      )}
                    </div>
                  ))
                )}
              </div>

              {isSelected && (
                <span className="absolute -bottom-1 text-[10px] font-bold text-blue-300 tracking-wider uppercase bg-slate-900/90 px-2 py-0.5 rounded-full border border-blue-500/40">
                  Ready
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between mt-2.5 px-1">
        <p className="text-xs text-slate-400 font-medium tracking-wide">
          👆 Drag to place & blast lines
        </p>
        {onReroll && (
          <button
            onClick={onReroll}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 text-xs font-semibold active:scale-95 transition-all shadow-sm"
            title="Get 3 new blocks"
          >
            <RefreshCw className="w-3 h-3" />
            <span>New Blocks</span>
          </button>
        )}
      </div>
    </div>
  );
}
