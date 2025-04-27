import { useState, useCallback, useMemo } from "react";
import {
  ResourceType,
  ResourceNodeType,
} from "@/features/shared/types/entities";
import { useGameState } from "@/features/shared/stores/GameState.store";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";
import { findNearestNodeOfType } from "@/features/territory/gatheringUtils";
import { orchestrateGathering } from "@/features/territory/GatheringService";
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
  const { hasAvailableNodeType } = useGameState();
  const { addResource } = useResourcesStore();
  const { gameInstance, setActiveScene } = useGameContext();

  const gatherResource = useCallback(
    async (type: ResourceType): Promise<void> => {
      const scene = gameInstance?.scene.getScene("TerritoryScene") as
        | TerritoryScene
        | undefined;

      const playerId = "player1";

      if (!scene || isGathering) {
        return;
      }

      const nodeType =
        RESOURCE_TO_NODE_TYPE[type as keyof typeof RESOURCE_TO_NODE_TYPE];
      if (nodeType == null) {
        return;
      }

      if (!hasAvailableNodeType(nodeType)) {
        return;
      }

      const playerPosition = scene.getEntityPosition(playerId);
      if (!playerPosition) {
        console.error(
          `gatherResource: Could not find player entity '${playerId}' in the scene.`,
        );
        return;
      }

      setIsGathering(true);
      try {
        const resourceNodes = scene.getAllResourceNodesData();
        if (!resourceNodes || resourceNodes.length === 0) {
          setIsGathering(false);
          return;
        }

        const nearestNode = findNearestNodeOfType(
          playerPosition,
          type,
          resourceNodes,
        );

        if (nearestNode) {
          const result = await orchestrateGathering({
            playerId,
            resourceType: type,
            targetNode: nearestNode,
            scene,
          });

          if (result.gathered) {
            addResource(result.resourceType, result.amount);
          }
        }
      } catch (error) {
        console.error(
          `Adapter: Error during gatherResource for type ${type}:`,
          error,
        );
      } finally {
        setIsGathering(false);
      }
    },
    [gameInstance, isGathering, addResource, hasAvailableNodeType],
  );

  const requestCombatStart = useCallback(
    (hexId: string): void => {
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
    // Update dependencies for useMemo
    [isGathering, hasAvailableNodeType, gatherResource, requestCombatStart],
  );
};
