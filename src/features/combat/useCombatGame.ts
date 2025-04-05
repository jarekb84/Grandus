import { useCallback, useEffect, useRef, useState } from "react";
import { useCombatStore } from "@/features/combat/Combat.store";
// import * as Phaser from "phaser"; // No longer creating game instance here
import { CombatScene } from "@/features/combat/Combat.scene"; // Keep scene type import
import { useCurrencyStore } from "@/features/shared/stores/Currency.store";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";
// import { ResourceType } from "@/features/shared/types/entities"; // Removed unused import
import { useGameContext } from "@/features/core/GameContext"; // Import game context
interface CombatGameReturn {
  // gameRef: React.RefObject<HTMLDivElement | null>; // No longer needed, container managed by context
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
  // const gameRef = useRef<HTMLDivElement | null>(null); // Removed
  const sceneRef = useRef<CombatScene | null>(null); // Keep ref to interact with the scene instance
  const resourcesStore = useResourcesStore();
  const { gameInstance, activeSceneKey } = useGameContext(); // Get game instance and active scene key
  const [isSceneReady, setIsSceneReady] = useState(false); // Track if the scene is ready

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

  // Effect to get the scene instance and attach listeners when it's ready
  useEffect(() => {
    if (activeSceneKey !== "CombatScene" || !gameInstance) {
      sceneRef.current = null; // Reset scene ref if not active
      setIsSceneReady(false);
      return;
    }

    const scene = gameInstance.scene.getScene("CombatScene") as CombatScene;

    if (scene != null) {
      // Scene found (Explicit null check for strict-boolean-expressions)
      if (scene.scene.isActive()) {
        // Scene found and active
        sceneRef.current = scene;
        setIsSceneReady(true);
        console.log("Combat Scene instance obtained and active in hook.");

        // --- Attach event listeners to the existing scene ---
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
          // Assuming rewards is an object mapping string keys to numbers
          console.log(`Wave ${waveNumber} complete with rewards:`, rewards);
        };
        const handlePlayerHealthChanged = (health: number): void => {
          useCombatStore.getState().updateStats({ playerHealth: health });
        };

        // Use scene events emitter
        scene.events.on("statsUpdate", handleStatsUpdate);
        scene.events.on("gameOver", handleGameOver);
        scene.events.on("ammoChanged", handleAmmoChanged);
        scene.events.on("outOfAmmo", handleOutOfAmmo);
        scene.events.on("waveComplete", handleWaveComplete);
        scene.events.on("playerHealthChanged", handlePlayerHealthChanged);

        // Cleanup listeners on unmount or when scene changes
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
        // Scene found but not active
        // Scene exists but isn't active/ready yet, wait for it
        console.log(
          "Combat Scene found but not active, attaching wake/start listeners.",
        );
        const wakeOrStartListener = (): void => {
          // Check again inside the listener in case the scene becomes active
          // between the initial check and the event firing.
          if (gameInstance.scene.isActive("CombatScene")) {
            setIsSceneReady(true);
            sceneRef.current = scene; // Assign scene ref here
            console.log("Combat Scene became active after wait.");
            // No need to re-run effect, state change (isSceneReady) will trigger it.
          }
        };
        scene.events.once(Phaser.Scenes.Events.WAKE, wakeOrStartListener);
        scene.events.once(Phaser.Scenes.Events.START, wakeOrStartListener); // Or START if it's started, not woken

        // Return cleanup for the wake/start listeners
        return (): void => {
          console.log("Cleaning up Combat Scene wake/start listeners.");
          scene.events.off(Phaser.Scenes.Events.WAKE, wakeOrStartListener);
          scene.events.off(Phaser.Scenes.Events.START, wakeOrStartListener);
        };
      }
    } else {
      // Scene not found
      // Scene not found, nothing to set up or clean up initially
      console.warn("Combat Scene not found in the game instance yet.");
      sceneRef.current = null; // Ensure ref is null if scene not found
      setIsSceneReady(false); // Ensure ready state is false
      return; // Explicitly return undefined for this path
    }
  }, [activeSceneKey, gameInstance, onGameOver]);

  const handleToggleAutoShoot = useCallback((): void => {
    // Only allow auto-shooting if player has ammo
    if (!isAutoShooting && ammo <= 0) {
      return; // Don't enable shooting if out of ammo
    }
    // Ensure scene is ready before interacting
    if (sceneRef.current && isSceneReady) {
      sceneRef.current.setAutoShooting(!isAutoShooting);
      useCombatStore.getState().setAutoShooting(!isAutoShooting); // Update store as well
    } else {
      console.warn("Attempted to toggle auto-shoot but scene is not ready.");
    }
  }, [isAutoShooting, ammo, isSceneReady]); // Add isSceneReady dependency

  const handleRetry = useCallback((): void => {
    useCombatStore.getState().resetState();

    // Reset cash to 0 for new run
    useCurrencyStore.getState().resetCash();

    // Reset the scene via the scene instance
    if (sceneRef.current && isSceneReady) {
      sceneRef.current.scene.restart(); // Trigger restart on the scene itself
      // No need to handle cash reset here if scene does it internally on restart/create
      console.log("Requesting Combat Scene restart.");
    } else {
      console.warn("Attempted to retry but scene is not ready.");
    }
  }, [isSceneReady]); // Add isSceneReady dependency

  // Sync ammo with PEBBLE count
  useEffect(() => {
    // const pebbleCount = resourcesStore.getResource(ResourceType.PEBBLE); // Get Pebble count (Removed unused variable)
    // Sync ammo with store - Scene might emit events, or we can sync here
    // Let's rely on scene events for ammo changes for now.
    // If direct sync is needed:
    // if (isSceneReady && sceneRef.current && pebbleCount !== ammo) {
    //    useCombatStore.getState().updateStats({ ammo: pebbleCount });
    //    // Maybe tell the scene? sceneRef.current.setAmmo(pebbleCount); // If such method exists
    // }
  }, [resourcesStore, ammo]); // Dependency remains ammo to react to store changes

  return {
    // gameRef, // Removed
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
