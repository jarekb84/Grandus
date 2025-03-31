import { useCallback, useEffect, useRef } from "react";
import { useCombatStore } from "@/features/combat/Combat.store";
import * as Phaser from "phaser";
import { CombatScene, CombatSceneEvents } from "@/features/combat/Combat.scene";
import { useCurrencyStore } from "@/features/shared/stores/Currency.store";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";
import { ResourceType } from "@/features/shared/types/entities";

interface CombatGameReturn {
  gameRef: React.RefObject<HTMLDivElement | null>;
  isAutoShooting: boolean;
  isGameOver: boolean;
  isWaveComplete: boolean;
  combatStats: {
    wave: number;
    enemiesRemaining: number;
    enemyHealth: number;
    enemyDamage: number;
    enemySpeed: number;
    ammo: number;
    killCount: number;
  };
  playerStats: {
    health: number;
    damage: number;
    shootingSpeed: number;
  };
  cash: number;
  handleToggleAutoShoot: () => void;
  handleRetry: () => void;
}

export const useCombatGame = (
  onGameOver?: (score: number) => void,
): CombatGameReturn => {
  const gameRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<CombatScene | null>(null);
  const resourcesStore = useResourcesStore();

  // Use Zustand store for combat state
  const isAutoShooting = useCombatStore((state) => state.isAutoShooting);
  const isGameOver = useCombatStore((state) => state.isGameOver);
  const isWaveComplete = useCombatStore((state) => state.isWaveComplete);

  // Get combat stats from the store
  const stats = useCombatStore((state) => state.stats);
  const {
    wave,
    enemiesRemaining,
    enemyHealth,
    enemyDamage,
    enemySpeed,
    ammo,
    playerHealth,
    cash,
    killCount,
  }: {
    wave: number;
    enemiesRemaining: number;
    enemyHealth: number;
    enemyDamage: number;
    enemySpeed: number;
    ammo: number;
    playerHealth?: number;
    cash?: number;
    killCount?: number;
  } = stats;

  useEffect((): (() => void) => {
    if (!gameRef.current) return () => {};

    // Initialize ammo from stone count
    // Ammo initialization is now handled within CombatScene.create

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      parent: gameRef.current,
      backgroundColor: "#1e293b",
      physics: {
        default: "arcade",
      },
    });

    const sceneEvents: CombatSceneEvents = {
      onStatsUpdate: (stats): void => {
        useCombatStore.getState().updateStats({
          wave: stats.wave,
          enemiesRemaining: stats.enemiesRemaining,
          enemyHealth: stats.enemyHealth,
          enemyDamage: stats.enemyDamage,
          enemySpeed: stats.enemySpeed,
        });
      },
      onGameOver: (finalScore): void => {
        useCombatStore.getState().setGameOver(true);
        useCombatStore.getState().updateStats({ wave: finalScore });
        useCombatStore.getState().setAutoShooting(false);
        if (onGameOver) {
          onGameOver(finalScore);
        }
      },
      onAmmoChanged: (ammoAmount): void => {
        useCombatStore.getState().updateStats({ ammo: ammoAmount });
      },
      onOutOfAmmo: (): void => {
        useCombatStore.getState().updateStats({ ammo: 0 });
        useCombatStore.getState().setAutoShooting(false);
      },
      onWaveComplete: (waveNumber, rewards): void => {
        console.log(`Wave ${waveNumber} complete with rewards:`, rewards);
      },
      onPlayerHealthChanged: (health): void => {
        useCombatStore.getState().updateStats({ playerHealth: health });
      },
    };

    const combatScene = new CombatScene(sceneEvents);
    sceneRef.current = combatScene;
    game.scene.add("CombatScene", combatScene, true);

    return () => {
      game.destroy(true);
      sceneRef.current = null;
    };
  }, [onGameOver]);

  const handleToggleAutoShoot = useCallback((): void => {
    // Only allow auto-shooting if player has ammo
    if (!isAutoShooting && ammo <= 0) {
      return; // Don't enable shooting if out of ammo
    }
    useCombatStore.getState().setAutoShooting(!isAutoShooting);
    if (sceneRef.current) {
      sceneRef.current.setAutoShooting(!isAutoShooting);
    }
  }, [isAutoShooting, ammo]);

  const handleRetry = useCallback((): void => {
    useCombatStore.getState().resetState();

    // Reset cash to 0 for new run
    useCurrencyStore.getState().resetCash();

    // Reset the scene
    if (sceneRef.current) {
      // The scene's restart is handled internally
      sceneRef.current.scene.restart();
    }
  }, []);

  // Sync ammo with stone count
  useEffect(() => {
    const stoneCount = resourcesStore.getResource(ResourceType.STONE);
    // Only update if the scene isn't mounted yet or the ammo doesn't match
    if (!sceneRef.current || stoneCount !== ammo) {
      useCombatStore.getState().updateStats({ ammo: stoneCount });
    }
  }, [resourcesStore, ammo]);

  return {
    gameRef,
    isAutoShooting,
    isGameOver,
    isWaveComplete,
    combatStats: {
      wave,
      enemiesRemaining,
      enemyHealth,
      enemyDamage,
      enemySpeed,
      ammo,
      killCount,
    },
    playerStats: {
      health: playerHealth,
      damage: 10, // Placeholder - we can add these to the store later if needed
      shootingSpeed: 1, // Placeholder
    },
    cash,
    handleToggleAutoShoot,
    handleRetry,
  };
};
