import * as Phaser from 'phaser'
import { Entity, EntityType, Shape } from '@/features/shared/types/entities'

export interface MainSceneEvents {
  onEntityInteraction: (entityId: string, type: EntityType) => void
  onPlayerHealthChanged?: (health: number) => void
}

interface EntitySprites {
  main: Phaser.GameObjects.Sprite;
  outline: Phaser.GameObjects.Sprite;
}

export class GatheringScene extends Phaser.Scene {
  private entities: Map<string, EntitySprites> = new Map()
  private sceneEvents: MainSceneEvents
  private static readonly SHAPE_KEYS = {
    [Shape.CIRCLE]: 'circle',
    [Shape.SQUARE]: 'square'
  }

  constructor(events: MainSceneEvents) {
    super({ key: 'MainScene' })
    this.sceneEvents = events
  }

  preload() {
    // We'll create textures in create() instead
  }

  create() {
    this.createShapeTextures()    
  }

  private createShapeTextures() {
    // Only create textures if they don't exist
    if (!this.textures.exists(GatheringScene.SHAPE_KEYS[Shape.SQUARE])) {
      // Create square texture (32x32)
      const squareGraphics = this.add.graphics()
      squareGraphics.fillStyle(0xFFFFFF)
      squareGraphics.fillRect(0, 0, 32, 32)
      squareGraphics.generateTexture(GatheringScene.SHAPE_KEYS[Shape.SQUARE], 32, 32)
      squareGraphics.destroy()
    }

    if (!this.textures.exists(GatheringScene.SHAPE_KEYS[Shape.CIRCLE])) {
      // Create circle texture (32x32)
      const circleGraphics = this.add.graphics()
      circleGraphics.fillStyle(0xFFFFFF)
      circleGraphics.beginPath()
      circleGraphics.arc(16, 16, 16, 0, Math.PI * 2)
      circleGraphics.closePath()
      circleGraphics.fill()
      circleGraphics.generateTexture(GatheringScene.SHAPE_KEYS[Shape.CIRCLE], 32, 32)
      circleGraphics.destroy()      
    }
  }

  // Helper method to verify texture exists
  private ensureTexture(shape: Shape): boolean {
    const key = GatheringScene.SHAPE_KEYS[shape]
    const exists = this.textures.exists(key)
    if (!exists) {      
      this.createShapeTextures() // Attempt to recreate
    }
    return this.textures.exists(key)
  }

  addEntity(entity: Entity) {
    // Verify texture exists before creating sprite
    if (!this.ensureTexture(entity.properties.shape)) {
      console.error('Failed to create entity - missing texture')
      return
    }
    
    const sprites = this.createSpritesForEntity(entity)
    this.entities.set(entity.id, sprites)
    
    // Make resource nodes interactive
    if (entity.type === EntityType.RESOURCE_NODE) {
      sprites.main.setInteractive()      
    }
  }

  removeEntity(entityId: string) {
    const sprites = this.entities.get(entityId)
    if (sprites) {
      sprites.main.destroy()
      sprites.outline.destroy()
      this.entities.delete(entityId)
    }
  }

  private createSpritesForEntity(entity: Entity): EntitySprites {
    const { shape, size, color } = entity.properties
    const { x, y } = entity.position

    const textureKey = GatheringScene.SHAPE_KEYS[shape]
    
    // Create outline first so it's behind the main sprite
    const outline = this.add.sprite(x, y, textureKey)
    outline.setDisplaySize(size + 2, size + 2)
    outline.setTint(0x000000)

    const main = this.add.sprite(x, y, textureKey)
    main.setDisplaySize(size, size)
    main.setTint(color)

    // Set depths based on entity type
    // Buildings (base) at depth 0
    // Character (player) at depth 1
    // Resource nodes at depth 0
    switch (entity.type) {
      case EntityType.BUILDING:
        outline.setDepth(0)
        main.setDepth(0)
        break
      case EntityType.CHARACTER:
        outline.setDepth(1)
        main.setDepth(1)
        break

        // todo maybe add resrouce back in as en tity that only exists when it is carreid back to the base
      case EntityType.RESOURCE_NODE:
        outline.setDepth(0)
        main.setDepth(0)
        break
    }

    return { main, outline }
  }

  async moveEntityTo(entityId: string, x: number, y: number): Promise<void> {
    const sprites = this.entities.get(entityId)
    if (!sprites) return Promise.resolve()

    return new Promise((resolve) => {
      this.tweens.add({
        targets: [sprites.main, sprites.outline],
        x,
        y,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => resolve()
      })
    })
  }
} 