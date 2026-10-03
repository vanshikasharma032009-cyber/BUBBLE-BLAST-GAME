import { BlockShape, CellColor } from './types';

export const COLOR_MAP: Record<CellColor, {
  bg: string;
  border: string;
  shadow: string;
  glow: string;
  gradient: string;
}> = {
  blue: {
    bg: 'bg-blue-500',
    border: 'border-blue-300',
    shadow: 'shadow-blue-500/50',
    glow: 'from-blue-400 to-blue-600',
    gradient: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)'
  },
  cyan: {
    bg: 'bg-cyan-500',
    border: 'border-cyan-300',
    shadow: 'shadow-cyan-500/50',
    glow: 'from-cyan-400 to-cyan-600',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)'
  },
  purple: {
    bg: 'bg-purple-500',
    border: 'border-purple-300',
    shadow: 'shadow-purple-500/50',
    glow: 'from-purple-400 to-purple-600',
    gradient: 'linear-gradient(135deg, #c084fc 0%, #7e22ce 100%)'
  },
  amber: {
    bg: 'bg-amber-500',
    border: 'border-amber-300',
    shadow: 'shadow-amber-500/50',
    glow: 'from-amber-400 to-amber-600',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)'
  },
  green: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-300',
    shadow: 'shadow-emerald-500/50',
    glow: 'from-emerald-400 to-emerald-600',
    gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)'
  },
  red: {
    bg: 'bg-rose-500',
    border: 'border-rose-300',
    shadow: 'shadow-rose-500/50',
    glow: 'from-rose-400 to-rose-600',
    gradient: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)'
  },
  pink: {
    bg: 'bg-pink-500',
    border: 'border-pink-300',
    shadow: 'shadow-pink-500/50',
    glow: 'from-pink-400 to-pink-600',
    gradient: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)'
  },
  yellow: {
    bg: 'bg-yellow-400',
    border: 'border-yellow-200',
    shadow: 'shadow-yellow-400/50',
    glow: 'from-yellow-300 to-yellow-500',
    gradient: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)'
  },
  golden: {
    bg: 'bg-amber-400',
    border: 'border-yellow-300',
    shadow: 'shadow-yellow-500/50',
    glow: 'from-yellow-200 to-amber-500',
    gradient: 'linear-gradient(135deg, #fde047 0%, #d97706 100%)'
  }
};

const BASE_SHAPES: Omit<BlockShape, 'id'>[] = [
  // 1x1 dot
  {
    name: 'dot',
    color: 'yellow',
    matrix: [[1]]
  },
  // 1x2 and 2x1
  {
    name: 'line-2-h',
    color: 'cyan',
    matrix: [[1, 1]]
  },
  {
    name: 'line-2-v',
    color: 'cyan',
    matrix: [[1], [1]]
  },
  // 1x3 and 3x1
  {
    name: 'line-3-h',
    color: 'blue',
    matrix: [[1, 1, 1]]
  },
  {
    name: 'line-3-v',
    color: 'blue',
    matrix: [[1], [1], [1]]
  },
  // 1x4 and 4x1
  {
    name: 'line-4-h',
    color: 'purple',
    matrix: [[1, 1, 1, 1]]
  },
  {
    name: 'line-4-v',
    color: 'purple',
    matrix: [[1], [1], [1], [1]]
  },
  // 1x5 and 5x1
  {
    name: 'line-5-h',
    color: 'blue',
    matrix: [[1, 1, 1, 1, 1]]
  },
  {
    name: 'line-5-v',
    color: 'blue',
    matrix: [[1], [1], [1], [1], [1]]
  },
  // 2x2 Square
  {
    name: 'square-2',
    color: 'amber',
    matrix: [
      [1, 1],
      [1, 1]
    ]
  },
  // 3x3 Square
  {
    name: 'square-3',
    color: 'red',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ]
  },
  // Corner 2x2 (3 blocks)
  {
    name: 'corner-2-tl',
    color: 'green',
    matrix: [
      [1, 1],
      [1, 0]
    ]
  },
  {
    name: 'corner-2-tr',
    color: 'green',
    matrix: [
      [1, 1],
      [0, 1]
    ]
  },
  {
    name: 'corner-2-bl',
    color: 'green',
    matrix: [
      [1, 0],
      [1, 1]
    ]
  },
  {
    name: 'corner-2-br',
    color: 'green',
    matrix: [
      [0, 1],
      [1, 1]
    ]
  },
  // L-Shapes 3x2 and 2x3
  {
    name: 'L-3x2-1',
    color: 'pink',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1]
    ]
  },
  {
    name: 'L-3x2-2',
    color: 'pink',
    matrix: [
      [0, 1],
      [0, 1],
      [1, 1]
    ]
  },
  {
    name: 'L-2x3-1',
    color: 'pink',
    matrix: [
      [1, 1, 1],
      [1, 0, 0]
    ]
  },
  {
    name: 'L-2x3-2',
    color: 'pink',
    matrix: [
      [1, 1, 1],
      [0, 0, 1]
    ]
  },
  // T-Shapes
  {
    name: 'T-up',
    color: 'purple',
    matrix: [
      [1, 1, 1],
      [0, 1, 0]
    ]
  },
  {
    name: 'T-down',
    color: 'purple',
    matrix: [
      [0, 1, 0],
      [1, 1, 1]
    ]
  },
  // Z and S shapes
  {
    name: 'Z-h',
    color: 'red',
    matrix: [
      [1, 1, 0],
      [0, 1, 1]
    ]
  },
  {
    name: 'S-h',
    color: 'green',
    matrix: [
      [0, 1, 1],
      [1, 1, 0]
    ]
  },
  // Added: U-shape
  {
    name: 'U-shape',
    color: 'purple',
    matrix: [
      [1, 0, 1],
      [1, 1, 1]
    ]
  },
  // Added: 2x2 Checker
  {
    name: 'checker-2',
    color: 'pink',
    matrix: [
      [1, 0],
      [0, 1]
    ]
  }
];

