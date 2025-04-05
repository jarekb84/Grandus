import * as Phaser from "phaser";
import {
  Entity,
  EntityType,
  Shape,
  ResourceYield,
} from "@/features/shared/types/entities";
import { ResourceType } from "@/features/shared/types/entities";

export interface MainSceneEvents {
  onEntityInteraction: (entityId: string, type: EntityType) => void;
  onPlayerHealthChanged?: (health: number) => void;
  onResourceGathered?: (resourceType: ResourceType, amount: number) => void;
}

interface EntitySprites {
  main: Phaser.GameObjects.Sprite;
  outline: Phaser.GameObjects.Sprite;
}

interface HexCoords {
  q: number;
  r: number;
}

export class TerritoryScene extends Phaser.Scene {
  private entities: Map<string, EntitySprites> = new Map();
  private sceneEvents: MainSceneEvents;
  private static readonly SHAPE_KEYS = {
    [Shape.CIRCLE]: "circle",
    [Shape.SQUARE]: "square",
  };

  constructor(events: MainSceneEvents) {
    super({ key: "TerritoryScene" });
    this.sceneEvents = events;
  }

  preload(): void {
    // We'll create textures in create() instead
  }

  private hexSize = 72;

  private startOffsetX: number = 0;
  private startOffsetY: number = 0;

  create(): void {
    this.createShapeTextures();
    this.drawHexGrid();
    this.setupInputHandling();
  }

  private drawHexGrid(): void {
    const graphics = this.add.graphics({
      lineStyle: { width: 1, color: 0x444444 },
    });
    const hexWidth = Math.sqrt(3) * this.hexSize;
    const hexHeight = 2 * this.hexSize;
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    this.startOffsetX = -hexWidth / 2;
    this.startOffsetY = -hexHeight / 2;

    const qMin = -2;
    const qMax = 10;
    const rMin = -2;
    const rMax = 8;

    for (let r = rMin; r <= rMax; r++) {
      for (let q = qMin; q <= qMax; q++) {
        const pixelPos = this.hexToPixelCoords(
          q,
          r,
          this.startOffsetX,
          this.startOffsetY,
        );

        if (
          pixelPos.x > -this.hexSize &&
          pixelPos.x < screenWidth + this.hexSize &&
          pixelPos.y > -this.hexSize &&
          pixelPos.y < screenHeight + this.hexSize
        ) {
          const corners = this.getHexCorners(pixelPos.x, pixelPos.y);
          graphics.strokePoints(corners, true);
        }
      }
    }
  }

