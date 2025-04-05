import React, {
  createContext,
  useContext,
  ReactNode,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { GameMode } from "@/features/shared/types/GameMode";
import { EntityType } from "@/features/shared/types/entities";
import { useGameState } from "@/features/shared/stores/GameState.store";
import { generateInitialEntities } from "@/features/shared/utils/entityGenerator";
import { useCurrencyStore } from "../shared/stores/Currency.store";
import { WaveRewards } from "../combat/Wave";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";
import { ResourceType } from "@/features/shared/types/entities";

// Forward declare Phaser type for use in interfaces/refs before dynamic import
type PhaserGameInstance = import("phaser").Game;

interface GameContextProps {
  gameInstance: PhaserGameInstance | null;
  activeSceneKey: string | null;
  setActiveScene: (mode: GameMode, data?: Record<string, unknown>) => void;
  gameContainerRef: React.RefObject<HTMLDivElement | null>;
  isInitialized: boolean;
  currentGameMode: GameMode | null;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const useGameContext = (): GameContextProps => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

// Placeholder callbacks - These should ideally use an event bus or Zustand actions
const handleEntityInteraction = async (
  entityId: string,
  type: EntityType,
): Promise<void> => {
  console.log("Entity Interaction:", entityId, type);
  if (type === EntityType.RESOURCE_NODE) {
    console.warn(
      "Resource gathering interaction needs implementation via event bus or scene reference.",
    );
  }
};
const handleWaveComplete = (waveNumber: number, rewards: WaveRewards): void => {
  console.log(`Wave ${waveNumber} complete! Rewards:`, rewards);
};
const handleGameOver = (score: number): void => {
  console.log("Game Over! Score:", score);
  const { resetCash } = useCurrencyStore.getState();
  resetCash();
  // Restarting the scene should be triggered externally based on game state, not directly here.
};
const handleStatsUpdate = (stats: {
  wave: number;
  enemiesRemaining: number;
  enemyHealth: number;
  enemyDamage: number;
  enemySpeed: number;
}): void => {
  console.log("Stats update:", stats);
};
const handleAmmoChanged = (ammo: number): void => {
  console.log("Ammo changed:", ammo);
};
const handleTerritoryHealthUpdate = (health: number): void => {
  console.log("Territory Player health changed:", health);
};
const handleCombatHealthUpdate = (health: number): void => {
  console.log("Combat Player health changed:", health);
};
const handleOutOfAmmo = (): void => {
  console.log("Out of ammo!");
};

const handleResourceGathered = (
  resourceType: ResourceType,
  amount: number,
): void => {
  console.log(
    `Context: Resource gathered - Type: ${resourceType}, Amount: ${amount}`,
  );
  const { addResource } = useResourcesStore.getState();
  addResource(resourceType, amount);
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const gameInstanceRef = useRef<PhaserGameInstance | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [activeSceneKey, setActiveSceneKey] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const initialEntitiesRef = useRef<ReturnType<
    typeof generateInitialEntities
  > | null>(null);
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

      // --- Define Scene Classes INSIDE the async function after Phaser and base scenes are loaded ---
      class ConfiguredTerritoryScene extends BaseTerritoryScene {
        constructor() {
          super({
            onEntityInteraction: handleEntityInteraction,
            onPlayerHealthChanged: handleTerritoryHealthUpdate,
            onResourceGathered: handleResourceGathered,
          });
        }
        override create(): void {
          super.create();
          const entities = initialEntitiesRef.current;
          if (entities) {
            entities.forEach((entity) => {
              addEntity(entity);
              this.addEntity(entity);
            });
          }
          console.log("Territory Scene Created via Context");
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
          const hexId = this.startData?.hexId ?? "default-hex-id";
          console.log("Combat Scene creating with hexId:", hexId);
          super.create();
          this.setAutoShooting(false);
          console.log("Combat Scene Created via Context");
        }
      }

      // Generate entities only once
      if (!initialEntitiesRef.current) {
        initialEntitiesRef.current = generateInitialEntities();
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
      console.log("Phaser Game Initialized in Context");
    };

    void initPhaser();

    return (): void => {
      gameInstanceRef.current?.destroy(true);
      gameInstanceRef.current = null;
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
          console.log(`Stopping scene: ${activeSceneKey}`);
          game.scene.stop(activeSceneKey);
        }
      }

      if (targetSceneKey != null && !game.scene.isActive(targetSceneKey)) {
        console.log(`Starting scene: ${targetSceneKey}`);
        // Use provided data, or default if necessary (e.g., for direct mode switches without specific data)
        const startData =
          data ??
          (targetSceneKey === "CombatScene"
            ? { hexId: "default-hex-from-context-switch" }
            : undefined);
        if (game.scene.keys[targetSceneKey]) {
          game.scene.start(targetSceneKey, startData);
        } else {
          console.error(`Scene key "${targetSceneKey}" not found!`);
        }
      } else if (
        targetSceneKey != null &&
        game.scene.isSleeping(targetSceneKey)
      ) {
        console.log(`Waking scene: ${targetSceneKey}`);
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
      console.log(
        `GameContext: Initialized. Setting initial scene for mode: ${currentGameMode}`,
      );
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
