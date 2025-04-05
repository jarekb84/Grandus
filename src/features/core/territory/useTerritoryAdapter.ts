import { useState, useCallback, useMemo } from "react";
import {
  ResourceType,
  ResourceNodeType,
} from "@/features/shared/types/entities";
import { useGameState } from "@/features/shared/stores/GameState.store";
import { RESOURCE_TO_NODE_TYPE } from "@/features/shared/utils/resourceMapping";
import { GameMode } from "@/features/shared/types/GameMode";
import { useGameContext } from "@/features/core/useGameContext";
import type { TerritoryScene } from "@/features/territory/Territory.scene";
interface TerritoryAdapter {
  isGathering: boolean;
  hasAvailableNodeType: (nodeType: ResourceNodeType) => boolean;
  gatherResource: (type: ResourceType) => Promise<void>;
  requestCombatStart: (hexId: string) => void;
}

/**
 * Adapter hook for the territory functionality (formerly gathering)
 * Provides a clean interface for the core feature to interact with territory mechanics
 */
export const useTerritoryAdapter = (): TerritoryAdapter => {
  const [isGathering, setIsGathering] = useState(false);
  const { getNodesByType, hasAvailableNodeType } = useGameState();
  const { gameInstance, setActiveScene } = useGameContext();
  const gatherResource = useCallback(
    async (type: ResourceType): Promise<void> => {
      const scene = gameInstance?.scene.getScene("TerritoryScene") as
        | TerritoryScene
        | undefined;

      if (!scene || isGathering) {
        console.warn(
          "TerritoryAdapter: gatherResource called without active Territory scene or while already gathering.",
        );
        return;
      }

      const nodeType =
        RESOURCE_TO_NODE_TYPE[type as keyof typeof RESOURCE_TO_NODE_TYPE];
      if (nodeType == null) {
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

      const nodes = getNodesByType(nodeType);
      const firstNode = nodes[0];
      if (firstNode) {
        setIsGathering(true);
        try {
          void scene.initiateGathering(type);
          console.log(
            `TerritoryAdapter: Called scene.initiateGathering for type: ${type}`,
          );
        } catch (error) {
          console.error(
            `TerritoryAdapter: Error during placeholder gather logic for node ${firstNode.id}:`,
            error,
          );
        } finally {
          setIsGathering(false);
        }
      } else {
        console.warn(
          `TerritoryAdapter: No available node found for resource type '${type}' (node type '${nodeType}').`,
        );
      }
    },
    [gameInstance, isGathering, getNodesByType, hasAvailableNodeType],
  );

  const requestCombatStart = useCallback(
    (hexId: string): void => {
      console.log(
        `TerritoryAdapter: Requesting combat start for hex: ${hexId}`,
      );
      setActiveScene(GameMode.COMBAT, { hexId });
    },
    [setActiveScene],
  );

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
