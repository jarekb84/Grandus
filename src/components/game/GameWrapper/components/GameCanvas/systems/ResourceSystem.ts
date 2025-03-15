import { GameEntity, GameState, Position } from '../types/game.types'
import MovementSystem from './MovementSystem'

class ResourceSystem {
  private movementSystem: MovementSystem

  constructor() {
    this.movementSystem = new MovementSystem()
  }

  async gatherResource(
    gameState: GameState,
    resourceId: string,
    onStateChange: (state: GameState) => void,
    onComplete?: () => void
  ): Promise<void> {
    if (gameState.isAnimating) return

    const resource = this.findResource(gameState, resourceId)
    if (!resource) return

    let currentState = { ...gameState, isAnimating: true }
    onStateChange(currentState)

    // Move to resource
    await this.moveToTarget(currentState.player, resource, currentState, onStateChange)

    // Pick up resource
    await this.delay(500)
    currentState = this.pickupResource(currentState, resource)
    onStateChange(currentState)

    // Return to base
    await this.moveToTarget(currentState.player, currentState.base, currentState, onStateChange)

    // Drop resource at base
    await this.delay(500)
    currentState = {
      ...currentState,
      playerCarrying: null,
      isAnimating: false
    }
    onStateChange(currentState)

    if (onComplete) {
      onComplete()
    }
  }

  private findResource(gameState: GameState, resourceId: string): GameEntity | undefined {
    return [...gameState.stones, ...gameState.wood].find(r => r.id === resourceId)
  }

  private async moveToTarget(
    entity: GameEntity,
    target: Position,
    state: GameState,
    onStateChange: (state: GameState) => void
  ): Promise<void> {
    while (!this.movementSystem.hasReachedTarget(entity, target)) {
      const newPosition = this.movementSystem.moveTowards(entity, target, 5)
      const updatedEntity = this.movementSystem.updatePosition(entity, newPosition)
      
      state = {
        ...state,
        player: updatedEntity
      }
      onStateChange(state)
      
      await this.delay(16)
    }
  }

  private pickupResource(state: GameState, resource: GameEntity): GameState {
    const newState = { ...state }
    
    if (resource.type === 'stone') {
      newState.stones = state.stones.filter(s => s.id !== resource.id)
    } else if (resource.type === 'wood') {
      newState.wood = state.wood.filter(w => w.id !== resource.id)
    }
    
    newState.playerCarrying = resource
    return newState
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getAvailableResources(gameState: GameState, type: 'stone' | 'wood'): GameEntity[] {
    return type === 'stone' ? gameState.stones : gameState.wood
  }
}

export default ResourceSystem 