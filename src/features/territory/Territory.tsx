"use client";

import React, { useRef, useCallback } from "react"; // Added useCallback
import type { GameCanvasHandle } from "@/features/game-engine/GameCanvas";
import TerritoryActions from "./TerritoryActions"; // Renamed import
import { useTerritoryAdapter } from "@/features/core/territory/useTerritoryAdapter"; // Renamed import path and hook
import dynamic from "next/dynamic";

// Import canvas component dynamically to avoid SSR issues
const DynamicGameCanvas = dynamic(
  () =>
    import("@/features/game-engine/GameCanvas").then((mod) => mod.GameCanvas),
  { ssr: false },
);

export interface TerritoryModeProps {
  // Renamed interface
  className?: string; // Optional className for styling
}

export const TerritoryMode: React.FC<TerritoryModeProps> = ({ className }) => {
  // Renamed component
  // Create local ref for the game canvas
  const gameCanvasRef = useRef<GameCanvasHandle>(null);

  // Use adapter to connect with territory functionality
  const {
    isGathering,
    hasAvailableNodeType,
    gatherResource,
    requestCombatStart,
  } = useTerritoryAdapter(gameCanvasRef); // Destructure requestCombatStart // Renamed hook

  // Handler for the combat start button
  const handleStartCombat = useCallback(() => {
    // Pass a placeholder hex ID for now
    requestCombatStart("test-hex-1");
  }, [requestCombatStart]);

  return (
    <div
      className={`flex flex-col w-full${typeof className === "string" && className !== "" ? ` ${className}` : ""}`}
    >
      {/* Game canvas area */}
      <div className="w-full h-[768px]">
        <DynamicGameCanvas ref={gameCanvasRef} />
      </div>

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
