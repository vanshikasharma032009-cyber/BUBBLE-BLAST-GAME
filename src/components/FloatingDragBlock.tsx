import { BlockShape } from '../types';
import BlockCell from './BlockCell';

interface FloatingDragBlockProps {
  shape: BlockShape;
  x: number;
  y: number;
  cellSize: number;
}

export default function FloatingDragBlock({
  shape,
  x,
  y,
  cellSize
}: FloatingDragBlockProps) {
  const rows = shape.matrix.length;
  const cols = shape.matrix[0].length;
  const gap = 6;
  const totalWidth = cols * cellSize + (cols - 1) * gap;
  const totalHeight = rows * cellSize + (rows - 1) * gap;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-none"
      style={{
        left: x - totalWidth / 2,
        top: y - totalHeight / 2,
        width: totalWidth,
        height: totalHeight
      }}
    >
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gap: `${gap}px`
        }}
      >
        {shape.matrix.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className="w-full h-full">
              {cell === 1 ? (
                <div className="w-full h-full drop-shadow-2xl scale-105">
                  <BlockCell color={shape.color} />
                </div>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
