import * as Phaser from "phaser";
import { EntityPosition } from "./Territory.scene";
import { ResourceType, ResourceYield } from "../shared/types/entities"; // Added import
/**
 * Finds the nearest resource node of a specific type to a given position.
 * Based on logic originally in Territory.scene.ts::initiateGathering.
 *
 * @param position The position (e.g., player's position) to measure distance from. 
 * @param nodes An array of all potential resource node entities to search through.
 * @returns The nearest node to the player or null if none is found.
 */
export const findNearestNode = (
  position: { x: number; y: number },
  nodes: EntityPosition[]
): EntityPosition | null => {
  let nearestNode: EntityPosition | null = null;
  let minDistance = Infinity;

  nodes.forEach((node) => {        
    const distance = Phaser.Math.Distance.Between(
      position.x,
      position.y,
      node.x,
      node.y,
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestNode = node;
    }
  });

  return nearestNode;
};

/**
 * Calculates the yield amount for a specific resource type based on the node's yield data and multiplier.
 *
 * @param yields The array of possible yields from the node.
 * @param resourceType The specific resource type being gathered.
 * @param yieldMultiplier The multiplier to apply to the base yield amount.
 * @returns The calculated yield amount, defaulting to 1 if the specific yield is not found.
 */
export const calculateYieldAmount = (
  yields: ResourceYield[],
  resourceType: ResourceType,
  yieldMultiplier: number,
): number => {
  const nodeYieldData = yields.find((y) => y.resourceType === resourceType);
  const baseAmount = nodeYieldData ? nodeYieldData.baseAmount : 1; // Default to 1 if not found
  return baseAmount * yieldMultiplier;
};