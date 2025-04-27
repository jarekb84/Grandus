export interface Position {
  x: number;
  y: number;
}

export enum Shape {
  CIRCLE = "circle",
  SQUARE = "square",
}

export enum EntityType {
  RESOURCE_NODE = "RESOURCE_NODE",
  CHARACTER = "CHARACTER",
  BUILDING = "BUILDING",
}

export enum ResourceType {
  STONE = "STONE",
  WOOD = "WOOD",
  FOOD = "FOOD",
  PEBBLE = "PEBBLE",
}

export enum ResourceNodeType {
  STONE_DEPOSIT = "STONE_DEPOSIT",
  IRON_DEPOSIT = "IRON_DEPOSIT",
  BERRY_BUSH = "BERRY_BUSH",
  FALLEN_BRANCHES = "FALLEN_BRANCHES",
  TREE = "TREE",
}

export interface ResourceYield {
  resourceType: ResourceType;
  baseAmount: number;
  chance: number;
}

interface BaseEntity {
  id: string;
  type: EntityType;
  position: {
    x: number;
    y: number;
  };
  properties: {
    shape: Shape;
    size: number;
    color: number;
  };
}

export interface ResourceNodeEntity extends BaseEntity {
  type: EntityType.RESOURCE_NODE;
  nodeType: ResourceNodeType;
  yields: ResourceYield[];
  gatheringProperties: {
    baseGatherTime: number;
    gatheringSpeedMultiplier: number;
    yieldMultiplier: number;
  };
  maxCapacity: number;
  currentCapacity: number;
}

export interface CharacterEntity extends BaseEntity {
  type: EntityType.CHARACTER;
  health: number;
}

export interface BuildingEntity extends BaseEntity {
  type: EntityType.BUILDING;
  buildingType: string;
}

export type Entity = ResourceNodeEntity | CharacterEntity | BuildingEntity;
