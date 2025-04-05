import { useCallback, useEffect, useRef, useState } from "react";
import { useCombatStore } from "@/features/combat/Combat.store";
import { CombatScene } from "@/features/combat/Combat.scene";
import { useCurrencyStore } from "@/features/shared/stores/Currency.store";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";
import { useGameContext } from "@/features/core/GameContext";

interface CombatGameReturn {
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
  const sceneRef = useRef<CombatScene | null>(null);
  const resourcesStore = useResourcesStore();
  const { gameInstance, activeSceneKey } = useGameContext();
  const [isSceneReady, setIsSceneReady] = useState(false);

  const isAutoShooting = useCombatStore((state) => state.isAutoShooting);
  const isGameOver = useCombatStore((state) => state.isGameOver);
  const isWaveComplete = useCombatStore((state) => state.isWaveComplete);

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

  useEffect(() => {
    if (activeSceneKey !== "CombatScene" || !gameInstance) {
      sceneRef.current = null;
      setIsSceneReady(false);
      return;
    }

    const scene = gameInstance.scene.getScene("CombatScene") as CombatScene;

    if (scene != null) {
      if (scene.scene.isActive()) {
        sceneRef.current = scene;
        setIsSceneReady(true);
        console.log("Combat Scene instance obtained and active in hook.");

        const handleStatsUpdate = (stats: {
          wave: number;
          enemiesRemaining: number;
          enemyHealth: number;
          enemyDamage: number;
          enemySpeed: number;
        }): void => {
          useCombatStore.getState().updateStats({
            wave: stats.wave,
            enemiesRemaining: stats.enemiesRemaining,
            enemyHealth: stats.enemyHealth,
            enemyDamage: stats.enemyDamage,
            enemySpeed: stats.enemySpeed,
          });
        };
        const handleGameOver = (finalScore: number): void => {
          useCombatStore.getState().setGameOver(true);
          useCombatStore.getState().updateStats({ wave: finalScore });
          useCombatStore.getState().setAutoShooting(false);
          if (onGameOver) {
            onGameOver(finalScore);
          }
        };
        const handleAmmoChanged = (ammoAmount: number): void => {
          useCombatStore.getState().updateStats({ ammo: ammoAmount });
        };
        const handleOutOfAmmo = (): void => {
          useCombatStore.getState().updateStats({ ammo: 0 });
          useCombatStore.getState().setAutoShooting(false);
        };
        const handleWaveComplete = (
          waveNumber: number,
          rewards: Record<string, number>,
        ): void => {
          console.log(`Wave ${waveNumber} complete with rewards:`, rewards);
        };
        const handlePlayerHealthChanged = (health: number): void => {
          useCombatStore.getState().updateStats({ playerHealth: health });
        };

        scene.events.on("statsUpdate", handleStatsUpdate);
        scene.events.on("gameOver", handleGameOver);
        scene.events.on("ammoChanged", handleAmmoChanged);
        scene.events.on("outOfAmmo", handleOutOfAmmo);
        scene.events.on("waveComplete", handleWaveComplete);
        scene.events.on("playerHealthChanged", handlePlayerHealthChanged);

        return (): void => {
          console.log("Cleaning up Combat Scene listeners in hook.");
          scene.events.off("statsUpdate", handleStatsUpdate);
          scene.events.off("gameOver", handleGameOver);
          scene.events.off("ammoChanged", handleAmmoChanged);
          scene.events.off("outOfAmmo", handleOutOfAmmo);
          scene.events.off("waveComplete", handleWaveComplete);
          scene.events.off("playerHealthChanged", handlePlayerHealthChanged);
          sceneRef.current = null;
          setIsSceneReady(false);
        };
      } else {
        console.log(
          "Combat Scene found but not active, attaching wake/start listeners.",
        );
        const wakeOrStartListener = (): void => {
          if (gameInstance.scene.isActive("CombatScene")) {
            setIsSceneReady(true);
            sceneRef.current = scene;
            console.log("Combat Scene became active after wait.");
          }
        };
        scene.events.once(Phaser.Scenes.Events.WAKE, wakeOrStartListener);
        scene.events.once(Phaser.Scenes.Events.START, wakeOrStartListener);

        return (): void => {
          console.log("Cleaning up Combat Scene wake/start listeners.");
          scene.events.off(Phaser.Scenes.Events.WAKE, wakeOrStartListener);
          scene.events.off(Phaser.Scenes.Events.START, wakeOrStartListener);
        };
      }
    } else {
      console.warn("Combat Scene not found in the game instance yet.");
      sceneRef.current = null;
      setIsSceneReady(false);
      return;
    }
  }, [activeSceneKey, gameInstance, onGameOver]);

  const handleToggleAutoShoot = useCallback((): void => {
    if (!isAutoShooting && ammo <= 0) {
      return;
    }
    if (sceneRef.current && isSceneReady) {
      sceneRef.current.setAutoShooting(!isAutoShooting);
      useCombatStore.getState().setAutoShooting(!isAutoShooting);
    } else {
      console.warn("Attempted to toggle auto-shoot but scene is not ready.");
    }
  }, [isAutoShooting, ammo, isSceneReady]);

  const handleRetry = useCallback((): void => {
    useCombatStore.getState().resetState();

    useCurrencyStore.getState().resetCash();

    if (sceneRef.current && isSceneReady) {
      sceneRef.current.scene.restart();
      console.log("Requesting Combat Scene restart.");
    } else {
      console.warn("Attempted to retry but scene is not ready.");
    }
  }, [isSceneReady]);

  useEffect(() => {}, [resourcesStore, ammo]);

  return {
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
      damage: 10,
      shootingSpeed: 1,
    },
    cash,
    handleToggleAutoShoot,
    handleRetry,
  };
};
