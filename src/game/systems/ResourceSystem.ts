import { MainScene } from '../scenes/MainScene'
import { useGameState } from '../state/GameState'
import { ResourceEntity } from '../entities.types'

export class ResourceSystem {
  private scene: MainScene
  private gameState = useGameState

  constructor(scene: MainScene) {
    this.scene = scene
  }

  async gatherResource(resourceId: string, gatherId: string) {
    const state = this.gameState.getState()
    const resource = state.entities.get(resourceId) as ResourceEntity | undefined
    const gatherer = state.entities.get(gatherId)
    
    if (!resource || !gatherer) return

    // Move gatherer to resource
    await this.scene.moveEntityTo(gatherId, resource.position.x, resource.position.y)
    
    // Remove resource from game
    this.gameState.getState().removeEntity(resourceId)
    this.scene.removeEntity(resourceId)
    
    // Increment inventory
    this.gameState.getState().incrementResource(resource.resourceType)
  }
} 