  private hexToPixelCoords(
    q: number,
    r: number,
    offsetX: number,
    offsetY: number,
  ): { x: number; y: number } {
    const x =
      this.hexSize * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r) + offsetX;
    const y = this.hexSize * ((3 / 2) * r) + offsetY;
    return { x, y };
  }

  private getHexCorners(x: number, y: number): Phaser.Geom.Point[] {
    const corners: Phaser.Geom.Point[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i + 30);
      const cornerX = x + this.hexSize * Math.cos(angle);
      const cornerY = y + this.hexSize * Math.sin(angle);
      corners.push(new Phaser.Geom.Point(cornerX, cornerY));
    }
    return corners;
  }

  private setupInputHandling(): void {
    this.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      (pointer: Phaser.Input.Pointer) => {
        const hexCoords = this.pixelToHex(pointer.worldX, pointer.worldY);
        console.log(
          `Clicked Hex Coords (q, r): ${hexCoords.q}, ${hexCoords.r}`,
        );
      },
    );
  }

  // Based on https://www.redblobgames.com/grids/hexagons/#pixel-to-hex
  private pixelToHex(worldX: number, worldY: number): HexCoords {
    const relativeX = worldX - this.startOffsetX;
    const relativeY = worldY - this.startOffsetY;

    const q_frac =
      ((Math.sqrt(3) / 3) * relativeX - (1 / 3) * relativeY) / this.hexSize;
    const r_frac = ((2 / 3) * relativeY) / this.hexSize;

    const x_cube_frac = q_frac;
    const z_cube_frac = r_frac;
    const y_cube_frac = -x_cube_frac - z_cube_frac;

    let q_round = Math.round(x_cube_frac);
    let r_round = Math.round(z_cube_frac);
    const s_round = Math.round(y_cube_frac);

    const q_diff = Math.abs(q_round - x_cube_frac);
    const r_diff = Math.abs(r_round - z_cube_frac);
    const s_diff = Math.abs(s_round - y_cube_frac);

    // Adjust rounding based on largest difference (ensures q+r+s = 0)
    if (q_diff > r_diff && q_diff > s_diff) {
      q_round = -r_round - s_round;
    } else if (r_diff > s_diff) {
      r_round = -q_round - s_round;
    } // else: s_diff is largest, no change needed for q_round or r_round

    return { q: q_round, r: r_round };
  }

  private createShapeTextures(): void {
    if (!this.textures.exists(TerritoryScene.SHAPE_KEYS[Shape.SQUARE])) {
      const squareGraphics = this.add.graphics();
      squareGraphics.fillStyle(0xffffff);
      squareGraphics.fillRect(0, 0, 32, 32);
      squareGraphics.generateTexture(
        TerritoryScene.SHAPE_KEYS[Shape.SQUARE],
        32,
        32,
      );
      squareGraphics.destroy();
    }

    if (!this.textures.exists(TerritoryScene.SHAPE_KEYS[Shape.CIRCLE])) {
      const circleGraphics = this.add.graphics();
      circleGraphics.fillStyle(0xffffff);
      circleGraphics.beginPath();
      circleGraphics.arc(16, 16, 16, 0, Math.PI * 2);
      circleGraphics.closePath();
      circleGraphics.fill();
      circleGraphics.generateTexture(
        TerritoryScene.SHAPE_KEYS[Shape.CIRCLE],
        32,
        32,
      );
      circleGraphics.destroy();
    }
  }

  private ensureTexture(shape: Shape): boolean {
    const key = TerritoryScene.SHAPE_KEYS[shape];
    const exists = this.textures.exists(key);
    if (!exists) {
      this.createShapeTextures();
    }
    return this.textures.exists(key);
  }

  addEntity(entity: Entity): void {
    if (!this.ensureTexture(entity.properties.shape)) {
      console.error("Failed to create entity - missing texture");
      return;
    }

    const sprites = this.createSpritesForEntity(entity);
    this.entities.set(entity.id, sprites);

    if (entity.type === EntityType.RESOURCE_NODE) {
      sprites.main.setInteractive();
      // Store the full entity data on the main sprite for later retrieval
      sprites.main.setData("entityData", entity);
    }
  }

  removeEntity(entityId: string): void {
    const sprites = this.entities.get(entityId);
    if (sprites) {
      sprites.main.destroy();
      sprites.outline.destroy();
      this.entities.delete(entityId);
    }
  }

  private createSpritesForEntity(entity: Entity): EntitySprites {
    const { shape, size, color } = entity.properties;
    const { x, y } = entity.position;

    const textureKey = TerritoryScene.SHAPE_KEYS[shape];

    const outline = this.add.sprite(x, y, textureKey);
    outline.setDisplaySize(size + 2, size + 2);
    outline.setTint(0x000000);

    const main = this.add.sprite(x, y, textureKey);
    main.setDisplaySize(size, size);
    main.setTint(color);

    switch (entity.type) {
      case EntityType.BUILDING:
        outline.setDepth(0);
        main.setDepth(0);
        break;
      case EntityType.CHARACTER:
        outline.setDepth(1);
        main.setDepth(1);
        break;

      case EntityType.RESOURCE_NODE:
        outline.setDepth(0);
        main.setDepth(0);
        break;
    }

    return { main, outline };
  }

  async moveEntityTo(entityId: string, x: number, y: number): Promise<void> {
    const sprites = this.entities.get(entityId);
    if (sprites == null || sprites.main == null) {
      console.warn(
        `moveEntityTo: Entity or main sprite not found for ID: ${entityId}`,
      );
      return Promise.resolve();
    }

    const targets =
      sprites.outline != null
        ? [sprites.main, sprites.outline]
        : [sprites.main];

    return new Promise((resolve) => {
      this.tweens.add({
        targets: targets,
        x,
        y,
        duration: 1000,
        ease: "Power2",
        onComplete: () => {
          if (typeof resolve === "function") {
            resolve();
          } else {
            console.error(
              `moveEntityTo: Resolve function is not valid for ${entityId}`,
            );
          }
        },
      });
    });
  }

  /**
   * Initiates the gathering process for a specific resource type.
   * Called from the React UI via the adapter.
   * @param resourceType The type of resource to start gathering.
   */
  public async initiateGathering(resourceType: ResourceType): Promise<void> {
    console.log(`TerritoryScene: Initiating gathering for ${resourceType}`);
    console.log(
      `[DEBUG] initiateGathering called with resourceType: ${resourceType}`,
    );

    const playerId = "player1";

    const playerSprites = this.entities.get(playerId);
    if (!playerSprites) {
      console.warn(
        `TerritoryScene: Player sprites with ID '${playerId}' not found.`,
      );
      return;
    }
    const playerPosition = { x: playerSprites.main.x, y: playerSprites.main.y };

    let targetNodeSprite: Phaser.GameObjects.Sprite | null = null;
    let minDistance = Infinity;

    console.log(
      `[DEBUG] Searching for nearest node sprite of type: ${resourceType}`,
    );
    this.entities.forEach((sprites, id) => {
      if (id === playerId) {
        return;
      }

      const entityData = sprites.main.getData("entityData") as
        | Entity
        | undefined;

      if (entityData && entityData.type === EntityType.RESOURCE_NODE) {
        const resourceNodeData = entityData;

        const yieldsRequiredResource = resourceNodeData.yields?.some(
          (yieldInfo: ResourceYield) => yieldInfo.resourceType === resourceType,
        );

        if (yieldsRequiredResource) {
          const distance = Phaser.Math.Distance.Between(
            playerPosition.x,
            playerPosition.y,
            sprites.main.x,
            sprites.main.y,
          );

          if (distance < minDistance) {
            minDistance = distance;
            targetNodeSprite = sprites.main;
          }
        }
      }
    });

    if (targetNodeSprite == null) {
      console.warn(
        `TerritoryScene: No resource node sprites of type ${resourceType} found.`,
      );
      return;
    }

    const nodePosition = {
      x: (targetNodeSprite as Phaser.GameObjects.Sprite).x,
      y: (targetNodeSprite as Phaser.GameObjects.Sprite).y,
    };
    console.log(
      `TerritoryScene: Found nearest node sprite of type ${resourceType} at (${nodePosition.x}, ${nodePosition.y}). Moving player...`,
    );

    try {
      console.log("[DEBUG] Attempting moveEntityTo node...");
      await this.moveEntityTo(playerId, nodePosition.x, nodePosition.y);
      console.log(
        `TerritoryScene: Player reached node. Simulating gathering...`,
      );
      console.log("[DEBUG] moveEntityTo node complete.");

      await new Promise((resolve) => this.time.delayedCall(2000, resolve));
      console.log(`TerritoryScene: Gathering complete. Returning to base...`);

      console.log(
        "[DEBUG] Finding home base and attempting moveEntityTo base...",
      );
      const homeBaseId = "base1";
      const homeBaseSprites = this.entities.get(homeBaseId);

      if (homeBaseSprites != null && homeBaseSprites.main != null) {
        console.log(`[DEBUG] Found home base sprite for ID '${homeBaseId}'.`);
        const targetX = homeBaseSprites.main.x;
        const targetY = homeBaseSprites.main.y;
        console.log(
          `[DEBUG] Using base coordinates for return: (${targetX}, ${targetY})`,
        );
        await this.moveEntityTo(playerId, targetX, targetY);
        console.log(
          `TerritoryScene: Player returned to base at (${targetX}, ${targetY}).`,
        );
        console.log("[DEBUG] moveEntityTo base complete.");
      } else {
        console.warn(
          `TerritoryScene: Home base entity with ID '${homeBaseId}' not found. Cannot return player.`,
        );
      }
      console.log(
        `TerritoryScene: Triggering resource update for ${resourceType}.`,
      );
      this.sceneEvents.onResourceGathered?.(resourceType, 1);
    } catch (error) {
      console.error(`TerritoryScene: Error during gathering sequence:`, error);
      console.error("[DEBUG] Error caught in gathering sequence:", error);
    }
  }
}
