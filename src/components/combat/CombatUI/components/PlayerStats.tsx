import React from 'react';
import { PlayerStats as PlayerStatsType } from '@/game/scenes/combat/types';
import styles from '../CombatUI.module.css';

interface PlayerStatsProps {
  stats: PlayerStatsType;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ stats }) => {
  return (
    <div className={styles.playerStats}>
      <h3>Player Stats</h3>
      <div className={styles.statGrid}>
        <div>Health: {stats.health}</div>
        <div>Damage: {stats.damage}</div>
        <div>Shooting Speed: {stats.shootingSpeed}/s</div>
      </div>
    </div>
  );
}; 