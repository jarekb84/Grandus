import { EntityType, GameEntity } from '../types/game.types'

class RenderSystem {
  private renderFunctions: Map<EntityType, (ctx: CanvasRenderingContext2D, entity: GameEntity) => void>

  constructor() {
    this.renderFunctions = new Map()
    this.initializeRenderFunctions()
  }

  private initializeRenderFunctions() {
    this.renderFunctions.set('base', this.renderBase.bind(this))
    this.renderFunctions.set('stone', this.renderStone.bind(this))
    this.renderFunctions.set('wood', this.renderWood.bind(this))
    this.renderFunctions.set('player', this.renderPlayer.bind(this))
  }

  render(ctx: CanvasRenderingContext2D, entity: GameEntity) {
    const renderFn = this.renderFunctions.get(entity.type)
    if (renderFn) {
      renderFn(ctx, entity)
    }
  }

  private renderBase(ctx: CanvasRenderingContext2D, entity: GameEntity) {
    ctx.beginPath()
    ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2)
    ctx.fillStyle = entity.color
    ctx.globalAlpha = 0.3
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.strokeStyle = entity.color
    ctx.lineWidth = 2
    ctx.stroke()
  }

  private renderStone(ctx: CanvasRenderingContext2D, entity: GameEntity) {
    ctx.beginPath()
    ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2)
    ctx.fillStyle = entity.color
    ctx.fill()
  }

  private renderWood(ctx: CanvasRenderingContext2D, entity: GameEntity) {
    ctx.save()
    ctx.translate(entity.x, entity.y)
    ctx.rotate(Math.PI / 4)
    
    // Draw log body
    ctx.beginPath()
    ctx.fillStyle = entity.color
    ctx.fillRect(-entity.size, -entity.size/3, entity.size * 2, entity.size/1.5)
    
    // Add wood grain lines
    ctx.strokeStyle = '#92400e'
    ctx.lineWidth = 1
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath()
      ctx.moveTo(-entity.size + (i * entity.size/2), -entity.size/3)
      ctx.lineTo(-entity.size + (i * entity.size/2), entity.size/3)
      ctx.stroke()
    }
    
    ctx.restore()
  }

  private renderPlayer(ctx: CanvasRenderingContext2D, entity: GameEntity) {
    // Head
    ctx.beginPath()
    ctx.arc(entity.x, entity.y - entity.size/2, entity.size/4, 0, Math.PI * 2)
    ctx.fillStyle = entity.color
    ctx.fill()

    // Body
    ctx.beginPath()
    ctx.moveTo(entity.x, entity.y - entity.size/3)
    ctx.lineTo(entity.x, entity.y + entity.size/3)
    ctx.strokeStyle = entity.color
    ctx.lineWidth = 2
    ctx.stroke()

    // Arms
    ctx.beginPath()
    ctx.moveTo(entity.x - entity.size/3, entity.y)
    ctx.lineTo(entity.x + entity.size/3, entity.y)
    ctx.stroke()

    // Legs
    ctx.beginPath()
    ctx.moveTo(entity.x, entity.y + entity.size/3)
    ctx.lineTo(entity.x - entity.size/3, entity.y + entity.size)
    ctx.moveTo(entity.x, entity.y + entity.size/3)
    ctx.lineTo(entity.x + entity.size/3, entity.y + entity.size)
    ctx.stroke()
  }
}

export default RenderSystem 