let counter = 0;

export const EASY_SHAPES = BASE_SHAPES.filter(s => s.name.includes('dot') || s.name.startsWith('line-2') || s.name.startsWith('square-2'));
export const MEDIUM_SHAPES = BASE_SHAPES.filter(s => !s.name.startsWith('line-5') && !s.name.startsWith('square-3'));
export const HARD_SHAPES = BASE_SHAPES;

export function generateRandomShape(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): BlockShape {
  const shapes = difficulty === 'easy' ? EASY_SHAPES : difficulty === 'hard' ? HARD_SHAPES : MEDIUM_SHAPES;
  const index = Math.floor(Math.random() * shapes.length);
  const base = shapes[index];
  counter++;
  
  // 10% chance to make the block golden
  const isGolden = Math.random() < 0.1;
  
  return {
    ...base,
    color: isGolden ? 'golden' : base.color,
    id: `${base.name}-${Date.now()}-${counter}`
  };
}

export function generateThreeShapes(grid?: { filled: boolean }[][], difficulty: 'easy' | 'medium' | 'hard' = 'medium'): BlockShape[] {
  const shapes = [generateRandomShape(difficulty), generateRandomShape(difficulty), generateRandomShape(difficulty)];
  if (!grid) return shapes;

  // Verify if at least one shape fits on the current grid
  const canAnyFit = shapes.some((s) => canShapeFit(s, grid, 8));
  if (canAnyFit) {
    return shapes;
  }

  // Find all candidate shapes from BASE_SHAPES that can fit on this grid
  const fittingCandidates = BASE_SHAPES.filter((base) => {
    const candidate: BlockShape = { ...base, id: 'temp' };
    return canShapeFit(candidate, grid, 8);
  });

  if (fittingCandidates.length > 0) {
    // Replace the last shape with one guaranteed to fit
    const chosen = fittingCandidates[Math.floor(Math.random() * fittingCandidates.length)];
    counter++;
    shapes[2] = {
      ...chosen,
      id: `${chosen.name}-${Date.now()}-${counter}`
    };
  }

  return shapes;
}

/**
 * Checks if a given shape can be placed anywhere on the 8x8 grid.
 */
export function canShapeFit(shape: BlockShape, grid: { filled: boolean }[][], gridSize = 8): boolean {
  const rows = shape.matrix.length;
  const cols = shape.matrix[0].length;

  for (let r = 0; r <= gridSize - rows; r++) {
    for (let c = 0; c <= gridSize - cols; c++) {
      let fits = true;
      for (let sr = 0; sr < rows; sr++) {
        for (let sc = 0; sc < cols; sc++) {
          if (shape.matrix[sr][sc] === 1) {
            if (grid[r + sr][c + sc].filled) {
              fits = false;
              break;
            }
          }
        }
        if (!fits) break;
      }
      if (fits) return true;
    }
  }

  return false;
}
