import React, { createContext } from "react";
import { GameMode } from "@/features/shared/types/GameMode";

// Forward declare Phaser type
type PhaserGameInstance = import("phaser").Game;

// Export the interface
export interface GameContextProps {
  gameInstance: PhaserGameInstance | null;
  activeSceneKey: string | null;
  setActiveScene: (mode: GameMode, data?: Record<string, unknown>) => void;
  gameContainerRef: React.RefObject<HTMLDivElement | null>;
  isInitialized: boolean;
  currentGameMode: GameMode | null;
}

// Export the context definition
export const GameContext = createContext<GameContextProps | undefined>(
  undefined,
);
