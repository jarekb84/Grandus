import { useContext } from "react";
import { GameContext, GameContextProps } from "./gameContextTypes";

export const useGameContext = (): GameContextProps => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
