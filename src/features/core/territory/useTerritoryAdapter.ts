import { useState, useCallback, useMemo } from "react";
import {
  ResourceType,  
  EntityType,
  ResourceNodeType,
} from "@/features/shared/types/entities";
import { useGameState } from "@/features/shared/stores/GameState.store";
import { useResourceNodeStore } from "@/features/territory/ResourceNode.store";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";
import { findNearestNode } from "@/features/territory/gatheringUtils";
import { orchestrateGathering } from "@/features/territory/GatheringService";
import { GameMode } from "@/features/shared/types/GameMode";
import { useGameContext } from "@/features/core/useGameContext";
import type { TerritoryScene } from "@/features/territory/Territory.scene";
interface TerritoryAdapter {
  isGathering: boolean;
  gatherResource: (type: ResourceType) => Promise<void>;
  requestCombatStart: (hexId: string) => void;
}

/**
 * Adapter hook for the territory functionality
 * Provides a clean interface for the core feature to interact with territory mechanics
 */
export const useTerritoryAdapter = (): TerritoryAdapter => {
  const [isGathering, setIsGathering] = useState(false);
  const { getEntitiesByType } = useGameState();
  const { getNodeRuntimeState, getResourceNodeIdsOfType } = useResourceNodeStore();
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

      // TODO Fix this
      // if (!hasAvailableNodeType(nodeType)) {
      //   return;
      // }

      const playerPosition = scene.getEntityPosition(playerId);
      if (!playerPosition) {
        console.error(
          `gatherResource: Could not find player entity '${playerId}' in the scene.`,
        );
        return;
      }

      setIsGathering(true);

      const lightweightNodes = getEntitiesByType(EntityType.RESOURCE_NODE);

      // TODO Fix this, the type passed into here has an issue due to ResourceType and ResourceNodeType being different entities
      // this is due to the yeild mechanic which could have a "Stone patch" return stone + some rarer thing like gold
      // you can also have different node sources (ie stone patch, stone quarry, stone pile) that can all get you stone
      // so this needs to be addressed...somehow...later...for now hardcoding it
      const resourceNodesOfType = getResourceNodeIdsOfType(ResourceNodeType.STONE_DEPOSIT)

      if (resourceNodesOfType.length === 0) {         
         setIsGathering(false);
         return;
      }

      const nodePositions = resourceNodesOfType.map(scene.getEntityPosition).filter((pos) => pos !== undefined);
      
      const nearestNode = findNearestNode(
         playerPosition,
         nodePositions,
       );


      if (nearestNode) {        
        try {
          const result = await orchestrateGathering({
            playerId,
            resourceType: type,
            targetNodeId: nearestNode.entityId,
            scene,
          });

          if (result.gathered) {
            addResource(result.resourceType, result.amount);
          }
        } catch (error) {
           console.error("Error during gathering orchestration:", error);
        } finally {
           setIsGathering(false);
        }
      } else {
        setIsGathering(false);
      }
    },
    
    [gameInstance, isGathering, addResource, setActiveScene, getEntitiesByType, getNodeRuntimeState],
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
      gatherResource,
      requestCombatStart,
    }),
    
    [isGathering, gatherResource, requestCombatStart],
  );
};
