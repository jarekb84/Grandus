export interface Position {
  x: number
  y: number
}

export enum Shape {
  CIRCLE = 'circle',
  SQUARE = 'square',
  // Future shapes can be added here:
  // TRIANGLE = 'triangle',
  // PENTAGON = 'pentagon',
  // etc...
}

export enum EntityType {
  RESOURCE_NODE = 'RESOURCE_NODE',
  CHARACTER = 'CHARACTER',
  BUILDING = 'BUILDING'
}

export enum ResourceType {
  STONE = 'STONE',
  WOOD = 'WOOD',
  FOOD = 'FOOD'
}

export enum ResourceNodeType {
  STONE_DEPOSIT = 'STONE_DEPOSIT',
  IRON_DEPOSIT = 'IRON_DEPOSIT',
  BERRY_BUSH = 'BERRY_BUSH',
  FALLEN_BRANCHES = 'FALLEN_BRANCHES',
  TREE = 'TREE'
}

export interface ResourceYield {
  resourceType: ResourceType
  baseAmount: number
  chance: number // 0-1, represents probability of getting this resource
}

interface BaseEntity {
  id: string
  type: EntityType
  position: {
    x: number
    y: number
  }
  properties: {
    shape: Shape
    size: number
    color: number
  }
}

// TODO add a quantity property somewhere to this node, maybe per yield?
export interface ResourceNodeEntity extends BaseEntity {
  type: EntityType.RESOURCE_NODE
  nodeType: ResourceNodeType
  yields: ResourceYield[]
  gatheringProperties: {
    baseGatherTime: number // in milliseconds
    gatheringSpeedMultiplier: number // multiplier for gathering speed
    yieldMultiplier: number // multiplier for resource amounts
  }
}

export interface CharacterEntity extends BaseEntity {
  type: EntityType.CHARACTER
  health: number
}

export interface BuildingEntity extends BaseEntity {
  type: EntityType.BUILDING
  buildingType: string
}

export type Entity = ResourceNodeEntity | CharacterEntity | BuildingEntity 