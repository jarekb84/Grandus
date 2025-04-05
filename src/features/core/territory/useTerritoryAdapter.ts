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

      const nodes = getNodesByType(nodeType);
      const firstNode = nodes[0];
      if (firstNode) {
        setIsGathering(true);
        try {
          void scene.initiateGathering(type);
        } catch {
          // TODO: Implement error handling for gather initiation failure
        } finally {
          setIsGathering(false);
        }
      } else {
        // No available node found, could log or provide feedback
      }
    },
    [gameInstance, isGathering, getNodesByType, hasAvailableNodeType],
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
    [isGathering, hasAvailableNodeType, gatherResource, requestCombatStart],
  );
};
