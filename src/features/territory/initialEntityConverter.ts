import {
  Entity,
  EntityType,
  ResourceNodeType,
  BuildingEntity,
  ResourceNodeEntity,
  CharacterEntity,
} from "@/features/shared/types/entities";
import { InitialEntityData } from "./initialEntityData";
import { getPixelPositionForEntity } from "./territoryUtils";

/**
 * Converts initial entity data into a scene-ready Entity object.
 * Calculates pixel position and sets initial runtime properties.
 * @param initialData The initial entity data.
 * @param hexSize The size of the hex in pixels.
 * @param centerX The x-coordinate of the scene center.
 * @param centerY The y-coordinate of the scene center.
 * @returns A scene-ready Entity object.
 */
export const convertInitialEntityDataToEntity = (
  initialData: InitialEntityData,
  hexSize: number,
  centerX: number,
  centerY: number,
): Entity => {
  const pixelPosition = getPixelPositionForEntity(
    initialData,
    hexSize,
    centerX,
    centerY,
  );

  // Convert to the appropriate entity type
  switch (initialData.type) {
    case EntityType.BUILDING:
      return {
        id: initialData.id,
        type: EntityType.BUILDING,
        position: pixelPosition,
        properties: initialData.properties,
        buildingType: initialData.properties.buildingType || "placeholder",
      } as BuildingEntity;

    case EntityType.RESOURCE_NODE:
      return {
        id: initialData.id,
        type: EntityType.RESOURCE_NODE,
        position: pixelPosition,
        properties: initialData.properties,
        nodeType:
          initialData.properties.nodeType || ResourceNodeType.STONE_DEPOSIT,
        yields: initialData.properties.yields || [],
        gatheringProperties: {
          baseGatherTime: 1,
          gatheringSpeedMultiplier: 1,
          yieldMultiplier: 1,
        },
      } as ResourceNodeEntity;

    case EntityType.CHARACTER:
      return {
        id: initialData.id,
        type: EntityType.CHARACTER,
        position: pixelPosition,
        properties: initialData.properties,
        health: 100,
      } as CharacterEntity;
  }
  throw new Error(`Unknown entity type during conversion: ${initialData.type}`);
};
