import React from 'react';
import { WaveStats } from './components/WaveStats';
import { PlayerStats } from './components/PlayerStats';
import { GameControls } from './components/GameControls';
import { GameOver } from './components/GameOver';
import { CombatStats, PlayerStats as PlayerStatsType } from '@/game/scenes/combat/types';
import styles from './CombatUI.module.css';

interface CombatUIProps {
  gameRef: React.RefObject<HTMLDivElement>;
  isGameOver: boolean;
  finalScore: number;
  combatStats: CombatStats;
  playerStats: PlayerStatsType;
  isAutoShooting: boolean;
  shootingCooldown: number;
  onToggleAutoShoot: () => void;
  onRetry: () => void;
}

export const CombatUI: React.FC<CombatUIProps> = ({
  gameRef,
  isGameOver,
  finalScore,
  combatStats,
  playerStats,
  isAutoShooting,
  shootingCooldown,
  onToggleAutoShoot,
  onRetry,
}) => {
  return (
    <div className={styles.container}>
      <div ref={gameRef} className={styles.gameContainer} />
      
      <div className={styles.statsContainer}>
        {isGameOver ? (
          <GameOver
            wave={combatStats.wave}
            score={finalScore}
            onRetry={onRetry}
          />
        ) : (
          <>
            <WaveStats stats={combatStats} />
            <PlayerStats stats={playerStats} />
            <GameControls
              isAutoShooting={isAutoShooting}
              shootingCooldown={shootingCooldown}
              onToggleAutoShoot={onToggleAutoShoot}
            />
          </>
        )}
      </div>
    </div>
  );
}; 