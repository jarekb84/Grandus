import React, {
  ReactNode,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { GameMode } from "@/features/shared/types/GameMode";
import { EntityType, ResourceNodeEntity, LightweightEntity } from "@/features/shared/types/entities";
import { useGameState } from "@/features/shared/stores/GameState.store";
import { useCurrencyStore } from "../shared/stores/Currency.store";
import { useResourceNodeStore } from "../territory/ResourceNode.store";
import { WaveRewards } from "../combat/Wave";
import { RespawnService } from "../territory/RespawnService";
import { GameContext } from "./gameContextTypes";

// Forward declare Phaser type for use in interfaces/refs before dynamic import
type PhaserGameInstance = import("phaser").Game;

interface GameProviderProps {
  children: ReactNode;
}

// Placeholder callbacks - These should ideally use an event bus or Zustand actions
const handleEntityInteraction = async (
  entityId: string,
  type: EntityType,
): Promise<void> => {
  // Placeholder: Implement resource node interaction logic if needed
  if (type === EntityType.RESOURCE_NODE) {
    // Example: const { triggerGathering } = useGatheringStore.getState(); triggerGathering(entityId);
  }
};
const handleWaveComplete = (
  _waveNumber: number,
  _rewards: WaveRewards,
): void => {};
const handleGameOver = (_score: number): void => {
  const { resetCash } = useCurrencyStore.getState();
  resetCash();
  // Restarting the scene should be triggered externally based on game state, not directly here.
};
const handleStatsUpdate = (_stats: {
  wave: number;
  enemiesRemaining: number;
  enemyHealth: number;
  enemyDamage: number;
  enemySpeed: number;
}): void => {};
const handleAmmoChanged = (_ammo: number): void => {};
const handleTerritoryHealthUpdate = (_health: number): void => {};
const handleCombatHealthUpdate = (_health: number): void => {};
const handleOutOfAmmo = (): void => {};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const gameInstanceRef = useRef<PhaserGameInstance | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [activeSceneKey, setActiveSceneKey] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { addEntity } = useGameState();
  const [currentGameMode, setCurrentGameMode] = useState<GameMode | null>(
    GameMode.TERRITORY,
  );

  useEffect(() => {
    if (gameInstanceRef.current || !gameContainerRef.current) return; // Prevent re-initialization

    let game: PhaserGameInstance | null = null;

    const initPhaser = async (): Promise<void> => {
      const Phaser = await import("phaser");
      // Dynamically import scene files AFTER Phaser is loaded
      const { TerritoryScene: BaseTerritoryScene } = await import(
        "@/features/territory/Territory.scene"
      );
      const { CombatScene: BaseCombatScene } = await import(
        "@/features/combat/Combat.scene"
      );

      const { initialTerritoryEntitiesData } = await import(
        "@/features/territory/initialEntityData"
      );

      const { convertInitialEntityDataToEntity } = await import(
        "@/features/territory/initialEntityConverter"
      );

      // --- Define Scene Classes INSIDE the async function after Phaser and base scenes are loaded ---
      class ConfiguredTerritoryScene extends BaseTerritoryScene {
        constructor() {
          super({
            onEntityInteraction: handleEntityInteraction,
            onPlayerHealthChanged: handleTerritoryHealthUpdate,
          });
        }
        override create(): void {
          super.create();

          // Add initial entities based on defined data using the converter
          const hexSize = this.hexSize;
          const centerX = this.centerX;
          const centerY = this.centerY;

          initialTerritoryEntitiesData.forEach((entityData) => {
            // Use the converter function to get the scene-ready Entity object
            const sceneEntity = convertInitialEntityDataToEntity(
              entityData,
              hexSize,
              centerX,
              centerY,
            );

            const lightweightEntity: LightweightEntity = {
              id: sceneEntity.id,
              type: sceneEntity.type,
            };

            addEntity(lightweightEntity); // Add to global game state

            this.addEntity(
              sceneEntity.id,
              sceneEntity.graphical,
            ); // Add to Phaser scene

            if (sceneEntity.type === EntityType.RESOURCE_NODE) {
              const { initializeNodeState } = useResourceNodeStore.getState();
              const { id, nodeType, mechanics } = sceneEntity as ResourceNodeEntity;
              initializeNodeState(id, nodeType, mechanics);
            }
          });

          // Initial entities are now properly managed through initialTerritoryEntitiesData
        }
      }

      class ConfiguredCombatScene extends BaseCombatScene {
        private startData?: { hexId: string };
        constructor() {
          super({
            onWaveComplete: handleWaveComplete,
            onGameOver: handleGameOver,
            onStatsUpdate: handleStatsUpdate,
            onAmmoChanged: handleAmmoChanged,
            onOutOfAmmo: handleOutOfAmmo,
            onPlayerHealthChanged: handleCombatHealthUpdate,
          });
        }
        override init(data: { hexId: string }): void {
          this.startData = data;
        }
        override create(): void {
          super.create();
          this.setAutoShooting(false);
        }
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: gameContainerRef.current,
        width: 1024,
        height: 768,
        backgroundColor: "#1a202c",
        physics: { default: "arcade" },
        render: {
          transparent: true,
          pixelArt: true,
          antialias: false,
        },
        scene: [ConfiguredTerritoryScene, ConfiguredCombatScene],
      };

      game = new Phaser.Game(config);
      gameInstanceRef.current = game;
      setIsInitialized(true);
    };

    // Initialize services that manage background processes or subscriptions
    const respawnService = new RespawnService();

    void initPhaser();

    return (): void => {
      respawnService.destroy();

      
      gameInstanceRef.current?.destroy(true);
      gameInstanceRef.current = null;
      useResourceNodeStore.getState().resetStore();
      setIsInitialized(false);
      setActiveSceneKey(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setActiveScene = useCallback(
    (mode: GameMode, data?: Record<string, unknown>) => {
      if (!gameInstanceRef.current) return;

      const game = gameInstanceRef.current;
      let targetSceneKey: string | null = null;

      switch (mode) {
        case GameMode.TERRITORY:
          targetSceneKey = "TerritoryScene";
          break;
        case GameMode.COMBAT:
          targetSceneKey = "CombatScene";
          break;
        case GameMode.MANAGEMENT:
          targetSceneKey = null; // No Phaser scene for management
          break;
      }

      if (activeSceneKey != null && activeSceneKey !== targetSceneKey) {
        if (game.scene.isActive(activeSceneKey)) {
          game.scene.stop(activeSceneKey);
        }
      }

      if (targetSceneKey != null && !game.scene.isActive(targetSceneKey)) {
        // Use provided data, or default if necessary (e.g., for direct mode switches without specific data)
        const startData =
          data ??
          (targetSceneKey === "CombatScene"
            ? { hexId: "default-hex-from-context-switch" }
            : undefined);
        if (game.scene.keys[targetSceneKey]) {
          game.scene.start(targetSceneKey, startData);
        }
      } else if (
        targetSceneKey != null &&
        game.scene.isSleeping(targetSceneKey)
      ) {
        game.scene.wake(targetSceneKey);
      }

      setActiveSceneKey(targetSceneKey);
      setCurrentGameMode(mode);
      setActiveSceneKey(targetSceneKey);
    },
    [activeSceneKey],
  );

  useEffect(() => {
    // Only run if initialized and we have a valid mode selected (should always be TERRITORY initially)
    if (isInitialized && currentGameMode !== null) {
      setActiveScene(currentGameMode, undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  const value = {
    gameInstance: gameInstanceRef.current,
    activeSceneKey,
    setActiveScene,
    gameContainerRef,
    isInitialized,
    currentGameMode,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
