import { ResourceType, ResourceNodeEntity } from "../shared/types/entities";
import { TerritoryScene } from "./Territory.scene";
import { useResourceNodeStore } from "./ResourceNode.store";

export type OrchestrationResult =
  | { gathered: true; resourceType: ResourceType; amount: number }
  | { gathered: false };

interface OrchestrateGatheringParams {
  playerId: string;
  resourceType: ResourceType;
  targetNode: ResourceNodeEntity;
  scene: TerritoryScene;
}

/**
 * Orchestrates the gathering sequence: move to node, wait, (trigger scene event), move back.
 */
export const orchestrateGathering = async ({
  playerId,
  resourceType,
  targetNode,
  scene,
}: OrchestrateGatheringParams): Promise<OrchestrationResult> => {
  // Find player and home base entities from the scene context
  // Get player's starting position to ensure player exists, but don't store it for return movement
  const playerExistsCheck = scene.getEntityPosition(playerId);

  // Calculate home base position (hex 0,0) using scene's public method
  const homePosition = scene.hexToPixelCoords(
    0,
    0,
    scene.centerX,
    scene.centerY,
  );

  if (!playerExistsCheck || !targetNode || !homePosition) {
    console.error(
      `GatheringService: Could not find player (ID: ${playerId}), target node (ID: ${targetNode?.id}), or calculate home position.`,
      {
        playerFound: !!playerExistsCheck,
        nodeFound: !!targetNode,
        homePosCalculated: !!homePosition,
      },
    );
    return { gathered: false };
  }

  // Access position correctly from the target node data
  const targetPosition = { x: targetNode.position.x, y: targetNode.position.y };

  const nodeState = useResourceNodeStore
    .getState()
    .getNodeCapacity(targetNode.id);
  if (!nodeState || nodeState.currentCapacity <= 0) {
    return { gathered: false };
  }

  // Move player to the target node - Use correct moveEntityTo signature
  await scene.moveEntityTo(playerId, targetPosition.x, targetPosition.y);

  const gatheringDuration = 1000; // milliseconds
  const nodeYield = targetNode.yields.find(
    (y) => y.resourceType === resourceType,
  );
  const yieldAmount = nodeYield ? nodeYield.baseAmount : 1;

  // Wait for the gathering duration using Phaser's timer
  await new Promise((resolve) =>
    scene.time.delayedCall(gatheringDuration, resolve),
  );

  useResourceNodeStore
    .getState()
    .decrementNodeCapacity(targetNode.id, yieldAmount);

  const updatedNodeState = useResourceNodeStore
    .getState()
    .getNodeCapacity(targetNode.id);
  if (
    updatedNodeState &&
    updatedNodeState.currentCapacity < updatedNodeState.maxCapacity &&
    !updatedNodeState.isRespawning
  ) {
    const duration = targetNode.respawnDuration;

    useResourceNodeStore.getState().startRespawn(targetNode.id, duration);
  }

  // Move player to home base
  await scene.moveEntityTo(playerId, homePosition.x, homePosition.y);

  return { gathered: true, resourceType: resourceType, amount: yieldAmount };
};
