import { FC } from "react";
import { GameMode } from "@/features/shared/types/GameMode";
import { ManagementMode } from "@/features/management/Management";
import { useGameContext } from "./useGameContext";
import { TerritoryMode } from "@/features/territory/Territory";
import { CombatMode } from "@/features/combat/Combat";

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
        {currentMode === GameMode.COMBAT && <CombatMode />}
        {currentMode === GameMode.TERRITORY && <TerritoryMode />}
      </div>
    </div>
  );
};

export default GameContent;
