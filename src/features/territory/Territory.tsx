"use client";

import React, { useCallback } from "react";
import TerritoryActions from "./TerritoryActions";
import { useTerritoryAdapter } from "@/features/core/territory/useTerritoryAdapter";
import { useGameContext } from "@/features/core/GameContext";
import { GameMode } from "@/features/shared/types/GameMode";

export interface TerritoryModeProps {
  className?: string;
}

export const TerritoryMode: React.FC<TerritoryModeProps> = ({ className }) => {
  const { setActiveScene } = useGameContext();

  const { isGathering, hasAvailableNodeType, gatherResource } =
    useTerritoryAdapter();

  const handleStartCombat = useCallback(() => {
    setActiveScene(GameMode.COMBAT);
  }, [setActiveScene]);

  return (
    <div
      className={`flex flex-col w-full${typeof className === "string" && className !== "" ? ` ${className}` : ""}`}
    >
      <div className="w-full">
        <TerritoryActions
          isGathering={isGathering}
          onGather={gatherResource}
          hasAvailableNodeType={hasAvailableNodeType}
          onStartCombat={handleStartCombat}
        />
      </div>
    </div>
  );
};

export default TerritoryMode;
