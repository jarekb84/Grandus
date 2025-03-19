import React from 'react';
import { GameOverProps } from '../CombatMode.types';
import styles from '../CombatMode.module.css';

export const GameOver: React.FC<GameOverProps> = ({ wave, finalScore, onRetry }) => {
  return (
    <div className={styles.gameOver}>
      <h2>Game Over!</h2>
      <p>You reached wave {wave}</p>
      <p>Final score: {finalScore}</p>
      <button 
        className={styles.retryButton}
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}; 