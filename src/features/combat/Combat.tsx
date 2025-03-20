'use client'

import React from 'react';
import { CombatModeProps } from '@/features/combat/Combat.types';
import { useCombatGame } from '@/features/combat/useCombatGame';
import { GameStats } from '@/features/combat/GameStats';
import { GameControls } from '@/features/combat/GameControls';
import { GameOver } from '@/features/combat/GameOver';
import styles from '@/features/combat/Combat.module.css';

export const CombatMode: React.FC<CombatModeProps> = ({ onGameOver }) => {
  const {
    gameRef,
    isAutoShooting,
    shootingCooldown,
    isGameOver,
    finalScore,
    combatStats,
    playerStats,
    outOfAmmo,
    handleToggleAutoShoot,
    handleRetry
  } = useCombatGame(onGameOver);

  return (
    <div className={styles.container}>
      <div ref={gameRef} className={styles.gameContainer} />
      
      <div className={styles.statsContainer}>
        {isGameOver ? (
          <GameOver
            wave={combatStats.wave}
            finalScore={finalScore}
            onRetry={handleRetry}
          />
        ) : (
          <>
            <GameStats
              combatStats={combatStats}
              playerStats={playerStats}
            />
            <GameControls
              isAutoShooting={isAutoShooting}
              shootingCooldown={shootingCooldown}
              ammo={combatStats.ammo}
              outOfAmmo={outOfAmmo}
              onToggleAutoShoot={handleToggleAutoShoot}
              isGameOver={isGameOver}
            />
          </>
        )}
      </div>
    </div>
  );
}; 