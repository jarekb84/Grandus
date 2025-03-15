import { GameEntity, GameState, Position } from '../types/game.types'
import MovementSystem from './MovementSystem'

class ResourceSystem {
  private movementSystem: MovementSystem

  constructor() {
    this.movementSystem = new MovementSystem()
  }

  async gatherResource(
    initialGameState: GameState,
    resourceId: string,
    onStateChange: (state: GameState) => void,
    onComplete?: () => void
  ): Promise<void> {
    if (initialGameState.isAnimating) return

    const resource = this.findResource(initialGameState, resourceId)
    if (!resource) return

    // Create a single state object that we'll update throughout the process
    let currentState: GameState = {
      ...initialGameState,
      isAnimating: true
    }
    onStateChange(currentState)

    try {
      // 1. Move to resource
      currentState = await this.moveEntityTo(
        currentState,
        currentState.player,
        resource,
        onStateChange
      )

      // 2. Wait and pick up
      await this.delay(500)
      currentState = {
        ...currentState,
        playerCarrying: { ...resource },
        stones: resource.type === 'stone' 
          ? currentState.stones.filter(s => s.id !== resource.id)
          : currentState.stones,
        wood: resource.type === 'wood'
          ? currentState.wood.filter(w => w.id !== resource.id)
          : currentState.wood
      }
      onStateChange(currentState)

      // 3. Move to base
      currentState = await this.moveEntityTo(
        currentState,
        currentState.player,
        currentState.base,
        onStateChange
      )

      // 4. Wait and drop
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
    } catch (error) {
      // Reset animation state if something goes wrong
      currentState = {
        ...currentState,
        isAnimating: false
      }
      onStateChange(currentState)
      console.error('Error during resource gathering:', error)
    }
  }

  private findResource(gameState: GameState, resourceId: string): GameEntity | undefined {
    return [...gameState.stones, ...gameState.wood].find(r => r.id === resourceId)
  }

  private async moveEntityTo(
    currentState: GameState,
    entity: GameEntity,
    target: Position,
    onStateChange: (state: GameState) => void
  ): Promise<GameState> {
    let state = { ...currentState }
    let currentEntity = { ...entity }

    while (!this.movementSystem.hasReachedTarget(currentEntity, target)) {
      const newPosition = this.movementSystem.moveTowards(currentEntity, target, 5)
      currentEntity = {
        ...currentEntity,
        x: newPosition.x,
        y: newPosition.y
      }

      state = {
        ...state,
        player: {
          ...state.player,
          x: currentEntity.x,
          y: currentEntity.y
        }
      }
      onStateChange(state)
      
      await this.delay(16)
    }

    return state
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getAvailableResources(gameState: GameState, type: 'stone' | 'wood'): GameEntity[] {
    return type === 'stone' ? gameState.stones : gameState.wood
  }
}

export default ResourceSystem 