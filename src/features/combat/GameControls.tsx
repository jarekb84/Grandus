import React from 'react';
import { GameControlsProps } from '@/features/combat/Combat.types';
import styles from '@/features/combat/Combat.module.css';

export const GameControls: React.FC<GameControlsProps> = ({
  isAutoShooting,
  shootingCooldown,
  ammo,
  outOfAmmo,
  onToggleAutoShoot,
  isGameOver
}) => {
  return (
    <div className={styles.controls}>
      <div className={styles.ammoDisplay}>
        <span className={`${styles.ammoLabel} ${outOfAmmo ? styles.outOfAmmo : ''}`}>
          {outOfAmmo ? 'OUT OF AMMO' : `Ammo: ${ammo}`}
        </span>
      </div>
      <button 
        className={`${styles.shootButton} ${isAutoShooting ? styles.active : ''} ${outOfAmmo ? styles.disabled : ''}`}
        onClick={onToggleAutoShoot}
        disabled={isGameOver || outOfAmmo}
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