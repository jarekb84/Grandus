import { GatheringScene } from '../scenes/GatheringScene'
import { useGameState } from '../state/GameState'
import { ResourceNodeEntity, ResourceType } from '../entities.types'

export class ResourceSystem {
  private scene: GatheringScene
  private gameState = useGameState
  private readonly BASE_POSITION = { x: 400, y: 400 } // Base position from entityGenerator

  constructor(scene: GatheringScene) {
    this.scene = scene
  }

  private calculateResourceYields(node: ResourceNodeEntity): ResourceType[] {
    const yields: ResourceType[] = []
    
    node.yields.forEach(resourceYield => {
      // Apply yield multiplier to chance
      const effectiveChance = resourceYield.chance * node.gatheringProperties.yieldMultiplier
      
      // TODO this right now rolls if you can gathger the resrouce or not, but it should roll how much you get as well

      // Roll for each potential resource yield
      for (let i = 0; i < resourceYield.baseAmount; i++) {
        if (Math.random() < effectiveChance) {
          yields.push(resourceYield.resourceType)
        }
      }
    })

    return yields
  }

  async gatherResource(nodeId: string, gatherId: string) {
    const state = this.gameState.getState()
    const node = state.entities.byId.get(nodeId) as ResourceNodeEntity | undefined
    const gatherer = state.entities.byId.get(gatherId)
    
    if (!node || !gatherer) return

    // Store node position
    const nodePosition = { ...node.position }

    // First movement: Move gatherer to node
    await this.scene.moveEntityTo(gatherId, nodePosition.x, nodePosition.y)
    
    // Apply gathering time with speed multiplier
    const gatherTime = node.gatheringProperties.baseGatherTime / 
                      node.gatheringProperties.gatheringSpeedMultiplier
    await new Promise(resolve => setTimeout(resolve, gatherTime))

    // Calculate resource yields
    const yields = this.calculateResourceYields(node)
    
    // TODO: create a resource entity that is created when the resource is gathered and then moves back to the base then destroy it

    // Second movement: Move gatherer back to base
    await this.scene.moveEntityTo(gatherId, this.BASE_POSITION.x, this.BASE_POSITION.y)
    
    // Update inventory for each yielded resource
    yields.forEach(resourceType => {
      this.gameState.getState().incrementResource(resourceType)
    })
  }
} 