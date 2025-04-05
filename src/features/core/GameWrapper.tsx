"use client";

import React from "react";
import { GameMode } from "@/features/shared/types/GameMode";
import Inventory from "@/features/shared/ui/Inventory";
import ModeSelector from "./ModeSelector";
import GameContent from "./GameContent";
import { useInventoryAdapter } from "./inventory/useInventoryAdapter";
import { GameProvider, useGameContext } from "./GameContext";

const GameUI = (): React.ReactElement => {
  const { currentGameMode, setActiveScene } = useGameContext();

  const inventoryData = useInventoryAdapter();

  const handleModeChange = (mode: GameMode): void => {
    setActiveScene(mode);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      <div className="w-[1288px]">
        <ModeSelector
          currentMode={currentGameMode ?? GameMode.TERRITORY}
          onModeChange={handleModeChange}
        />
      </div>

      <div className="relative flex gap-4">
        <div className="w-64">
          <Inventory
            stoneCount={inventoryData.stoneCount}
            woodCount={inventoryData.woodCount}
            foodCount={inventoryData.foodCount}
            pebbleCount={inventoryData.pebbleCount}
          />
        </div>

        <GameContent currentMode={currentGameMode ?? GameMode.TERRITORY} />
      </div>
    </div>
  );
};

const GameWrapper = (): React.ReactElement => {
  return (
    <GameProvider>
      <GameUI />
    </GameProvider>
  );
};

export default GameWrapper;
