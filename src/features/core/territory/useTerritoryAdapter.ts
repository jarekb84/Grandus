import { useState, useCallback, MutableRefObject, useMemo } from "react";
import {
  ResourceType,
  ResourceNodeType,
} from "@/features/shared/types/entities";
import { useGameState } from "@/features/shared/stores/GameState.store";
import { RESOURCE_TO_NODE_TYPE } from "@/features/shared/utils/resourceMapping";
import type { GameCanvasHandle } from "@/features/game-engine/GameCanvas";
import { GameMode } from "@/features/shared/types/GameMode";

interface TerritoryAdapter {
  // Renamed interface
  isGathering: boolean; // Keeping prop name for now
  hasAvailableNodeType: (nodeType: ResourceNodeType) => boolean;
  gatherResource: (type: ResourceType) => Promise<void>;
  requestCombatStart: (hexId: string) => void;
}

/**
 * Adapter hook for the territory functionality (formerly gathering)
 * Provides a clean interface for the core feature to interact with territory mechanics
 */
export const useTerritoryAdapter = (
  // Renamed function
  gameCanvasRef: MutableRefObject<GameCanvasHandle | null>,
): TerritoryAdapter => {
  // Updated return type
  const [isGathering, setIsGathering] = useState(false);
  const { getNodesByType, hasAvailableNodeType } = useGameState();

  const gatherResource = useCallback(
    async (type: ResourceType) => {
      if (!gameCanvasRef.current || isGathering) return;

      // Get the primary node type for this resource
      const nodeType = RESOURCE_TO_NODE_TYPE[type];
      if (!hasAvailableNodeType(nodeType)) return;

      // Get available nodes of this type
      const nodes = getNodesByType(nodeType);
      const firstNode = nodes[0];
      if (firstNode) {
        setIsGathering(true);
        try {
          await gameCanvasRef.current.gatherFromNode(firstNode.id);
        } finally {
          setIsGathering(false);
        }
      }
    },
    [gameCanvasRef, isGathering, getNodesByType, hasAvailableNodeType],
  );

  // Placeholder function for starting combat
  const requestCombatStart = useCallback(
    (hexId: string) => {
      // TODO: Implement actual call to game canvas handle or event bus
      console.log(`Requesting combat start for hex: ${hexId}`);
      // Example: gameCanvasRef.current?.requestCombatStart(hexId);
      // For now, just switch mode directly for testing Step 4
      gameCanvasRef.current?.switchMode(GameMode.COMBAT);
    },
    [gameCanvasRef],
  );

  // Return a stable reference to the adapter interface
  // Ensure all functions are included here
  return useMemo(
    () => ({
      isGathering,
      hasAvailableNodeType,
      gatherResource,
      requestCombatStart,
    }),
    [isGathering, hasAvailableNodeType, gatherResource, requestCombatStart],
  );
};
