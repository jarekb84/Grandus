"use client";

import React from "react";
import { useState } from "react";
import { GameMode } from "@/features/shared/types/GameMode";
import Inventory from "@/features/shared/ui/Inventory";
import ModeSelector from "./ModeSelector";
import GameContent from "./GameContent";
import { useInventoryAdapter } from "./inventory/useInventoryAdapter";

const GameWrapper = (): React.ReactElement => {
  const [currentMode, setCurrentMode] = useState<GameMode>(GameMode.TERRITORY);

  // Use adapter for inventory data only
  const inventoryData = useInventoryAdapter();

  const handleModeChange = (mode: GameMode): void => {
    setCurrentMode(mode);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      {/* Mode selection tabs */}
      <div className="w-[1288px]">
        <ModeSelector
          currentMode={currentMode}
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

        {/* Main content area */}
        <GameContent currentMode={currentMode} />
      </div>
    </div>
  );
};

export default GameWrapper;
