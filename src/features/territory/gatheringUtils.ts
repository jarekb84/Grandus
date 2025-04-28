import * as Phaser from "phaser";
import { EntityPosition } from "./Territory.scene";
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