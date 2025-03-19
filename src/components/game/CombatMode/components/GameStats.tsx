import React from 'react';
import { GameStatsProps } from '../CombatMode.types';
import styles from '../CombatMode.module.css';

export const GameStats: React.FC<GameStatsProps> = ({ combatStats, playerStats }) => {
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
          <div>Health: {playerStats.health}</div>
          <div>Damage: {playerStats.damage}</div>
          <div>Shooting Speed: {playerStats.shootingSpeed}/s</div>
        </div>
      </div>
    </>
  );
}; 