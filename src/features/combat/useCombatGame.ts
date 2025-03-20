import { useCallback, useEffect, useRef } from 'react';
import { useCombatStore } from '@/features/combat/Combat.store';
import * as Phaser from 'phaser';
import { CombatScene, CombatSceneEvents } from '@/features/combat/Combat.scene';
import { CombatStats, PlayerStats } from '@/features/combat/Combat.types';
import { useCurrencyStore } from '@/features/shared/stores/Currency.store';
import { useResourcesStore } from '@/features/shared/stores/Resources.store';
import { ResourceType } from '@/features/shared/types/entities';

export const useCombatGame = (onGameOver?: (score: number) => void) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CombatScene | null>(null);
  const resourcesStore = useResourcesStore();

  // Use Zustand store for combat state
  const isAutoShooting = useCombatStore(state => state.isAutoShooting);
  const shootingCooldown = useCombatStore(state => state.shootingCooldown);
  const isGameOver = useCombatStore(state => state.isGameOver);
  const finalScore = useCombatStore(state => state.finalScore);
  const outOfAmmo = useCombatStore(state => state.outOfAmmo);
  const wave = useCombatStore(state => state.wave);
  const enemiesRemaining = useCombatStore(state => state.enemiesRemaining);
  const enemyHealth = useCombatStore(state => state.enemyHealth);
  const enemyDamage = useCombatStore(state => state.enemyDamage);
  const enemySpeed = useCombatStore(state => state.enemySpeed);
  const ammo = useCombatStore(state => state.ammo);
  const playerHealth = useCombatStore(state => state.playerHealth);


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
        useCombatStore.getState().setCombatStats(stats);
      },
      onGameOver: (wave) => {
        useCombatStore.getState().setIsGameOver(true);
        useCombatStore.getState().setFinalScore(wave);
        useCombatStore.getState().setIsAutoShooting(false);
        if (onGameOver) {
          onGameOver(wave);
        }
      },
      onAmmoChanged: (ammo) => {
        useCombatStore.getState().setAmmo(ammo); // Use setAmmo directly
      },
      onOutOfAmmo: () => {
        useCombatStore.getState().setOutOfAmmo(true);
        useCombatStore.getState().setIsAutoShooting(false);
      },
      onWaveComplete: (waveNumber, rewards) => {
        console.log(`Wave ${waveNumber} complete with rewards:`, rewards);
      },
      onPlayerHealthChanged: (health) => {
        useCombatStore.getState().setPlayerHealth(health); // Use setPlayerHealth directly
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
      useCombatStore.getState().setShootingCooldown(0);
      return;
    }

    const interval = setInterval(() => {
      const currentCooldown = useCombatStore.getState().shootingCooldown;
      useCombatStore.getState().setShootingCooldown(
        (currentCooldown >= 100 ? 0 : currentCooldown + 10)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isAutoShooting]); // Dependency on isAutoShooting from store

  const handleToggleAutoShoot = useCallback(() => {
    // Only allow auto-shooting if player has ammo
    if (!isAutoShooting && ammo <= 0) { // Use ammo selector directly
      return; // Don't enable shooting if out of ammo
    }
    useCombatStore.getState().setIsAutoShooting(!isAutoShooting); // Use store setter
    if (sceneRef.current) {
      const newValue = !isAutoShooting;
      sceneRef.current.setAutoShooting(newValue);
    }
  }, [isAutoShooting, sceneRef, ammo]); // Dependencies updated - use ammo selector

  const handleRetry = useCallback(() => {
    useCombatStore.getState().setIsGameOver(false);
    useCombatStore.getState().setFinalScore(0);
    useCombatStore.getState().setPlayerHealth(100); // Use setPlayerHealth directly

    // Reset cash to 0 for new run
    useCurrencyStore.getState().resetCash();

    // Reset the scene
    if (sceneRef.current) {
      // The scene's restart is handled internally
      sceneRef.current.scene.restart();
    }
  }, [sceneRef]);

  // Reset out of ammo state when ammo changes from 0 to a positive value
  useEffect(() => {
    if (ammo > 0 && outOfAmmo) { // Use ammo and outOfAmmo selectors directly
      useCombatStore.getState().setOutOfAmmo(false);
    }
  }, [ammo, outOfAmmo]); // Dependencies updated - use ammo and outOfAmmo selectors

  return {
    gameRef,
    isAutoShooting,
    shootingCooldown,
    isGameOver,
    finalScore,
    combatStats: { // Keep combatStats for UI - but derive from store selectors
      wave: wave,
      enemiesRemaining: enemiesRemaining,
      enemyHealth: enemyHealth,
      enemyDamage: enemyDamage,
      enemySpeed: enemySpeed,
      ammo: ammo,
    },
    playerStats: { // Keep playerStats for UI - but derive from store selectors
      health: playerHealth,
      damage: useCombatStore(state => state.enemyDamage), // Example - damage not in store yet - placeholder
      shootingSpeed: useCombatStore(state => state.enemySpeed), // Example - shootingSpeed not in store yet - placeholder
    },
    outOfAmmo,
    handleToggleAutoShoot,
    handleRetry,
  };
};
