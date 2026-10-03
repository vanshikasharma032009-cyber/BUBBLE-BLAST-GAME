export type CellColor = 
  | 'blue'
  | 'purple'
  | 'green'
  | 'amber'
  | 'red'
  | 'cyan'
  | 'pink'
  | 'yellow'
  | 'golden';

export interface BlockShape {
  id: string;
  name: string;
  matrix: number[][];
  color: CellColor;
}

export type GridCell = {
  filled: boolean;
  color?: CellColor;
  isClearing?: boolean;
};

export type GameState = 'loading' | 'start' | 'levels' | 'playing' | 'gameover' | 'levelcomplete' | 'tictacgo' | 'tictacgo-loading';

export interface LevelConfig {
  levelNumber: number;
  targetScore: number;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0 to 3
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color?: string;
}
