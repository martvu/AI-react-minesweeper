import { GameState } from '../types/minesweeper';
import { Cell } from './Cell';

interface BoardProps {
  gameState: GameState;
  onCellReveal: (row: number, col: number) => void;
  onCellFlag: (row: number, col: number) => void;
}

export const Board = ({ gameState, onCellReveal, onCellFlag }: BoardProps) => {
  const { board } = gameState;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${board[0].length}, 30px)`,
        gap: 0,
        padding: '3px',
        backgroundColor: '#C0C0C0',
        border: '3px outset white',
        borderTop: '3px solid #ffffff',
        borderLeft: '3px solid #ffffff',
        borderRight: '3px solid #808080',
        borderBottom: '3px solid #808080'
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            {...cell}
            onReveal={onCellReveal}
            onFlag={onCellFlag}
            gameStatus={gameState.gameStatus}
          />
        ))
      )}
    </div>
  );
};