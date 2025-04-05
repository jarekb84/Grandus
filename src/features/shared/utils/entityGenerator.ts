import { v4 as uuidv4 } from "uuid";
import {
  Entity,
  EntityType,
  ResourceType,
  ResourceNodeType,
  ResourceNodeEntity,
  Shape,
} from "@/features/shared/types/entities";

const RESOURCE_NODE_CONFIGS = {
  [ResourceNodeType.STONE_DEPOSIT]: {
    color: 0x94a3b8,
    size: 16,
    shape: Shape.SQUARE,
    yields: [{ resourceType: ResourceType.STONE, baseAmount: 1, chance: 1 }],
    gatheringProperties: {
      baseGatherTime: 1000,
      gatheringSpeedMultiplier: 1,
      yieldMultiplier: 1,
    },
  },
  [ResourceNodeType.IRON_DEPOSIT]: {
    color: 0x64748b,
    size: 16,
    shape: Shape.SQUARE,
    yields: [
      { resourceType: ResourceType.STONE, baseAmount: 1, chance: 1 },
      { resourceType: ResourceType.STONE, baseAmount: 2, chance: 0.1 },
    ],
    gatheringProperties: {
      baseGatherTime: 1500,
      gatheringSpeedMultiplier: 0.8,
      yieldMultiplier: 1.2,
    },
  },
  [ResourceNodeType.BERRY_BUSH]: {
    color: 0x22c55e,
    size: 12,
    shape: Shape.CIRCLE,
    yields: [{ resourceType: ResourceType.FOOD, baseAmount: 1, chance: 1 }],
    gatheringProperties: {
      baseGatherTime: 800,
      gatheringSpeedMultiplier: 1.2,
      yieldMultiplier: 1,
    },
  },
  [ResourceNodeType.FALLEN_BRANCHES]: {
    color: 0xca8a04,
    size: 10,
    shape: Shape.SQUARE,
    yields: [{ resourceType: ResourceType.WOOD, baseAmount: 1, chance: 1 }],
    gatheringProperties: {
      baseGatherTime: 600,
      gatheringSpeedMultiplier: 1.5,
      yieldMultiplier: 0.8,
    },
  },
  [ResourceNodeType.TREE]: {
    color: 0x854d0e,
    size: 20,
    shape: Shape.CIRCLE,
    yields: [
      { resourceType: ResourceType.WOOD, baseAmount: 2, chance: 1 },
      { resourceType: ResourceType.FOOD, baseAmount: 1, chance: 0.2 },
    ],
    gatheringProperties: {
      baseGatherTime: 2000,
      gatheringSpeedMultiplier: 0.7,
      yieldMultiplier: 1.5,
    },
  },
};

export function generateInitialEntities(): Entity[] {
  const entities: Entity[] = [];

  entities.push({
    id: "player1",
    type: EntityType.CHARACTER,
    health: 100,
    position: { x: 400, y: 300 },
    properties: {
      size: 20,
      color: 0x4ade80,
      shape: Shape.SQUARE,
    },
  });

  entities.push({
    id: "base1",
    type: EntityType.BUILDING,
    buildingType: "base",
    position: { x: 400, y: 400 },
    properties: {
      size: 40,
      color: 0x60a5fa,
      shape: Shape.CIRCLE,
    },
  });

  const nodePositions = {
    [ResourceNodeType.STONE_DEPOSIT]: [
      { x: 200, y: 200 },
      { x: 600, y: 200 },
    ],
    [ResourceNodeType.IRON_DEPOSIT]: [
      { x: 300, y: 500 },
      { x: 500, y: 500 },
    ],
    [ResourceNodeType.BERRY_BUSH]: [
      { x: 100, y: 300 },
      { x: 700, y: 300 },
      { x: 400, y: 600 },
    ],
    [ResourceNodeType.FALLEN_BRANCHES]: [
      { x: 150, y: 150 },
      { x: 650, y: 150 },
    ],
    [ResourceNodeType.TREE]: [
      { x: 250, y: 550 },
      { x: 550, y: 550 },
    ],
  };

  Object.entries(nodePositions).forEach(([nodeType, positions]) => {
    positions.forEach((position) => {
      const config = RESOURCE_NODE_CONFIGS[nodeType as ResourceNodeType];
      entities.push({
        id: uuidv4(),
        type: EntityType.RESOURCE_NODE,
        nodeType: nodeType as ResourceNodeType,
        position,
        properties: {
          size: config.size,
          color: config.color,
          shape: config.shape,
        },
        yields: config.yields,
        gatheringProperties: config.gatheringProperties,
      } as ResourceNodeEntity);
    });
  });

  return entities;
}
