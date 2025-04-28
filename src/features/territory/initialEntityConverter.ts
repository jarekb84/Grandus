import {
  Entity,
  EntityType,
  ResourceNodeType,
  BuildingEntity,
  ResourceNodeEntity,
  CharacterEntity,
  NodeCapacity,
  NodeGatheringMechanics,
  NodeRespawnMechanics,
  ResourceNodeMechanics,
  GraphicalProperties,
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
  const graphical: GraphicalProperties = {
    position: pixelPosition,
    shape: initialData.properties.graphical.shape,
    size: initialData.properties.graphical.size,
    color: initialData.properties.graphical.color,
    depth: initialData.properties.graphical.depth,
  };

  switch (initialData.type) {
    case EntityType.BUILDING:
      return {
        id: initialData.id,
        type: EntityType.BUILDING,
        graphical: graphical,
        buildingType: initialData.properties.buildingType || "placeholder",
      } as BuildingEntity;

    case EntityType.RESOURCE_NODE: {
      const maxCap = initialData.properties.maxCapacity ?? 1;
      const currentCap = initialData.properties.currentCapacity ?? maxCap;
      const baseGatherMs = initialData.properties.baseGatherTimeMs ?? 1000;
      const gatherMultiplier =
        initialData.properties.gatheringSpeedMultiplier ?? 1;
      const yieldMult = initialData.properties.yieldMultiplier ?? 1;
      const respawnMs = initialData.properties.respawnDurationMs ?? 5000;
      const respawnInc = initialData.properties.respawnCapacityIncrement ?? 1;

      // Create nested structures
      const capacity: NodeCapacity = { current: currentCap, max: maxCap };
      const gathering: NodeGatheringMechanics = {
        durationBaseMs: baseGatherMs,
        durationMultiplier: gatherMultiplier,
        yieldMultiplier: yieldMult,
      };
      const respawn: NodeRespawnMechanics = {
        cycleDurationMs: respawnMs,
        amountPerCycle: respawnInc,
      };

      // Create parent mechanics object
      const mechanics: ResourceNodeMechanics = {
        capacity,
        gathering,
        respawn,
      };

      return {
        id: initialData.id,
        type: EntityType.RESOURCE_NODE,
        graphical: graphical,
        nodeType:
          initialData.properties.nodeType || ResourceNodeType.STONE_DEPOSIT,
        yields: initialData.properties.yields || [],
        mechanics: mechanics,
      } as ResourceNodeEntity;
    }

    case EntityType.CHARACTER:
      return {
        id: initialData.id,
        type: EntityType.CHARACTER,
        graphical: graphical,
        health: 100,
      } as CharacterEntity;
  }
};
