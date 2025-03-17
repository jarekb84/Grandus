import React from 'react';
import { CombatStats } from '@/game/scenes/combat/types';
import styles from '../CombatUI.module.css';

interface WaveStatsProps {
  stats: CombatStats;
}

export const WaveStats: React.FC<WaveStatsProps> = ({ stats }) => {
  return (
    <div className={styles.waveStats}>
      <h3>Wave Stats</h3>
      <div className={styles.statGrid}>
        <div>Wave: {stats.wave}</div>
        <div>Enemies: {stats.enemiesRemaining}</div>
        <div>Enemy Health: {stats.enemyHealth}</div>
        <div>Enemy Damage: {stats.enemyDamage}</div>
        <div>Enemy Speed: {stats.enemySpeed}</div>
      </div>
    </div>
  );
}; 