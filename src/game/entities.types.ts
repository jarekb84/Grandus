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

export interface EntityProperties {
  size: number
  color: number
  shape: Shape
  spriteKey?: string
}

export enum EntityType {
  RESOURCE = 'RESOURCE',
  BUILDING = 'BUILDING',
  CHARACTER = 'CHARACTER'
}

export enum ResourceType {
  STONE = 'stone',
  WOOD = 'wood',
  FOOD = 'food'
}

export interface GameEntity {
  id: string
  type: EntityType
  position: Position
  properties: EntityProperties
}

export interface ResourceEntity extends GameEntity {
  type: EntityType.RESOURCE
  resourceType: ResourceType
}

export interface CharacterEntity extends GameEntity {
  type: EntityType.CHARACTER
} 