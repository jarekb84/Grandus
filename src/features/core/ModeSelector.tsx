"use client";

import { FC } from "react";
import { GameMode } from "@/features/shared/types/GameMode";

interface ModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

const ModeSelector: FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="w-full mb-4">
      <div className="flex gap-2">
        <button
          onClick={() => onModeChange(GameMode.TERRITORY)}
          className={`px-6 py-2 rounded-t-lg ${
            currentMode === GameMode.TERRITORY
              ? "bg-gray-800 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Territory
        </button>
        <button
          onClick={() => onModeChange(GameMode.MANAGEMENT)}
          className={`px-6 py-2 rounded-t-lg ${
            currentMode === GameMode.MANAGEMENT
              ? "bg-gray-800 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Management
        </button>
        <button
          onClick={() => onModeChange(GameMode.COMBAT)}
          className={`px-6 py-2 rounded-t-lg ${
            currentMode === GameMode.COMBAT
              ? "bg-gray-800 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Combat
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;
