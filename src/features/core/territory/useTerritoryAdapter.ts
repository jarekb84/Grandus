import { useState, useCallback, useMemo } from "react"; // Removed MutableRefObject
import {
  ResourceType,
  ResourceNodeType,
} from "@/features/shared/types/entities";
import { useGameState } from "@/features/shared/stores/GameState.store";
import { RESOURCE_TO_NODE_TYPE } from "@/features/shared/utils/resourceMapping";
// Removed GameCanvasHandle import
import { GameMode } from "@/features/shared/types/GameMode";
import { useGameContext } from "@/features/core/GameContext"; // Import GameContext
import type { TerritoryScene } from "@/features/territory/Territory.scene"; // Import scene type for casting
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
export const useTerritoryAdapter = (): TerritoryAdapter => {
  // Removed gameCanvasRef parameter
  // Updated return type and removed parameter
  const [isGathering, setIsGathering] = useState(false);
  const { getNodesByType, hasAvailableNodeType } = useGameState();
  const { gameInstance, setActiveScene } = useGameContext(); // Retrieve context values
  const gatherResource = useCallback(
    async (type: ResourceType): Promise<void> => {
      const scene = gameInstance?.scene.getScene("TerritoryScene") as
        | TerritoryScene
        | undefined; // Get scene instance safely

      if (!scene || isGathering) {
        console.warn(
          "TerritoryAdapter: gatherResource called without active Territory scene or while already gathering.",
        );
        return;
      }

      // Get the primary node type for this resource, handle unmappable types (like PEBBLE)
      const nodeType =
        RESOURCE_TO_NODE_TYPE[type as keyof typeof RESOURCE_TO_NODE_TYPE]; // Type assertion
      if (nodeType == null) {
        // Explicit check for null/undefined
        console.warn(
          `TerritoryAdapter: Cannot gather resource type '${type}' as it has no corresponding node type.`,
        );
        return;
      }
      if (!hasAvailableNodeType(nodeType)) {
        console.warn(
          `TerritoryAdapter: No available nodes of type '${nodeType}' to gather resource '${type}'.`,
        );
        return;
      }

      // Get available nodes of this type
      const nodes = getNodesByType(nodeType);
      const firstNode = nodes[0];
      if (firstNode) {
        setIsGathering(true);
        // Removed duplicate setIsGathering(true)
        try {
          // Call the scene method to initiate gathering for the resource type
          void scene.initiateGathering(type); // Handle potential floating promise
          console.log(
            `TerritoryAdapter: Called scene.initiateGathering for type: ${type}`,
          );
        } catch (error) {
          // Log potential errors even with placeholder logic
          console.error(
            `TerritoryAdapter: Error during placeholder gather logic for node ${firstNode.id}:`,
            error,
          );
        } finally {
          setIsGathering(false); // Ensure gathering state is reset
        }
      } else {
        console.warn(
          `TerritoryAdapter: No available node found for resource type '${type}' (node type '${nodeType}').`,
        );
      }
    },
    // Updated dependencies: gameInstance is needed to get the scene
    [gameInstance, isGathering, getNodesByType, hasAvailableNodeType],
  );

  // Function to switch to combat mode, passing the hexId
  const requestCombatStart = useCallback(
    (hexId: string): void => {
      console.log(
        `TerritoryAdapter: Requesting combat start for hex: ${hexId}`,
      );
      // Use setActiveScene from context to switch mode and pass data
      setActiveScene(GameMode.COMBAT, { hexId });
    },
    [setActiveScene], // Dependency is setActiveScene from context
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
    // Updated dependencies for useMemo
    // Updated dependencies for useMemo
    [isGathering, hasAvailableNodeType, gatherResource, requestCombatStart],
  );
};
