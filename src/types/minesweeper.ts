export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export interface GameState {
  board: Cell[][];
  mineCount: number;
  gameStatus: 'playing' | 'won' | 'lost';
  timeElapsed: number;
}

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export const DIFFICULTY_LEVELS = {
  EASY: { rows: 9, cols: 9, mines: 10 },
  NORMAL: { rows: 16, cols: 16, mines: 40 },
  EXPERT: { rows: 16, cols: 30, mines: 99 }
} as const;