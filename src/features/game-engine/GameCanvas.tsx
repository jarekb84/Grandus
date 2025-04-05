"use client";

import { forwardRef, useRef } from "react"; // Removed useEffect, useImperativeHandle (temporarily)
// Removed Phaser, Scene imports, store imports etc. as they are handled in context or components now
// Removed unused GameMode import
export interface GameCanvasProps {
  className?: string;
}

// Removed GameCanvasHandle as handle logic is commented out/moved

// Updated forwardRef signature: no handle exposed (unknown), props remain
const GameCanvas = forwardRef<unknown, GameCanvasProps>((props) => {
  // Removed unused _ref argument
  const containerRef = useRef<HTMLDivElement>(null); // This ref might become unused if GameContent handles the container via context
  // Removed gameRef, sceneRef, systemsRef, initialEntitiesRef, addEntity - Managed by context now

  /*
    // TODO: Refactor or remove handle logic
    useImperativeHandle(ref, () => ({
      gatherFromNode: async (nodeId: string): Promise<void> => {
        // Needs access to the active scene instance from context
        console.warn("gatherFromNode needs refactoring with GameContext");
        // Example: const game = gameContext.gameInstance;
        // const scene = game?.scene.getScene(gameContext.activeSceneKey) as TerritoryScene;
        // await scene?.systems.resource.gatherResource(nodeId, "player1");
      },
      switchMode: (mode: GameMode): void => {
         // This is now handled by gameContext.setActiveScene(mode) in GameWrapper
         console.warn("switchMode called on GameCanvas handle, but should use GameContext.setActiveScene");
      },
    }));
    */
  // No useEffect for game creation anymore - handled by GameProvider

  return (
    <div
      ref={containerRef} // This ref might be unused now
      className={`w-full h-full ${props.className ?? ""}`} // Styling might still be relevant if used
      id="game-canvas-component" // Add ID for clarity if needed
    />
  );
});

GameCanvas.displayName = "GameCanvas";

export { GameCanvas };
export default GameCanvas;
