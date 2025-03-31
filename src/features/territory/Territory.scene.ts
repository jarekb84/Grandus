import * as Phaser from "phaser";
import { Entity, EntityType, Shape } from "@/features/shared/types/entities";

export interface MainSceneEvents {
  onEntityInteraction: (entityId: string, type: EntityType) => void;
  onPlayerHealthChanged?: (health: number) => void;
}

interface EntitySprites {
  main: Phaser.GameObjects.Sprite;
  outline: Phaser.GameObjects.Sprite;
}

// Define an interface for hex coordinates
interface HexCoords {
  q: number;
  r: number;
}

export class TerritoryScene extends Phaser.Scene {
  // Renamed class
  private entities: Map<string, EntitySprites> = new Map();
  private sceneEvents: MainSceneEvents;
  private static readonly SHAPE_KEYS = {
    [Shape.CIRCLE]: "circle",
    [Shape.SQUARE]: "square",
  };

  constructor(events: MainSceneEvents) {
    super({ key: "TerritoryScene" }); // Updated scene key
    this.sceneEvents = events;
  }

  preload(): void {
    // We'll create textures in create() instead
  }

  // --- Hex Grid Properties ---
  private hexSize = 72; // Radius of the hex (Increased again)
  // Grid dimensions removed, we'll loop until off-screen
  // --- End Hex Grid Properties ---

  // --- Grid Interaction Properties ---
  private startOffsetX: number = 0; // Store offset for pixelToHex conversion
  private startOffsetY: number = 0;
  // --- End Grid Interaction Properties ---

  create(): void {
    this.createShapeTextures();
    this.drawHexGrid(); // Call the new grid drawing function
    this.setupInputHandling(); // Add input listener
  }

  // --- Hex Grid Drawing Logic ---
  private drawHexGrid(): void {
    const graphics = this.add.graphics({
      lineStyle: { width: 1, color: 0x444444 },
    }); // Use a slightly visible gray
    const hexWidth = Math.sqrt(3) * this.hexSize;
    const hexHeight = 2 * this.hexSize;
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    // Store offsets for later use in pixelToHex
    this.startOffsetX = -hexWidth / 2;
    this.startOffsetY = -hexHeight / 2;

    // Loop until hexes are drawn past the bottom-right screen edge
    // Estimate loop bounds generously to ensure coverage
    const qMin = -2;
    const qMax = 10; // Estimated based on screen width / hex width
    const rMin = -2;
    const rMax = 8; // Estimated based on screen height / hex vertical step

    for (let r = rMin; r <= rMax; r++) {
      for (let q = qMin; q <= qMax; q++) {
        const pixelPos = this.hexToPixelCoords(
          q,
          r,
          this.startOffsetX,
          this.startOffsetY,
        );

        // Basic culling: Only draw if the hex center is potentially near the screen
        if (
          pixelPos.x > -this.hexSize &&
          pixelPos.x < screenWidth + this.hexSize &&
          pixelPos.y > -this.hexSize &&
          pixelPos.y < screenHeight + this.hexSize
        ) {
          const corners = this.getHexCorners(pixelPos.x, pixelPos.y);
          graphics.strokePoints(corners, true); // true to close the shape
        }
      }
    }
  }

