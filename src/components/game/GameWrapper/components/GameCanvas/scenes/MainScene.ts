import { Scene } from 'phaser'
import type * as Phaser from 'phaser'

export default class MainScene extends Scene {
  private player!: Phaser.GameObjects.Sprite
  private base!: Phaser.GameObjects.Sprite
  private stones: Phaser.GameObjects.Sprite[] = []
  private wood: Phaser.GameObjects.Sprite[] = []
  private isAnimating: boolean = false
  private carriedResource: Phaser.GameObjects.Sprite | null = null
  private onStoneCollected?: () => void
  private onWoodCollected?: () => void

  constructor() {
    super({ key: 'MainScene' })
  }

  init(data: { 
    onStoneCollected?: () => void
    onWoodCollected?: () => void 
  }) {
    this.onStoneCollected = data.onStoneCollected
    this.onWoodCollected = data.onWoodCollected
  }

  create() {
    // Create base
    this.base = this.add.sprite(400, 400, 'placeholder')
    this.base.setDisplaySize(40, 40)
    this.base.setTint(0x60a5fa)

    // Create player
    this.player = this.add.sprite(400, 300, 'placeholder')
    this.player.setDisplaySize(20, 20)
    this.player.setTint(0x4ade80)

    // Create stones
    const stonePositions = [
      { x: 200, y: 200 },
      { x: 600, y: 200 },
      { x: 300, y: 500 },
      { x: 500, y: 500 },
      { x: 400, y: 150 }
    ]

    stonePositions.forEach((pos, index) => {
      const stone = this.add.sprite(pos.x, pos.y, 'placeholder')
      stone.setDisplaySize(8, 8)
      stone.setTint(0x94a3b8)
      stone.setData('id', `stone${index + 1}`)
      stone.setData('type', 'stone')
      this.stones.push(stone)
    })

    // Create wood
    const woodPositions = [
      { x: 150, y: 150 },
      { x: 650, y: 150 },
      { x: 250, y: 550 },
      { x: 550, y: 550 }
    ]

    woodPositions.forEach((pos, index) => {
      const wood = this.add.sprite(pos.x, pos.y, 'placeholder')
      wood.setDisplaySize(15, 15)
      wood.setTint(0xca8a04)
      wood.setData('id', `wood${index + 1}`)
      wood.setData('type', 'wood')
      this.wood.push(wood)
    })
  }

  preload() {
    // Load a simple placeholder texture for our shapes
    this.load.image('placeholder', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=')
  }

  async gatherResource(resourceId: string) {
    if (this.isAnimating) return

    const resource = [...this.stones, ...this.wood].find(r => r.getData('id') === resourceId)
    if (!resource) return

    this.isAnimating = true

    try {
      // Move to resource
      await this.movePlayerTo(resource.x, resource.y)

      // Pick up resource
      await this.delay(500)
      this.carriedResource = resource
      resource.setVisible(false)

      const resourceType = resource.getData('type')
      if (resourceType === 'stone') {
        this.stones = this.stones.filter(s => s.getData('id') !== resourceId)
      } else {
        this.wood = this.wood.filter(w => w.getData('id') !== resourceId)
      }

      // Move back to base
      await this.movePlayerTo(this.base.x, this.base.y)

      // Drop resource
      await this.delay(500)
      this.carriedResource = null
      resource.destroy()

      // Trigger callback
      if (resourceType === 'stone' && this.onStoneCollected) {
        this.onStoneCollected()
      } else if (resourceType === 'wood' && this.onWoodCollected) {
        this.onWoodCollected()
      }
    } finally {
      this.isAnimating = false
    }
  }

  private movePlayerTo(x: number, y: number): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: this.player,
        x,
        y,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => resolve()
      })
    })
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  update() {
    // Update carried resource position
    if (this.carriedResource) {
      this.carriedResource.setPosition(
        this.player.x,
        this.player.y - this.player.displayHeight/2
      )
    }
  }

  getAvailableResources(type: 'stone' | 'wood'): { id: string }[] {
    const resources = type === 'stone' ? this.stones : this.wood
    return resources.map(r => ({ 
      id: r.getData('id')
    }))
  }
} 