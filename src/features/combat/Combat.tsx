import React from "react";
import { CombatModeProps } from "@/features/combat/Combat.types";
import { useCombatGame } from "@/features/combat/useCombatGame";
import { GameStats } from "@/features/combat/GameStats";
import { GameControls } from "@/features/combat/GameControls";
import { GameOver } from "@/features/combat/GameOver";
import styles from "@/features/combat/Combat.module.css";

export const CombatMode: React.FC<CombatModeProps> = ({ onGameOver }) => {
  const {
    isAutoShooting,
    isGameOver,
    combatStats,
    playerStats,
    handleToggleAutoShoot,
    handleRetry,
  } = useCombatGame(onGameOver);

  const outOfAmmo = combatStats.ammo <= 0;

  return (
    <div className={styles.container}>
      <div className={styles.statsContainer}>
        {isGameOver ? (
          <GameOver
            wave={combatStats.wave}
            finalScore={combatStats.wave}
            onRetry={handleRetry}
          />
        ) : (
          <>
            <GameStats combatStats={combatStats} playerStats={playerStats} />
            <GameControls
              isAutoShooting={isAutoShooting}
              shootingCooldown={0}
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
