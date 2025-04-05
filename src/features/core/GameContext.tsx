import React, {
  createContext,
  useContext,
  ReactNode,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
// import * as Phaser from 'phaser'; // Remove top-level import
import { GameMode } from "@/features/shared/types/GameMode";
// Remove top-level scene imports to prevent SSR issues
// import { TerritoryScene as BaseTerritoryScene } from '@/features/territory/Territory.scene';
// import { CombatScene as BaseCombatScene } from '@/features/combat/Combat.scene';
import { EntityType } from "@/features/shared/types/entities";
import { useGameState } from "@/features/shared/stores/GameState.store";
import { generateInitialEntities } from "@/features/shared/utils/entityGenerator";
import { useCurrencyStore } from "../shared/stores/Currency.store";
import { WaveRewards } from "../combat/Wave";
// import { ResourceSystem } from '../territory/Resource'; // Adjust path if needed (Removed unused import)
import { useResourcesStore } from "@/features/shared/stores/Resources.store"; // Import resource store
import { ResourceType } from "@/features/shared/types/entities"; // Ensure ResourceType is imported

// Forward declare Phaser type for use in interfaces/refs before dynamic import
type PhaserGameInstance = import("phaser").Game;
// type PhaserScene = import('phaser').Scene; // Generic scene type if needed (Removed unused import)

interface GameContextProps {
  gameInstance: PhaserGameInstance | null; // Use forward declared type
  activeSceneKey: string | null;
  // Allow passing optional data when setting the scene
  setActiveScene: (mode: GameMode, data?: Record<string, unknown>) => void; // Changed any to unknown
  gameContainerRef: React.RefObject<HTMLDivElement | null>; // Allow null
  isInitialized: boolean; // Add initialization status
  currentGameMode: GameMode | null; // Add the centralized game mode state
  // Add methods to interact with scenes if needed, e.g.:
  // toggleCombatAutoShoot: () => void;
  // gatherTerritoryResource: (nodeId: string) => void;
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

// --- Scene Definitions (Moved here for clarity, could be separate) ---

// Placeholder callbacks - These should ideally use an event bus or Zustand actions
const handleEntityInteraction = async (
  entityId: string,
  type: EntityType,
): Promise<void> => {
  console.log("Entity Interaction:", entityId, type);
  // TODO: Implement actual logic, potentially via event bus
  if (type === EntityType.RESOURCE_NODE) {
    // Example: Find ResourceSystem instance on the scene? Or emit event?
    console.warn(
      "Resource gathering interaction needs implementation via event bus or scene reference.",
    );
  }
};
// const handlePlayerHealthChanged = (): void => { console.log("Player health changed"); }; // Removed duplicate/generic
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
}; // TODO: Update Zustand store
const handleAmmoChanged = (ammo: number): void => {
  console.log("Ammo changed:", ammo);
}; // TODO: Update Zustand store
// Removed original handlePlayerHealthChanged
const handleTerritoryHealthUpdate = (health: number): void => {
  console.log("Territory Player health changed:", health);
}; // Renamed
const handleCombatHealthUpdate = (health: number): void => {
  console.log("Combat Player health changed:", health);
}; // Renamed
const handleOutOfAmmo = (): void => {
  console.log("Out of ammo!");
}; // TODO: Update Zustand store

// Handler for resource gathering events from TerritoryScene
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

// Removed commented-out old scene definitions that were causing errors

// --- Provider Component ---

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const gameInstanceRef = useRef<PhaserGameInstance | null>(null); // Use forward declared type
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [activeSceneKey, setActiveSceneKey] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const initialEntitiesRef = useRef<ReturnType<
    typeof generateInitialEntities
  > | null>(null);
  const { addEntity } = useGameState(); // For initial entity population in Territory
  const [currentGameMode, setCurrentGameMode] = useState<GameMode | null>(
    GameMode.TERRITORY,
  );

  // Initialize Phaser Game
  // Effect to dynamically load Phaser and initialize the game
  useEffect(() => {
    if (gameInstanceRef.current || !gameContainerRef.current) return; // Prevent re-initialization

    let game: PhaserGameInstance | null = null;

    const initPhaser = async (): Promise<void> => {
      // Added return type
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
            onPlayerHealthChanged: handleTerritoryHealthUpdate, // Use renamed handler
            onResourceGathered: handleResourceGathered, // Add the resource gathered handler
          });
        }
        override create(): void {
          super.create();
          // Example: Populate initial entities in Territory scene after creation
          const entities = initialEntitiesRef.current;
          if (entities) {
            entities.forEach((entity) => {
              addEntity(entity); // Add to global state
              this.addEntity(entity); // Add to scene state (assuming method exists)
            });
          }
          console.log("Territory Scene Created via Context");
        }
      }

      class ConfiguredCombatScene extends BaseCombatScene {
        // Use aliased base class
        private startData?: { hexId: string };
        constructor() {
          super({
            onWaveComplete: handleWaveComplete,
            onGameOver: handleGameOver,
            onStatsUpdate: handleStatsUpdate,
            onAmmoChanged: handleAmmoChanged,
            onOutOfAmmo: handleOutOfAmmo,
            onPlayerHealthChanged: handleCombatHealthUpdate, // Use renamed handler
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
      // --- End Scene Definitions ---

      // Generate entities only once
      if (!initialEntitiesRef.current) {
        initialEntitiesRef.current = generateInitialEntities();
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: gameContainerRef.current, // Removed non-null assertion (checked on line 97)
        width: 1024,
        height: 768, // Match the container height in GameContent.tsx
        backgroundColor: "#1a202c", // Keep background for visibility if needed, or set transparent
        physics: { default: "arcade" },
        render: {
          // Removed invalid canvasStyle and autoResize properties
          transparent: true, // Good practice for integration
          pixelArt: true, // Assuming pixel art is desired
          antialias: false, // Assuming pixel art is desired
        },
        scene: [ConfiguredTerritoryScene, ConfiguredCombatScene],
      };

      game = new Phaser.Game(config);
      gameInstanceRef.current = game;
      setIsInitialized(true); // Set initialized state after game is created
      console.log("Phaser Game Initialized in Context");
    };

    void initPhaser(); // Added void to handle floating promise

    // Cleanup function
    return (): void => {
      // Added return type
      gameInstanceRef.current?.destroy(true); // Use the ref for cleanup
      gameInstanceRef.current = null;
      // game?.destroy(true); // Or destroy the local variable if ref update is async
      setIsInitialized(false);
      setActiveSceneKey(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Function to switch scenes, now accepts optional data
  // Function to switch scenes and update the current game mode
  const setActiveScene = useCallback(
    (mode: GameMode, data?: Record<string, unknown>) => {
      // Changed any to unknown
      if (!gameInstanceRef.current) return;

      const game = gameInstanceRef.current;
      let targetSceneKey: string | null = null;

      // Determine target scene key
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

      // Stop current Phaser scene if it's different from target or if target is null
      if (activeSceneKey != null && activeSceneKey !== targetSceneKey) {
        // Added explicit null check
        if (game.scene.isActive(activeSceneKey)) {
          console.log(`Stopping scene: ${activeSceneKey}`);
          game.scene.stop(activeSceneKey);
        }
      }

      // Start the target scene if it's not null and not already active
      if (targetSceneKey != null && !game.scene.isActive(targetSceneKey)) {
        // Added explicit null check
        console.log(`Starting scene: ${targetSceneKey}`);
        // Use provided data, or default if necessary (e.g., for direct mode switches without specific data)
        const startData =
          data ??
          (targetSceneKey === "CombatScene"
            ? { hexId: "default-hex-from-context-switch" }
            : undefined);
        // Check if scene exists before starting
        if (game.scene.keys[targetSceneKey]) {
          game.scene.start(targetSceneKey, startData);
        } else {
          console.error(`Scene key "${targetSceneKey}" not found!`);
        }
      } else if (
        targetSceneKey != null &&
        game.scene.isSleeping(targetSceneKey)
      ) {
        // Added explicit null check
        console.log(`Waking scene: ${targetSceneKey}`);
        game.scene.wake(targetSceneKey); // Or wake if scene supports sleeping
      }

      setActiveSceneKey(targetSceneKey);
      // Update the central game mode state
      setCurrentGameMode(mode);
      setActiveSceneKey(targetSceneKey); // This line was already here, just moved for clarity after setCurrentGameMode
    },
    [activeSceneKey],
  ); // Dependency array remains the same

  // Effect to set the initial scene once the game is initialized
  useEffect(() => {
    // Only run if initialized and we have a valid mode selected (should always be TERRITORY initially)
    if (isInitialized && currentGameMode !== null) {
      console.log(
        `GameContext: Initialized. Setting initial scene for mode: ${currentGameMode}`,
      );
      // Call setActiveScene with the initial mode.
      // Pass undefined for data as this is just setting the initial scene based on the default state.
      setActiveScene(currentGameMode, undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]); // Run only when isInitialized changes from false to true

  const value = {
    gameInstance: gameInstanceRef.current,
    activeSceneKey,
    setActiveScene,
    gameContainerRef,
    isInitialized, // Provide initialization status
    currentGameMode, // Provide the current game mode state
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
