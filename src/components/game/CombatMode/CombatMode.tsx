'use client'

import React from 'react';
import { CombatModeProps } from './CombatMode.types';
import { useCombatGame } from './hooks/useCombatGame';
import { GameStats } from './components/GameStats';
import { GameControls } from './components/GameControls';
import { GameOver } from './components/GameOver';
import styles from './CombatMode.module.css';

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