import { InitialEntityData } from "./initialEntityData";

/**
 * Converts hexagonal coordinates (q, r) to pixel coordinates (x, y).
 * This is a copy of the logic from TerritoryScene to keep this utility pure.
 * @param q The q-coordinate of the hex.
 * @param r The r-coordinate of the hex.
 * @param hexSize The size of the hex (distance from center to corner).
 * @param centerX The pixel x-coordinate of the grid center.
 * @param centerY The pixel y-coordinate of the grid center.
 * @returns The pixel coordinates { x, y } for the center of the hex.
 */
const hexToPixelCoords = (
  q: number,
  r: number,
  hexSize: number,
  centerX: number,
  centerY: number,
): { x: number; y: number } => {
  const x = centerX + hexSize * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const y = centerY + hexSize * ((3 / 2) * r);
  return { x, y };
};

/**
 * Calculates the final pixel position for an entity based on its hex coordinates and pixel offset.
 * This is a pure function, independent of the Phaser scene.
 * @param entityData The initial entity data including hexCoords and hexOffsetPixels.
 * @param hexSize The size of the hex (distance from center to corner).
 * @param centerX The pixel x-coordinate of the grid center.
 * @param centerY The pixel y-coordinate of the grid center.
 * @returns The final pixel coordinates { x, y } for the entity sprite.
 */
export const getPixelPositionForEntity = (
  entityData: InitialEntityData,
  hexSize: number,
  centerX: number,
  centerY: number,
): { x: number; y: number } => {
  const basePixelPos = hexToPixelCoords(
    entityData.hexCoords.q,
    entityData.hexCoords.r,
    hexSize,
    centerX,
    centerY,
  );

  const finalX = basePixelPos.x + entityData.hexOffsetPixels.x;
  const finalY = basePixelPos.y + entityData.hexOffsetPixels.y;

  return { x: finalX, y: finalY };
};
