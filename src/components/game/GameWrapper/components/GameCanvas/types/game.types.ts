export interface Position {
  x: number
  y: number
}

export type EntityType = 'player' | 'base' | 'stone' | 'wood' | 'enemy' | 'buff'

export interface GameEntity {
  id: string
  x: number
  y: number
  type: EntityType
  size: number
  color: string
  isCarried?: boolean
}

export interface GameState {
  player: GameEntity
  base: GameEntity
  stones: GameEntity[]
  wood: GameEntity[]
  playerCarrying: GameEntity | null
  isAnimating: boolean
}

export interface ResourceEntity extends GameEntity {
  type: 'stone' | 'wood'
}

export interface MovingEntity extends GameEntity {
  speed: number
  targetPosition?: Position
}

export interface CollectibleEntity extends GameEntity {
  onCollect?: () => void
}

export type EntityUpdateFn = (entity: GameEntity, deltaTime: number) => GameEntity
export type EntityRenderFn = (ctx: CanvasRenderingContext2D, entity: GameEntity) => void 