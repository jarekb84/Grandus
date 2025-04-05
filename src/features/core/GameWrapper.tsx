"use client";

import React from "react"; // Removed unused useEffect
// Removed unused useState import
import { GameMode } from "@/features/shared/types/GameMode";
import Inventory from "@/features/shared/ui/Inventory";
import ModeSelector from "./ModeSelector";
import GameContent from "./GameContent";
import { useInventoryAdapter } from "./inventory/useInventoryAdapter";
import { GameProvider, useGameContext } from "./GameContext"; // Import Provider

// Inner component to access context after provider is mounted
const GameUI = (): React.ReactElement => {
  // Read the centralized game mode and the scene setter from the context
  const { currentGameMode, setActiveScene } = useGameContext(); // Removed unused isInitialized

  // Use adapter for inventory data only
  const inventoryData = useInventoryAdapter();

  // Removed the useEffect hook that was causing the scene switching conflict.
  // The GameContext now handles setting the initial scene and subsequent scene changes
  // via the setActiveScene function which also updates currentGameMode.

  // Handle mode change by calling the context's setActiveScene directly
  const handleModeChange = (mode: GameMode): void => {
    // Optional: Add data if needed for specific mode transitions, e.g., combat
    // const data = mode === GameMode.COMBAT ? { hexId: 'some-hex-id-from-ui' } : undefined;
    setActiveScene(mode); // No data needed for basic mode switching from UI buttons
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      {/* Mode selection tabs */}
      <div className="w-[1288px]">
        <ModeSelector
          // Use the game mode from the context. Provide a default if null initially.
          currentMode={currentGameMode ?? GameMode.TERRITORY}
          onModeChange={handleModeChange}
        />
      </div>

      {/* Main game area with inventory */}
      <div className="relative flex gap-4">
        {/* Left sidebar with inventory */}
        <div className="w-64">
          <Inventory
            stoneCount={inventoryData.stoneCount}
            woodCount={inventoryData.woodCount}
            foodCount={inventoryData.foodCount}
            pebbleCount={inventoryData.pebbleCount}
          />
        </div>

        {/* Main content area - GameContent will now use the context's ref */}
        {/* Use the game mode from the context. Provide a default if null initially. */}
        <GameContent currentMode={currentGameMode ?? GameMode.TERRITORY} />
      </div>
    </div>
  );
}; // Semicolon belongs here

// Outer component that includes the Provider
const GameWrapper = (): React.ReactElement => {
  return (
    <GameProvider>
      <GameUI />
    </GameProvider>
  );
};

export default GameWrapper;
