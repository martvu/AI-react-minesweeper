import { Cell as CellType } from '../types/minesweeper';
import { memo } from 'react';

interface CellProps extends CellType {
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  gameStatus: 'playing' | 'won' | 'lost';
}

const getCellContent = (cell: CellType): string => {
  if (!cell.isRevealed) return cell.isFlagged ? '🚩' : '';
  if (cell.isMine) return '💣';
  return cell.neighborMines === 0 ? '' : cell.neighborMines.toString();
};

const getNumberColor = (num: number): string => {
  const colors = [
    '', // 0 has no color
    '#0000FF', // 1 is blue
    '#008000', // 2 is green
    '#FF0000', // 3 is red
    '#800080', // 4 is purple
    '#800000', // 5 is maroon
    '#008080', // 6 is teal
    '#000000', // 7 is black
    '#808080'  // 8 is gray
  ];
  return colors[num];
};

export const Cell = memo(({ row, col, isRevealed, isFlagged, isMine, neighborMines, onReveal, onFlag, gameStatus }: CellProps) => {
  const handleClick = () => {
    if (gameStatus !== 'playing' || isFlagged) return;
    onReveal(row, col);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (gameStatus !== 'playing' || isRevealed) return;
    onFlag(row, col);
  };

  const content = getCellContent({ row, col, isRevealed, isFlagged, isMine, neighborMines });
  const color = isRevealed && !isMine && neighborMines > 0 ? getNumberColor(neighborMines) : undefined;

  return (
    <button
      className={`cell ${isRevealed ? 'revealed' : ''}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      style={{
        color,
        cursor: gameStatus === 'playing' ? 'pointer' : 'default',
        width: '30px',
        height: '30px',
        border: isRevealed ? '1px solid #808080' : '3px outset white',
        backgroundColor: isRevealed && isMine ? '#ff0000' : '#C0C0C0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '20px',
        fontFamily: 'Arial',
        padding: 0,
        userSelect: 'none',
        lineHeight: 1,
        position: 'relative'
      }}
    >
      {content}
    </button>
  );
});