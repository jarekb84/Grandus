import { Position, GameEntity } from '../types/game.types'

class MovementSystem {
  moveTowards(current: Position, target: Position, speed: number): Position {
    const dx = target.x - current.x
    const dy = target.y - current.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < speed) {
      return target
    }
    
    const ratio = speed / distance
    return {
      x: current.x + dx * ratio,
      y: current.y + dy * ratio
    }
  }

  hasReachedTarget(entity: GameEntity, target: Position, threshold: number = 5): boolean {
    return Math.abs(entity.x - target.x) <= threshold && 
           Math.abs(entity.y - target.y) <= threshold
  }

  updatePosition(entity: GameEntity, newPosition: Position): GameEntity {
    return {
      ...entity,
      x: newPosition.x,
      y: newPosition.y
    }
  }
}

export default MovementSystem 