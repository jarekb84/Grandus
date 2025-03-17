import { useState, useCallback } from 'react';
import { CombatStats, PlayerStats } from '@/game/scenes/combat/types';

export const useCombatState = () => {
  const [isAutoShooting, setIsAutoShooting] = useState(false);
  const [shootingCooldown, setShootingCooldown] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [combatStats, setCombatStats] = useState<CombatStats>({
    wave: 0,
    enemiesRemaining: 0,
    enemyHealth: 0,
    enemyDamage: 0,
    enemySpeed: 0,
  });
  const [playerStats] = useState<PlayerStats>({
    health: 100,
    damage: 1,
    shootingSpeed: 1,
  });

  const handleWaveComplete = useCallback((wave: number, rewards: any) => {
    console.log(`Wave ${wave} complete! Rewards:`, rewards);
  }, []);

  const handleGameOver = useCallback((score: number) => {
    setIsGameOver(true);
    setFinalScore(score);
    setIsAutoShooting(false);
  }, []);

  const handleStatsUpdate = useCallback((stats: CombatStats) => {
    setCombatStats(stats);
  }, []);

  const handleRetry = useCallback(() => {
    setIsGameOver(false);
    setFinalScore(0);
    setIsAutoShooting(false);
  }, []);

  const handleToggleAutoShoot = useCallback(() => {
    if (isGameOver) return;
    setIsAutoShooting(prev => !prev);
  }, [isGameOver]);

  // Update shooting cooldown
  const updateShootingCooldown = useCallback(() => {
    if (!isAutoShooting) {
      setShootingCooldown(0);
      return;
    }

    setShootingCooldown((prev) => {
      if (prev >= 100) return 0;
      return prev + 10;
    });
  }, [isAutoShooting]);

  return {
    state: {
      isAutoShooting,
      shootingCooldown,
      isGameOver,
      finalScore,
      combatStats,
      playerStats,
    },
    actions: {
      handleWaveComplete,
      handleGameOver,
      handleStatsUpdate,
      handleRetry,
      handleToggleAutoShoot,
      updateShootingCooldown,
    },
  };
}; 