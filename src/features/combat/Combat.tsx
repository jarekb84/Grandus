"use client";

import React from "react";
import { CombatModeProps } from "@/features/combat/Combat.types";
import { useCombatGame } from "@/features/combat/useCombatGame";
import { GameStats } from "@/features/combat/GameStats";
import { GameControls } from "@/features/combat/GameControls";
import { GameOver } from "@/features/combat/GameOver";
import styles from "@/features/combat/Combat.module.css";

export const CombatMode: React.FC<CombatModeProps> = ({ onGameOver }) => {
  const {
    // gameRef, // Removed, no longer returned by hook or needed here
    isAutoShooting,
    isGameOver,
    combatStats,
    playerStats,
    handleToggleAutoShoot,
    handleRetry,
  } = useCombatGame(onGameOver);

  // Determine if we're out of ammo
  const outOfAmmo = combatStats.ammo <= 0;

  return (
    <div className={styles.container}>
      {/* The Phaser game canvas is now rendered by GameContent using GameContext */}

      <div className={styles.statsContainer}>
        {isGameOver ? (
          <GameOver
            wave={combatStats.wave}
            finalScore={combatStats.wave} // Use wave as final score
            onRetry={handleRetry}
          />
        ) : (
          <>
            <GameStats combatStats={combatStats} playerStats={playerStats} />
            <GameControls
              isAutoShooting={isAutoShooting}
              shootingCooldown={0} // We don't track this in the store anymore
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
