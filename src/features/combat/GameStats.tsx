import React from "react";
import { GameStatsProps } from "@/features/combat/Combat.types";
import styles from "@/features/combat/Combat.module.css";
import { useCurrencyStore } from "@/features/shared/stores/Currency.store";

export const GameStats: React.FC<GameStatsProps> = ({
  combatStats,
  playerStats,
}) => {
  const cash = useCurrencyStore((state) => state.cash);

  const healthPercentage = Math.max(
    0,
    Math.min(100, (playerStats.health / 100) * 100),
  );

  const getHealthBarColor = (): string => {
    if (healthPercentage > 60) return "#4ade80"; // Green
    if (healthPercentage > 30) return "#facc15"; // Yellow
    return "#ef4444"; // Red
  };

  return (
    <>
      <div className={styles.waveStats}>
        <h3>Wave Stats</h3>
        <div className={styles.statGrid}>
          <div>Wave: {combatStats.wave}</div>
          <div>Enemies: {combatStats.enemiesRemaining}</div>
          <div>Enemy Health: {combatStats.enemyHealth}</div>
          <div>Enemy Damage: {combatStats.enemyDamage}</div>
          <div>Enemy Speed: {combatStats.enemySpeed}</div>
        </div>
      </div>

      <div className={styles.playerStats}>
        <h3>Player Stats</h3>
        <div className={styles.statGrid}>
          <div className={styles.healthContainer}>
            <div>Health: {playerStats.health}/100</div>
            <div className={styles.healthBar}>
              <div
                className={styles.healthBarFill}
                style={{
                  width: `${healthPercentage}%`,
                  backgroundColor: getHealthBarColor(),
                }}
              />
            </div>
          </div>
          <div>Damage: {playerStats.damage}</div>
          <div>Shooting Speed: {playerStats.shootingSpeed}/s</div>
          <div>Cash: ${cash}</div>
        </div>
      </div>
    </>
  );
};
