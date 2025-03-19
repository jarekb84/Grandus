import { useCallback, useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { CombatScene, CombatSceneEvents } from '@/game/scenes/CombatScene';
import { CombatStats, PlayerStats } from '../CombatMode.types';

export const useCombatGame = (onGameOver?: (score: number) => void) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CombatScene | null>(null);
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

  useEffect(() => {
    if (!gameRef.current) return;

    const events: CombatSceneEvents = {
      onWaveComplete: (wave, rewards) => {
        console.log(`Wave ${wave} complete! Rewards:`, rewards);
      },
      onGameOver: (score) => {
        console.log('Game Over! Score:', score);
        setIsGameOver(true);
        setFinalScore(score);
        setIsAutoShooting(false);
        onGameOver?.(score);
      },
      onStatsUpdate: (stats) => {
        setCombatStats(stats);
      }
    };

    let combatScene = new CombatScene(events);
    
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      parent: gameRef.current,
      backgroundColor: '#1e293b',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: combatScene
    });

    sceneRef.current = combatScene;
    
    return () => {
      game.destroy(true);
      sceneRef.current = null;
    };
  }, [onGameOver]);

  useEffect(() => {
    if (!isAutoShooting) {
      setShootingCooldown(0);
      return;
    }

    const interval = setInterval(() => {
      setShootingCooldown((prev) => {
        if (prev >= 100) return 0;
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAutoShooting]);

  const handleToggleAutoShoot = useCallback(() => {
    if (isGameOver) return;
    
    setIsAutoShooting((prev) => {
      const newValue = !prev;
      if (sceneRef.current) {
        sceneRef.current.setAutoShooting(newValue);
      }
      return newValue;
    });
  }, [isGameOver, isAutoShooting]);

  const handleRetry = useCallback(() => {
    if (sceneRef.current) {
      // Reset React state
      setIsGameOver(false);
      setFinalScore(0);
      setIsAutoShooting(false);
      
      // Reset Phaser scene
      const scene = sceneRef.current;
      
      // First, restart the scene to get a fresh state
      scene.scene.restart();
      
      // After restart, we need to resume physics (it will be running by default in the new scene)
      // and we may need to reset isGameOver flag if it's persisted across scene restarts
      scene.scene.get('CombatScene').physics.resume();
      
      // Additional safety to ensure the scene is active and ready
      requestAnimationFrame(() => {
        if (scene.scene && typeof scene.scene.setActive === 'function') {
          scene.scene.setActive(true);
        }
      });
    }
  }, []);

  return {
    gameRef,
    isAutoShooting,
    shootingCooldown,
    isGameOver,
    finalScore,
    combatStats,
    playerStats,
    handleToggleAutoShoot,
    handleRetry
  };
}; 