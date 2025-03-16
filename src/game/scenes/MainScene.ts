import * as Phaser from 'phaser'
import { GameEntity, EntityType } from '../entities.types'

export interface MainSceneEvents {
  onEntityInteraction: (entityId: string, type: EntityType) => void
}

export class MainScene extends Phaser.Scene {
  private entities: Map<string, Phaser.GameObjects.Sprite> = new Map()
  private sceneEvents: MainSceneEvents

  constructor(events: MainSceneEvents) {
    super({ key: 'MainScene' })
    this.sceneEvents = events
  }

  preload() {
    this.load.image('placeholder', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=')
  }

  create() {
    // Scene is now ready to add entities
  }

  addEntity(entity: GameEntity) {
    const sprite = this.createSpriteForEntity(entity)
    this.entities.set(entity.id, sprite)
    
    // Make resources interactive
    if (entity.type === EntityType.RESOURCE) {
      sprite.setInteractive()
      sprite.on('pointerdown', () => {
        this.sceneEvents.onEntityInteraction(entity.id, entity.type)
      })
    }
  }

  removeEntity(entityId: string) {
    const sprite = this.entities.get(entityId)
    if (sprite) {
      sprite.destroy()
      this.entities.delete(entityId)
    }
  }

  private createSpriteForEntity(entity: GameEntity) {
    const sprite = this.add.sprite(
      entity.position.x,
      entity.position.y,
      entity.properties.spriteKey || 'placeholder'
    )
    
    sprite.setDisplaySize(entity.properties.size, entity.properties.size)
    sprite.setTint(entity.properties.color)
    
    return sprite
  }

  async moveEntityTo(entityId: string, x: number, y: number): Promise<void> {
    const sprite = this.entities.get(entityId)
    if (!sprite) return Promise.resolve()

    return new Promise((resolve) => {
      this.tweens.add({
        targets: sprite,
        x,
        y,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => resolve()
      })
    })
  }
} 