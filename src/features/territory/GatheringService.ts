import { ResourceType } from "../shared/types/entities"; // Remove ResourceNodeEntity import if no longer needed directly
import { TerritoryScene } from "./Territory.scene";
import { useResourceNodeStore } from "./ResourceNode.store";

export type OrchestrationResult =
  | { gathered: true; resourceType: ResourceType; amount: number }
  | { gathered: false };

interface OrchestrateGatheringParams {
  playerId: string;
  resourceType: ResourceType;
  targetNodeId: string;
  scene: TerritoryScene;
}

/**
 * Orchestrates the gathering sequence: move to node, wait, (trigger scene event), move back.
 */
export const orchestrateGathering = async ({
  playerId,
  resourceType,
  targetNodeId,
  scene,
}: OrchestrateGatheringParams): Promise<OrchestrationResult> => {
  // Find player and home base entities from the scene context
  // Get player's starting position to ensure player exists, but don't store it for return movement
  const playerExistsCheck = scene.getEntityPosition(playerId);

  if (!playerExistsCheck) {
    console.error(`GatheringService: Could not find player (ID: ${playerId})`);
    return { gathered: false };
  }

  const nodeState = useResourceNodeStore
    .getState()
    .getNodeRuntimeState(targetNodeId);

  // Check if node exists in the runtime store and has capacity
  if (!nodeState || nodeState.mechanics.capacity.current <= 0) {
     console.warn(`GatheringService: Target node (ID: ${targetNodeId}) not found in store or has no capacity.`);
    return { gathered: false };
  }

  // Move player to the target node
  await scene.moveEntityTo(playerId, targetNodeId);

  // Calculate gathering duration and yield based on the fetched nodeState
  const gatheringDuration =
    nodeState.mechanics.gathering.durationBaseMs / // Start with base duration
    nodeState.mechanics.gathering.durationMultiplier; // Divide by multiplier
  const nodeYieldData = nodeState.yields.find(
    (y) => y.resourceType === resourceType,
  );
  // Apply yield multiplier to the base amount
  const yieldAmount = nodeYieldData
    ? nodeYieldData.baseAmount * nodeState.mechanics.gathering.yieldMultiplier
    : 1; // Default to 1 if no yield found

  // Wait for the gathering duration using Phaser's timer
  await new Promise((resolve) =>
    scene.time.delayedCall(gatheringDuration, resolve),
  );

  useResourceNodeStore
    .getState()
    .decrementNodeCapacity(targetNodeId, yieldAmount);

  // Re-fetch the state to check if respawn should start
  const updatedNodeState = useResourceNodeStore
    .getState()
    .getNodeRuntimeState(targetNodeId);

  if (
    updatedNodeState &&
    updatedNodeState.mechanics.capacity.current < updatedNodeState.mechanics.capacity.max &&
    !updatedNodeState.isRespawning
  ) {

    useResourceNodeStore.getState().startRespawn(targetNodeId);
  }

  // Move player back to home base
  // TODO Fix this to reference home base id that is not hardcoded
  await scene.moveEntityTo(playerId, 'base1');

  return { gathered: true, resourceType: resourceType, amount: yieldAmount };
};
