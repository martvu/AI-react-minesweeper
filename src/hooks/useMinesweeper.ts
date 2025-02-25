import { useState, useEffect, useCallback, useRef } from "react";
import { Cell, GameState, GameConfig } from "../types/minesweeper";

const createEmptyBoard = (config: GameConfig): Cell[][] => {
  return Array.from({ length: config.rows }, (_, row) =>
    Array.from({ length: config.cols }, (_, col) => ({
      row,
      col,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  );
};

const initializeBoard = (config: GameConfig): Cell[][] => {
  const newBoard = createEmptyBoard(config);

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < config.mines) {
    const row = Math.floor(Math.random() * config.rows);
    const col = Math.floor(Math.random() * config.cols);
    if (!newBoard[row][col].isMine) {
      newBoard[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor mines
  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      if (!newBoard[row][col].isMine) {
        let count = 0;
        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {
            if (r === 0 && c === 0) continue;
            const newRow = row + r;
            const newCol = col + c;
            if (
              newRow >= 0 &&
              newRow < config.rows &&
              newCol >= 0 &&
              newCol < config.cols &&
              newBoard[newRow][newCol].isMine
            ) {
              count++;
            }
          }
        }
        newBoard[row][col].neighborMines = count;
      }
    }
  }

  return newBoard;
};

export const useMinesweeper = (config: GameConfig) => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: initializeBoard(config),
    mineCount: config.mines,
    gameStatus: "playing",
    timeElapsed: 0,
  }));

  const [isGameStarted, setIsGameStarted] = useState(false);
  const prevConfig = useRef(config);

  // Reset game when difficulty changes
  useEffect(() => {
    if (prevConfig.current !== config) {
      setGameState({
        board: initializeBoard(config),
        mineCount: config.mines,
        gameStatus: "playing",
        timeElapsed: 0,
      });
      setIsGameStarted(false);
      prevConfig.current = config;
    }
  }, [config]);

  // Timer logic
  useEffect(() => {
    let timer: number | undefined;

    if (gameState.gameStatus === "playing" && isGameStarted) {
      timer = window.setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        }));
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [gameState.gameStatus, isGameStarted]);

  const revealCell = useCallback(
    (row: number, col: number) => {
      if (gameState.gameStatus !== "playing" || !isGameStarted) return;

      setGameState((prev) => {
        if (prev.board[row][col].isFlagged || prev.board[row][col].isRevealed) {
          return prev;
        }

        // Deep copy board
        const newBoard = prev.board.map((row) => row.map((cell) => ({ ...cell })));

        // Reveal current cell
        newBoard[row][col].isRevealed = true;

        // Check if mine was hit
        if (newBoard[row][col].isMine) {
          // Reveal all mines when game is lost
          newBoard.forEach((row) => {
            row.forEach((cell) => {
              if (cell.isMine) {
                cell.isRevealed = true;
              }
            });
          });

          return {
            board: newBoard,
            mineCount: prev.mineCount,
            gameStatus: "lost",
            timeElapsed: prev.timeElapsed,
          };
        }

        // Reveal neighbors if cell is empty
        if (newBoard[row][col].neighborMines === 0) {
          const revealNeighbors = (r: number, c: number) => {
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRow = r + i;
                const newCol = c + j;
                if (
                  newRow >= 0 &&
                  newRow < config.rows &&
                  newCol >= 0 &&
                  newCol < config.cols &&
                  !newBoard[newRow][newCol].isRevealed &&
                  !newBoard[newRow][newCol].isFlagged
                ) {
                  newBoard[newRow][newCol].isRevealed = true;
                  if (newBoard[newRow][newCol].neighborMines === 0) {
                    revealNeighbors(newRow, newCol);
                  }
                }
              }
            }
          };
          revealNeighbors(row, col);
        }

        // Check for win
        const hasWon = newBoard.every((row) =>
          row.every(
            (cell) =>
              (cell.isMine && !cell.isRevealed) ||
              (!cell.isMine && cell.isRevealed)
          )
        );

        return {
          ...prev,
          board: newBoard,
          gameStatus: hasWon ? "won" : "playing",
        };
      });
    },
    [gameState.gameStatus, config.rows, config.cols, isGameStarted]
  );

  const toggleFlag = useCallback(
    (row: number, col: number) => {
      if (gameState.gameStatus !== "playing" || !isGameStarted) return;

      setGameState((prev) => {
        if (prev.board[row][col].isRevealed) return prev;

        // Deep copy board
        const newBoard = prev.board.map((row) => row.map((cell) => ({ ...cell })));
        const cell = newBoard[row][col];
        cell.isFlagged = !cell.isFlagged;

        return {
          ...prev,
          board: newBoard,
          mineCount: prev.mineCount + (cell.isFlagged ? -1 : 1),
        };
      });
    },
    [gameState.gameStatus, isGameStarted]
  );

  const resetGame = useCallback(() => {
    setGameState({
      board: initializeBoard(config),
      mineCount: config.mines,
      gameStatus: "playing",
      timeElapsed: 0,
    });
    setIsGameStarted(true);
  }, [config]);

  return {
    gameState,
    revealCell,
    toggleFlag,
    resetGame,
  };
};
