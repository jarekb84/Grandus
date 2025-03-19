import { useCallback, useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { CombatScene, CombatSceneEvents } from '@/game/scenes/CombatScene';
import { CombatStats, PlayerStats } from '../CombatMode.types';
import { useCurrencyStore } from '@/stores/currency/currencyStore';
import { useResourcesStore } from '@/stores/resources/resourcesStore';
import { ResourceType } from '@/game/entities.types';

export const useCombatGame = (onGameOver?: (score: number) => void) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CombatScene | null>(null);
  const [isAutoShooting, setIsAutoShooting] = useState(false);
  const [shootingCooldown, setShootingCooldown] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [outOfAmmo, setOutOfAmmo] = useState(false);
  const resourcesStore = useResourcesStore();
  const [combatStats, setCombatStats] = useState<CombatStats>({
    wave: 0,
    enemiesRemaining: 0,
    enemyHealth: 0,
    enemyDamage: 0,
    enemySpeed: 0,
    ammo: resourcesStore.resources[ResourceType.STONE],
  });
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    health: 100,
    damage: 1,
    shootingSpeed: 1,
  });

  useEffect(() => {
    if (!gameRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      parent: gameRef.current,
      backgroundColor: '#1e293b',
      physics: {
        default: 'arcade',
      },
    });

    const sceneEvents: CombatSceneEvents = {
      onStatsUpdate: (stats) => {
        setCombatStats(prev => ({
          ...prev,
          ...stats,
        }));
      },
      onGameOver: (wave) => {
        setIsGameOver(true);
        setFinalScore(wave);
        setIsAutoShooting(false);
        if (onGameOver) {
          onGameOver(wave);
        }
      },
      onAmmoChanged: (ammo) => {
        setCombatStats(prev => ({
          ...prev,
          ammo,
        }));
      },
      onOutOfAmmo: () => {
        setOutOfAmmo(true);
        setIsAutoShooting(false);
      },
      onWaveComplete: (waveNumber, rewards) => {
        console.log(`Wave ${waveNumber} complete with rewards:`, rewards);
      },
      onPlayerHealthChanged: (health) => {
        setPlayerStats(prev => ({
          ...prev,
          health
        }));
      }
    };

    const combatScene = new CombatScene(sceneEvents);
    sceneRef.current = combatScene;
    game.scene.add('CombatScene', combatScene, true);

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
    // Only allow auto-shooting if player has ammo
    if (!isAutoShooting && combatStats.ammo <= 0) {
      return; // Don't enable shooting if out of ammo
    }
    
    setIsAutoShooting(prev => !prev);
    if (sceneRef.current) {
      const newValue = !isAutoShooting;
      sceneRef.current.setAutoShooting(newValue);
    }
  }, [isAutoShooting, sceneRef, combatStats.ammo]);

  const handleRetry = useCallback(() => {
    setIsGameOver(false);
    setFinalScore(0);
    setPlayerStats({
      health: 100,
      damage: 1,
      shootingSpeed: 1,
    });
    
    // Reset the scene
    if (sceneRef.current) {
      // The scene's restart is handled internally
      sceneRef.current.scene.restart();
    }
  }, [sceneRef]);

  // Reset out of ammo state when ammo changes from 0 to a positive value
  useEffect(() => {
    if (combatStats.ammo > 0 && outOfAmmo) {
      setOutOfAmmo(false);
    }
  }, [combatStats.ammo, outOfAmmo]);

  return {
    gameRef,
    isAutoShooting,
    shootingCooldown,
    isGameOver,
    finalScore,
    combatStats,
    playerStats,
    outOfAmmo,
    handleToggleAutoShoot,
    handleRetry,
  };
}; 