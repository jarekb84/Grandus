import * as Phaser from "phaser";
import {
  ResourceType,
  ResourceNodeEntity,
  ResourceYield,
} from "@/features/shared/types/entities"; // Assuming ResourceNodeEntity is defined here

/**
 * Finds the nearest resource node of a specific type to a given position.
 * Based on logic originally in Territory.scene.ts::initiateGathering.
 *
 * @param position The position (e.g., player's position) to measure distance from.
 * @param resourceType The type of resource the target node must yield.
 * @param allNodes An array of all potential resource node entities to search through.
 * @returns The nearest ResourceNodeEntity that yields the specified resourceType, or null if none is found.
 */
export const findNearestNodeOfType = (
  position: { x: number; y: number },
  resourceType: ResourceType,
  allNodes: ResourceNodeEntity[],
): ResourceNodeEntity | null => {
  let nearestNode: ResourceNodeEntity | null = null;
  let minDistance = Infinity;

  allNodes.forEach((nodeData) => {
    if (nodeData.type === "RESOURCE_NODE" && nodeData.yields) {
      const yieldsRequiredResource = nodeData.yields.some(
        (yieldInfo: ResourceYield) => yieldInfo.resourceType === resourceType,
      );

      if (yieldsRequiredResource) {
        if (nodeData.position) {
          const distance = Phaser.Math.Distance.Between(
            position.x,
            position.y,
            nodeData.position.x,
            nodeData.position.y,
          );

          if (distance < minDistance) {
            minDistance = distance;
            nearestNode = nodeData;
          }
        }
      }
    }
  });

  return nearestNode;
};
/**
 * Calculates the resource yield from a node based on the requested type.
 * Reflects the current simple behavior observed in Territory.scene.ts (fixed yield).
 *
 * @param nodeData The data of the resource node being gathered from (currently ignored).
 * @param requestedType The type of resource requested.
 * @returns An array containing the yielded resource type(s). Currently fixed to `[requestedType]`.
 */
export const calculateYield = (
  nodeData: ResourceNodeEntity, // Parameter is kept for signature consistency, but ignored for now
  requestedType: ResourceType,
): ResourceType[] => {
  // Current simple implementation: always yields 1 of the requested type.
  return [requestedType];
};
