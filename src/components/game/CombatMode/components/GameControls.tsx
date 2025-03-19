import React from 'react';
import { GameControlsProps } from '../CombatMode.types';
import styles from '../CombatMode.module.css';

export const GameControls: React.FC<GameControlsProps> = ({
  isAutoShooting,
  shootingCooldown,
  onToggleAutoShoot,
  isGameOver
}) => {
  return (
    <div className={styles.controls}>
      <button 
        className={`${styles.shootButton} ${isAutoShooting ? styles.active : ''}`}
        onClick={onToggleAutoShoot}
        disabled={isGameOver}
      >
        {isAutoShooting ? 'Stop Shooting' : 'Start Shooting'}
        <div 
          className={styles.cooldownOverlay} 
          style={{ 
            width: `${shootingCooldown}%`,
            display: isAutoShooting ? 'block' : 'none'
          }} 
        />
      </button>
    </div>
  );
}; 