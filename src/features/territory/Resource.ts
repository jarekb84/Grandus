import { TerritoryScene } from "@/features/territory/Territory.scene";
import { useGameState } from "@/features/shared/stores/GameState.store";
import {
  ResourceNodeEntity,
  ResourceType,
} from "@/features/shared/types/entities";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";

export class ResourceSystem {
  private scene: TerritoryScene;
  private gameState = useGameState;
  private resourcesStore = useResourcesStore;
  private readonly BASE_POSITION = { x: 400, y: 400 };

  constructor(scene: TerritoryScene) {
    this.scene = scene;
  }

  private calculateResourceYields(node: ResourceNodeEntity): ResourceType[] {
    const yields: ResourceType[] = [];

    node.yields.forEach((resourceYield) => {
      const effectiveChance =
        resourceYield.chance * node.gatheringProperties.yieldMultiplier;

      for (let i = 0; i < resourceYield.baseAmount; i++) {
        if (Math.random() < effectiveChance) {
          yields.push(resourceYield.resourceType);
        }
      }
    });

    return yields;
  }

  async gatherResource(nodeId: string, gatherId: string): Promise<void> {
    const state = this.gameState.getState();
    const node = state.entities.byId.get(nodeId) as
      | ResourceNodeEntity
      | undefined;
    const gatherer = state.entities.byId.get(gatherId);

    if (!node || !gatherer) return;

    const nodePosition = { ...node.position };

    await this.scene.moveEntityTo(gatherId, nodePosition.x, nodePosition.y);

    const gatherTime =
      node.gatheringProperties.baseGatherTime /
      node.gatheringProperties.gatheringSpeedMultiplier;
    await new Promise((resolve) => setTimeout(resolve, gatherTime));

    const yields = this.calculateResourceYields(node);

    await this.scene.moveEntityTo(
      gatherId,
      this.BASE_POSITION.x,
      this.BASE_POSITION.y,
    );

    yields.forEach((resourceType) => {
      this.resourcesStore.getState().addResource(resourceType, 1);
    });
  }
}
