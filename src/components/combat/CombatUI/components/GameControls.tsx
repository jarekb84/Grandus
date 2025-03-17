import React from 'react';
import styles from '../CombatUI.module.css';

interface GameControlsProps {
  isAutoShooting: boolean;
  shootingCooldown: number;
  onToggleAutoShoot: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isAutoShooting,
  shootingCooldown,
  onToggleAutoShoot,
}) => {
  return (
    <div className={styles.controls}>
      <button 
        className={`${styles.shootButton} ${isAutoShooting ? styles.active : ''}`}
        onClick={onToggleAutoShoot}
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