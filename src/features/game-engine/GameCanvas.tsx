import { forwardRef, useRef } from "react";
export interface GameCanvasProps {
  className?: string;
}

const GameCanvas = forwardRef<unknown, GameCanvasProps>((props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${props.className ?? ""}`}
      id="game-canvas-component"
    />
  );
});

GameCanvas.displayName = "GameCanvas";

export { GameCanvas };
export default GameCanvas;
