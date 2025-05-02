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

export interface GraphicalProperties {
  position: Position;
  shape: Shape;
  size: number;
  color: number;
  depth: number; // similar to css z-index
}

interface BaseEntity {
  id: string;
  type: EntityType;
  graphical: GraphicalProperties;
}

export interface NodeCapacity {
  current: number;
  max: number;
}

export interface NodeGatheringMechanics {
  durationBaseMs: number;
  durationMultiplier: number;
  yieldMultiplier: number;
  yields: ResourceYield[];
}

export interface NodeRespawnMechanics {
    cycleDurationMs: number;
    amountPerCycle: number;
    isRespawning: boolean;
    respawnEndTime: number | null;
}

export interface ResourceNodeMechanics {
  capacity: NodeCapacity;
  gathering: NodeGatheringMechanics;
  respawn: NodeRespawnMechanics;
}

export interface ResourceNodeEntity extends BaseEntity {
  type: EntityType.RESOURCE_NODE;
  nodeType: ResourceNodeType;
  mechanics: ResourceNodeMechanics;
}

export interface CharacterEntity extends BaseEntity {
  type: EntityType.CHARACTER;
  health: number;
}

export interface BuildingEntity extends BaseEntity {
  type: EntityType.BUILDING;
  buildingType: string;
}

export interface LightweightEntity {
  id: string;
  type: EntityType;
}
export type Entity = ResourceNodeEntity | CharacterEntity | BuildingEntity;
