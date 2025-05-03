import * as Phaser from "phaser";
import {
  EntityType,
  Shape,
  GraphicalProperties,
} from "@/features/shared/types/entities";
import { eventBus, NodeVisualStatePayload } from "../shared/events/eventBus";

export interface MainSceneEvents {
  onEntityInteraction: (entityId: string, type: EntityType) => void;
  onPlayerHealthChanged?: (health: number) => void;
}

interface EntitySprites {
  main: Phaser.GameObjects.Sprite;
  outline: Phaser.GameObjects.Sprite;
}

interface HexCoords {
  q: number;
  r: number;
}

export interface EntityPosition {
  entityId: string;
  x: number;
  y: number;
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

  public hexSize = 72;

  public centerX: number = 0;
  public centerY: number = 0;
  create(): void {
    this.centerX = this.cameras.main.centerX;
    this.centerY = this.cameras.main.centerY;

    this.createShapeTextures();
    this.drawHexGrid();
    this.setupInputHandling();

    this.handleNodeVisualUpdate = this.handleNodeVisualUpdate.bind(this);

    eventBus.on("NODE_VISUAL_STATE_CHANGED", this.handleNodeVisualUpdate);
  }

  private handleNodeVisualUpdate(payload: NodeVisualStatePayload): void {
    const sprites = this.entities.get(payload.nodeId);
    if (!sprites?.main) return;

    sprites.main.setAlpha(1.0);
    sprites.main.clearTint();

    if (payload.activeEffects.includes("depleted")) {
      sprites.main.setAlpha(0.3);
      sprites.main.setTint(0x555555); // Dark grey tint
    } else if (payload.activeEffects.includes("fully_stocked")) {
      // Visuals already reset above, nothing more needed for 'fully_stocked' itself
    }

    if (payload.activeEffects.includes("respawning_pulse")) {
      sprites.main.setTint(0x6666ff); // Light blue tint for respawning
    }
  }

  private drawHexGrid(): void {
    const graphics = this.add.graphics({
      lineStyle: { width: 1, color: 0x444444 },
    });
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    // --- START: Calculate dynamic hex range based on all 4 corners ---
    const topLeftHex = this.pixelToHex(0, 0);
    const topRightHex = this.pixelToHex(screenWidth, 0);
    const bottomLeftHex = this.pixelToHex(0, screenHeight);
    const bottomRightHex = this.pixelToHex(screenWidth, screenHeight);
    const buffer = 2; // Draw a couple extra hexes around the edges

    const qMin =
      Math.min(topLeftHex.q, topRightHex.q, bottomLeftHex.q, bottomRightHex.q) -
      buffer;
    const qMax =
      Math.max(topLeftHex.q, topRightHex.q, bottomLeftHex.q, bottomRightHex.q) +
      buffer;
    const rMin =
      Math.min(topLeftHex.r, topRightHex.r, bottomLeftHex.r, bottomRightHex.r) -
      buffer;
    const rMax =
      Math.max(topLeftHex.r, topRightHex.r, bottomLeftHex.r, bottomRightHex.r) +
      buffer;
    // --- END: Calculate dynamic hex range based on all 4 corners ---

    for (let r = rMin; r <= rMax; r++) {
      for (let q = qMin; q <= qMax; q++) {
        const pixelPos = this.hexToPixelCoords(
          q,
          r,
          this.centerX,
          this.centerY,
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

  /**
   * Converts hex coordinates (q, r) to pixel coordinates (x, y) relative to a center point.
   * Made public to allow external services (like GatheringService) to calculate standard positions.
   */
  public hexToPixelCoords(
    q: number,
    r: number,
    centerX: number,
    centerY: number,
  ): { x: number; y: number } {
    const x =
      centerX + this.hexSize * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
    const y = centerY + this.hexSize * ((3 / 2) * r);
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
      (_pointer: Phaser.Input.Pointer) => {
        // TODO: Implement hex click interaction (using pixelToHex)
      },
    );
  }

  // Based on https://www.redblobgames.com/grids/hexagons/#pixel-to-hex
  private pixelToHex(worldX: number, worldY: number): HexCoords {
    const relativeX = worldX - this.centerX;
    const relativeY = worldY - this.centerY;

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

  addEntity(id: string, graphical: GraphicalProperties): void {
    if (!this.ensureTexture(graphical.shape)) {
      console.warn(`Texture not found for shape: ${graphical.shape}`);
      return;
    }

    const sprites = this.createSpritesForEntity(graphical);
    this.entities.set(id, sprites);
  }

  removeEntity(entityId: string): void {
    const sprites = this.entities.get(entityId);
    if (sprites) {
      sprites.main.destroy();
      sprites.outline.destroy();
      this.entities.delete(entityId);
    }
  }

  private createSpritesForEntity(
    graphical: GraphicalProperties,
  ): EntitySprites {
    const { shape, size, color, depth } = graphical;
    const { x, y } = graphical.position;

    const textureKey = TerritoryScene.SHAPE_KEYS[shape];

    const outline = this.add.sprite(x, y, textureKey);
    outline.setDisplaySize(size + 2, size + 2);
    outline.setTint(0x000000);

    const main = this.add.sprite(x, y, textureKey);
    main.setDisplaySize(size, size);
    main.setTint(color);

    outline.setDepth(depth);
    main.setDepth(depth);

    return { main, outline };
  }

  async moveEntityTo(entityId: string, targetEntityId: string): Promise<void> {
    const sprites = this.entities.get(entityId);
    const targetSprite = this.entities.get(targetEntityId);

    if (sprites == null || targetSprite == null) {
      return Promise.resolve();
    }

    const targets =
      sprites.outline != null
        ? [sprites.main, sprites.outline]
        : [sprites.main];

    return new Promise((resolve) => {
      this.tweens.add({
        targets: targets,
        x: targetSprite.main.x,
        y: targetSprite.main.y,
        duration: 1000,
        ease: "Power2",
        onComplete: () => {
          if (typeof resolve === "function") {
            resolve();
          }
        },
      });
    });
  }

  /**
   * Returns the current position of a specific entity.
   * @param entityId The ID of the entity.
   * @returns The {x, y} position or undefined if not found.
   */
  public getEntityPosition(entityId: string): EntityPosition | undefined {
    const sprites = this.entities.get(entityId);
    if (sprites?.main) {
      return { entityId, x: sprites.main.x, y: sprites.main.y };
    }
    return undefined;
  }

  // Phaser Scene lifecycle method
  shutdown(): void {
    eventBus.off("NODE_VISUAL_STATE_CHANGED", this.handleNodeVisualUpdate);
  }
}
