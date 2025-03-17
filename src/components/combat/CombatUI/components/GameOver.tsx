import React from 'react';
import styles from '../CombatUI.module.css';

interface GameOverProps {
  wave: number;
  score: number;
  onRetry: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ wave, score, onRetry }) => {
  return (
    <div className={styles.gameOver}>
      <h2>Game Over!</h2>
      <p>You reached wave {wave}</p>
      <p>Final score: {score}</p>
      <button 
        className={styles.retryButton}
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}; 