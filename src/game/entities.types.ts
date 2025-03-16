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
  RESOURCE = 'RESOURCE',
  CHARACTER = 'CHARACTER',
  BUILDING = 'BUILDING'
}

export enum ResourceType {
  STONE = 'STONE',
  WOOD = 'WOOD',
  FOOD = 'FOOD'
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

export interface ResourceEntity extends BaseEntity {
  type: EntityType.RESOURCE
  resourceType: ResourceType
}

export interface CharacterEntity extends BaseEntity {
  type: EntityType.CHARACTER
  health: number
}

export interface BuildingEntity extends BaseEntity {
  type: EntityType.BUILDING
  buildingType: string
}

export type Entity = ResourceEntity | CharacterEntity | BuildingEntity 