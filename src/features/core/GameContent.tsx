"use client";

import { FC } from "react"; // Removed unused useMemo, useRef
import dynamic from "next/dynamic";
import { GameMode } from "@/features/shared/types/GameMode";
import { ManagementMode } from "@/features/management/Management"; // Assuming this exists and is correct
import { useGameContext } from "./GameContext"; // Import context hook
// Import components directly with dynamic
const DynamicTerritoryMode = dynamic(
  () =>
    import("@/features/territory/Territory").then((mod) => mod.TerritoryMode), // Ensure TerritoryMode exists and is exported
  { ssr: false },
);

const DynamicCombatMode = dynamic(
  () => import("@/features/combat/Combat").then((mod) => mod.CombatMode), // Ensure CombatMode exists and is exported
  { ssr: false },
);

interface GameContentProps {
  currentMode: GameMode;
}

const GameContent: FC<GameContentProps> = ({ currentMode }) => {
  const { gameContainerRef, activeSceneKey } = useGameContext(); // Get ref and active scene
  // Removed unused useMemo block as rendering is now direct

  // Render the Phaser container only if a Phaser scene is active
  const showPhaserCanvas =
    activeSceneKey === "TerritoryScene" || activeSceneKey === "CombatScene";

  return (
    <div className="relative w-[1024px] h-[768px] bg-gray-800 rounded-lg flex flex-col">
      {" "}
      {/* Add relative positioning context */}
      {/* Phaser Canvas Container */}
      <div
        ref={gameContainerRef}
        id="phaser-container"
        className={`relative w-full flex-shrink-0 ${showPhaserCanvas ? "block" : "hidden"}`} // Ensure relative positioning
      />
      {/* React UI Content */}
      {/* This div will now be below the canvas (if shown) and take remaining space */}
      {/* Added min-h-0 for correct flex sizing and overflow-y-auto for safety */}
      <div className="relative flex-grow flex-shrink min-h-0 p-2">
        {" "}
        {/* Ensure relative positioning */}
        {/* Render the specific UI for the current mode */}
        {currentMode === GameMode.MANAGEMENT && <ManagementMode />}
        {currentMode === GameMode.COMBAT && <DynamicCombatMode />}
        {currentMode === GameMode.TERRITORY && <DynamicTerritoryMode />}
      </div>
    </div>
  );
};

export default GameContent;
