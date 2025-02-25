import { useState } from 'react';
import { DIFFICULTY_LEVELS, GameConfig } from '../types/minesweeper';
import { useMinesweeper } from '../hooks/useMinesweeper';
import { Board } from './Board';

export const Game = () => {
  const [difficulty, setDifficulty] = useState<GameConfig>(DIFFICULTY_LEVELS.EASY);
  const { gameState, revealCell, toggleFlag, resetGame } = useMinesweeper(difficulty);

  const handleDifficultyChange = (newDifficulty: GameConfig) => {
    setDifficulty(newDifficulty);
    // We don't call resetGame here, as it will be handled by the useMinesweeper hook
    // when the difficulty changes
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => handleDifficultyChange(DIFFICULTY_LEVELS.EASY)}
          style={{
            padding: '8px 16px',
            backgroundColor: difficulty === DIFFICULTY_LEVELS.EASY ? '#4CAF50' : '#ddd'
          }}
        >
          Easy
        </button>
        <button
          onClick={() => handleDifficultyChange(DIFFICULTY_LEVELS.NORMAL)}
          style={{
            padding: '8px 16px',
            backgroundColor: difficulty === DIFFICULTY_LEVELS.NORMAL ? '#4CAF50' : '#ddd'
          }}
        >
          Normal
        </button>
        <button
          onClick={() => handleDifficultyChange(DIFFICULTY_LEVELS.EXPERT)}
          style={{
            padding: '8px 16px',
            backgroundColor: difficulty === DIFFICULTY_LEVELS.EXPERT ? '#4CAF50' : '#ddd'
          }}
        >
          Expert
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', backgroundColor: '#C0C0C0', padding: '6px', border: '3px outset white' }}>
        <div style={{ 
          padding: '3px 6px',
          border: '2px inset white',
          backgroundColor: '#000',
          color: '#f00',
          fontFamily: 'Digital, monospace',
          fontSize: '20px',
          minWidth: '40px',
          textAlign: 'right',
          letterSpacing: '1px'
        }}>
          {String(gameState.mineCount).padStart(3, '0')}
        </div>
        <button
          onClick={resetGame}
          style={{
            fontSize: '24px',
            width: '26px',
            height: '26px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#C0C0C0',
            border: '2px outset white',
            cursor: 'pointer',
            padding: 0,
            margin: '0 auto'
          }}
        >
          {gameState.gameStatus === 'won' ? '😎' : gameState.gameStatus === 'lost' ? '😵' : '🙂'}
        </button>
        <div style={{ 
          padding: '3px 6px',
          border: '2px inset white',
          backgroundColor: '#000',
          color: '#f00',
          fontFamily: 'Digital, monospace',
          fontSize: '20px',
          minWidth: '40px',
          textAlign: 'right',
          letterSpacing: '1px'
        }}>
          {String(gameState.timeElapsed).padStart(3, '0')}
        </div>
      </div>

      <Board
        gameState={gameState}
        onCellReveal={revealCell}
        onCellFlag={toggleFlag}
      />

      {gameState.gameStatus !== 'playing' && (
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: gameState.gameStatus === 'won' ? '#4CAF50' : '#f44336'
        }}>
          {gameState.gameStatus === 'won' ? 'You Won! 🎉' : 'Game Over! 💥'}
        </div>
      )}
    </div>
  );
};