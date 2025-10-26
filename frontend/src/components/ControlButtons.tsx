import React from 'react';
import type { GameStatus } from '../hooks/useTypingGame';

interface ControlButtonsProps {
  gameStatus: GameStatus;
  onStart: () => void;
  onPause: () => void;
  onRestart: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  gameStatus,
  onStart,
  onPause,
  onRestart
}) => {
  return (
    <div className="control-buttons">
      {gameStatus === 'idle' && (
        <button className="btn btn-start" onClick={onStart}>
          Start
        </button>
      )}

      {gameStatus === 'playing' && (
        <button className="btn btn-pause" onClick={onPause}>
          Pause
        </button>
      )}

      {gameStatus === 'paused' && (
        <>
          <button className="btn btn-resume" onClick={onStart}>
            Resume
          </button>
          <button className="btn btn-restart" onClick={onRestart}>
            Restart
          </button>
        </>
      )}

      {gameStatus === 'playing' && (
        <button className="btn btn-restart" onClick={onRestart}>
          Restart
        </button>
      )}
    </div>
  );
};

export default ControlButtons;