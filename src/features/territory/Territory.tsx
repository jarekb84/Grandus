"use client";

import React, { useCallback } from "react"; // Removed useRef, dynamic
// import type { GameCanvasHandle } from "@/features/game-engine/GameCanvas"; // No longer needed
import TerritoryActions from "./TerritoryActions";
import { useTerritoryAdapter } from "@/features/core/territory/useTerritoryAdapter";
import { useGameContext } from "@/features/core/GameContext"; // Import context
import { GameMode } from "@/features/shared/types/GameMode"; // Import GameMode

// No longer dynamically importing GameCanvas here

export interface TerritoryModeProps {
  // Renamed interface
  className?: string; // Optional className for styling
}

export const TerritoryMode: React.FC<TerritoryModeProps> = ({ className }) => {
  // Renamed component
  // Create local ref for the game canvas
  // const gameCanvasRef = useRef<GameCanvasHandle>(null); // Removed ref
  const { setActiveScene } = useGameContext(); // Get context function

  // Use adapter to connect with territory functionality
  const {
    isGathering,
    hasAvailableNodeType,
    gatherResource,
    // TODO: Refactor useTerritoryAdapter to not require gameCanvasRef
    // It should use GameContext to find the TerritoryScene instance for gathering etc.
    // requestCombatStart, // Removed unused variable
  } = useTerritoryAdapter(/* gameCanvasRef */); // Pass nothing for now, adapter needs update

  // Handler for the combat start button
  const handleStartCombat = useCallback(() => {
    // Use context to switch modes directly
    setActiveScene(GameMode.COMBAT);
    // requestCombatStart("test-hex-1"); // Old method via adapter/ref
  }, [setActiveScene]); // Added missing dependency 'setActiveScene', removed unused 'requestCombatStart'

  return (
    <div
      className={`flex flex-col w-full${typeof className === "string" && className !== "" ? ` ${className}` : ""}`}
    >
      {/* Game canvas area is now managed by GameContent */}
      {/* This component now only renders the UI overlay/controls for Territory */}

      {/* Territory actions below the canvas */}
      <div className="w-full">
        <TerritoryActions // Renamed component
          isGathering={isGathering} // Prop name kept for now, could rename later if needed
          onGather={gatherResource}
          hasAvailableNodeType={hasAvailableNodeType}
          onStartCombat={handleStartCombat} // Pass the handler down
        />
      </div>
    </div>
  );
};

// Export both as named export and default export
export default TerritoryMode; // Renamed default export
