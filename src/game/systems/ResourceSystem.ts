import { MainScene } from '../scenes/MainScene'
import { useGameState } from '../state/GameState'
import { ResourceEntity, EntityType } from '../entities.types'

export class ResourceSystem {
  private scene: MainScene
  private gameState = useGameState
  private readonly BASE_POSITION = { x: 400, y: 400 } // Base position from entityGenerator

  constructor(scene: MainScene) {
    this.scene = scene
  }

  async gatherResource(resourceId: string, gatherId: string) {
    const state = this.gameState.getState()
    const resource = state.entities.get(resourceId) as ResourceEntity | undefined
    const gatherer = state.entities.get(gatherId)
    
    if (!resource || !gatherer) return

    // Store resource position before removing it
    const resourcePosition = { ...resource.position }

    // Move gatherer to resource
    await this.scene.moveEntityTo(gatherId, resourcePosition.x, resourcePosition.y)
    
    // Remove resource from game
    this.gameState.getState().removeEntity(resourceId)
    this.scene.removeEntity(resourceId)

    // Move gatherer back to base
    await this.scene.moveEntityTo(gatherId, this.BASE_POSITION.x, this.BASE_POSITION.y)
    
    // Only increment inventory after returning to base
    this.gameState.getState().incrementResource(resource.resourceType)
  }
} 