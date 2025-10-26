import { useState } from 'react';

export type GameStatus = 'idle' | 'playing' | 'paused';

interface UseTypingGameReturn {
  gameStatus: GameStatus;
  startGame: () => void;
  pauseGame: () => void;
  restartGame: () => void;
}

export const useTypingGame = (): UseTypingGameReturn => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');

  const startGame = () => {
    setGameStatus('playing');
  };

  const pauseGame = () => {
    setGameStatus('paused');
  };

  const restartGame = () => {
    setGameStatus('idle');
  };

  return {
    gameStatus,
    startGame,
    pauseGame,
    restartGame
  };
};