  // Helper to get pixel coordinates for flat-top hex center
  private hexToPixelCoords(
    q: number,
    r: number,
    offsetX: number,
    offsetY: number,
  ): { x: number; y: number } {
    // Adjust for axial coordinates (flat-top)
    // x = size * (sqrt(3) * q + sqrt(3)/2 * r)
    // y = size * (                  3/2 * r)
    const x =
      this.hexSize * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r) + offsetX;
    const y = this.hexSize * ((3 / 2) * r) + offsetY;
    return { x, y };
  }

  // Helper to get the 6 corner points of a flat-top hex
  private getHexCorners(x: number, y: number): Phaser.Geom.Point[] {
    const corners: Phaser.Geom.Point[] = [];
    for (let i = 0; i < 6; i++) {
      // Start angle is 30 degrees (pi/6) for flat-top hexes
      const angle = (Math.PI / 180) * (60 * i + 30);
      const cornerX = x + this.hexSize * Math.cos(angle);
      const cornerY = y + this.hexSize * Math.sin(angle);
      corners.push(new Phaser.Geom.Point(cornerX, cornerY));
    }
    return corners;
  }
  // --- End Hex Grid Drawing Logic ---

  // --- Input Handling & Coordinate Conversion ---
  private setupInputHandling(): void {
    this.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      (pointer: Phaser.Input.Pointer) => {
        const hexCoords = this.pixelToHex(pointer.worldX, pointer.worldY);
        console.log(
          `Clicked Hex Coords (q, r): ${hexCoords.q}, ${hexCoords.r}`,
        );
        // Later: Emit event hex:clicked with hexCoords
      },
    );

    // Optional: Add hover handling later
    // this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
    //   const hexCoords = this.pixelToHex(pointer.worldX, pointer.worldY);
    //   // Logic to highlight hex under cursor
    //   // Emit event hex:hovered with hexCoords
    // });
  }

  // Converts pixel coordinates (world space) to axial hex coordinates (flat-top)
  // Based on https://www.redblobgames.com/grids/hexagons/#pixel-to-hex
  private pixelToHex(worldX: number, worldY: number): HexCoords {
    // Adjust for the offset used during drawing
    const relativeX = worldX - this.startOffsetX;
    const relativeY = worldY - this.startOffsetY;

    // Convert pixel to fractional axial coordinates
    const q_frac =
      ((Math.sqrt(3) / 3) * relativeX - (1 / 3) * relativeY) / this.hexSize;
    const r_frac = ((2 / 3) * relativeY) / this.hexSize;

    // Convert fractional axial to cube coordinates
    const x_cube_frac = q_frac;
    const z_cube_frac = r_frac;
    const y_cube_frac = -x_cube_frac - z_cube_frac;

    // Round cube coordinates to nearest integer cube coordinates
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
    } else {
      // s_round = -q_round - r_round; // Not needed as we only return q, r
    }

    // Return axial coordinates
    return { q: q_round, r: r_round };
  }
  // --- End Input Handling & Coordinate Conversion ---

  private createShapeTextures(): void {
    // Only create textures if they don't exist
    if (!this.textures.exists(TerritoryScene.SHAPE_KEYS[Shape.SQUARE])) {
      // Updated class name reference
      // Create square texture (32x32)
      const squareGraphics = this.add.graphics();
      squareGraphics.fillStyle(0xffffff);
      squareGraphics.fillRect(0, 0, 32, 32);
      squareGraphics.generateTexture(
        TerritoryScene.SHAPE_KEYS[Shape.SQUARE],
        32,
        32,
      ); // Updated class name reference
      squareGraphics.destroy();
    }

    if (!this.textures.exists(TerritoryScene.SHAPE_KEYS[Shape.CIRCLE])) {
      // Updated class name reference
      // Create circle texture (32x32)
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
      ); // Updated class name reference
      circleGraphics.destroy();
    }
  }

  // Helper method to verify texture exists
  private ensureTexture(shape: Shape): boolean {
    const key = TerritoryScene.SHAPE_KEYS[shape]; // Updated class name reference
    const exists = this.textures.exists(key);
    if (!exists) {
      this.createShapeTextures(); // Attempt to recreate
    }
    return this.textures.exists(key);
  }

  addEntity(entity: Entity): void {
    // Verify texture exists before creating sprite
    if (!this.ensureTexture(entity.properties.shape)) {
      console.error("Failed to create entity - missing texture");
      return;
    }

    const sprites = this.createSpritesForEntity(entity);
    this.entities.set(entity.id, sprites);

    // Make resource nodes interactive
    if (entity.type === EntityType.RESOURCE_NODE) {
      sprites.main.setInteractive();
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

    const textureKey = TerritoryScene.SHAPE_KEYS[shape]; // Updated class name reference

    // Create outline first so it's behind the main sprite
    const outline = this.add.sprite(x, y, textureKey);
    outline.setDisplaySize(size + 2, size + 2);
    outline.setTint(0x000000);

    const main = this.add.sprite(x, y, textureKey);
    main.setDisplaySize(size, size);
    main.setTint(color);

    // Set depths based on entity type
    // Buildings (base) at depth 0
    // Character (player) at depth 1
    // Resource nodes at depth 0
    switch (entity.type) {
      case EntityType.BUILDING:
        outline.setDepth(0);
        main.setDepth(0);
        break;
      case EntityType.CHARACTER:
        outline.setDepth(1);
        main.setDepth(1);
        break;

      // todo maybe add resrouce back in as en tity that only exists when it is carreid back to the base
      case EntityType.RESOURCE_NODE:
        outline.setDepth(0);
        main.setDepth(0);
        break;
    }

    return { main, outline };
  }

  async moveEntityTo(entityId: string, x: number, y: number): Promise<void> {
    const sprites = this.entities.get(entityId);
    if (!sprites) return Promise.resolve();

    return new Promise((resolve) => {
      this.tweens.add({
        targets: [sprites.main, sprites.outline],
        x,
        y,
        duration: 1000,
        ease: "Power2",
        onComplete: () => resolve(),
      });
    });
  }
}
