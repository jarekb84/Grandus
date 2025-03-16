export interface Position {
  x: number
  y: number
}

export interface EntityProperties {
  size: number
  color: number
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