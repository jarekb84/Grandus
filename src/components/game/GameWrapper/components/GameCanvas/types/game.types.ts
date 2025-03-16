/**
 * Represents a game entity in the UI layer.
 * Used for communicating available resources between Phaser scene and React components.
 */
export interface GameEntity {
  id: string
  x: number
  y: number
  type: string
  size: number
  color: string
} 