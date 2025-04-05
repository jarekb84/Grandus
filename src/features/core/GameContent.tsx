"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import { GameMode } from "@/features/shared/types/GameMode";
import { ManagementMode } from "@/features/management/Management";
import { useGameContext } from "./GameContext";
const DynamicTerritoryMode = dynamic(
  () =>
    import("@/features/territory/Territory").then((mod) => mod.TerritoryMode),
  { ssr: false },
);

const DynamicCombatMode = dynamic(
  () => import("@/features/combat/Combat").then((mod) => mod.CombatMode),
  { ssr: false },
);

interface GameContentProps {
  currentMode: GameMode;
}

const GameContent: FC<GameContentProps> = ({ currentMode }) => {
  const { gameContainerRef, activeSceneKey } = useGameContext();

  const showPhaserCanvas =
    activeSceneKey === "TerritoryScene" || activeSceneKey === "CombatScene";

  return (
    <div className="relative w-[1024px] h-[768px] bg-gray-800 rounded-lg flex flex-col">
      {" "}
      <div
        ref={gameContainerRef}
        id="phaser-container"
        className={`relative w-full flex-shrink-0 ${showPhaserCanvas ? "block" : "hidden"}`}
      />
      <div className="relative flex-grow flex-shrink min-h-0 p-2">
        {" "}
        {currentMode === GameMode.MANAGEMENT && <ManagementMode />}
        {currentMode === GameMode.COMBAT && <DynamicCombatMode />}
        {currentMode === GameMode.TERRITORY && <DynamicTerritoryMode />}
      </div>
    </div>
  );
};

export default GameContent;
