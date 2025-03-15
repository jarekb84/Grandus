'use client'

import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react'
import { GameState, GameEntity } from './types/game.types'
import RenderSystem from './systems/RenderSystem'
import ResourceSystem from './systems/ResourceSystem'

interface GameCanvasProps {
  onStoneCollected?: () => void
  onWoodCollected?: () => void
}

export interface GameCanvasHandle {
  gatherStone: (stoneId: string) => Promise<void>
  gatherWood: (woodId: string) => Promise<void>
  getAvailableStones: () => GameEntity[]
  getAvailableWood: () => GameEntity[]
}

const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(function GameCanvas({ onStoneCollected, onWoodCollected }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const renderSystem = useRef<RenderSystem>(new RenderSystem())
  const resourceSystem = useRef<ResourceSystem>(new ResourceSystem())

  const [gameState, setGameState] = useState<GameState>({
    player: { id: 'player', x: 400, y: 300, type: 'player', size: 20, color: '#4ade80' },
    base: { id: 'base', x: 400, y: 400, type: 'base', size: 40, color: '#60a5fa' },
    stones: [
      { id: 'stone1', x: 200, y: 200, type: 'stone', size: 8, color: '#94a3b8' },
      { id: 'stone2', x: 600, y: 200, type: 'stone', size: 8, color: '#94a3b8' },
      { id: 'stone3', x: 300, y: 500, type: 'stone', size: 8, color: '#94a3b8' },
      { id: 'stone4', x: 500, y: 500, type: 'stone', size: 8, color: '#94a3b8' },
      { id: 'stone5', x: 400, y: 150, type: 'stone', size: 8, color: '#94a3b8' },
    ],
    wood: [
      { id: 'wood1', x: 150, y: 150, type: 'wood', size: 15, color: '#ca8a04' },
      { id: 'wood2', x: 650, y: 150, type: 'wood', size: 15, color: '#ca8a04' },
      { id: 'wood3', x: 250, y: 550, type: 'wood', size: 15, color: '#ca8a04' },
      { id: 'wood4', x: 550, y: 550, type: 'wood', size: 15, color: '#ca8a04' },
    ],
    playerCarrying: null,
    isAnimating: false
  })

  const gatherStone = async (stoneId: string) => {
    await resourceSystem.current.gatherResource(
      gameState,
      stoneId,
      setGameState,
      onStoneCollected
    )
  }

  const gatherWood = async (woodId: string) => {
    await resourceSystem.current.gatherResource(
      gameState,
      woodId,
      setGameState,
      onWoodCollected
    )
  }

  useImperativeHandle(ref, () => ({
    gatherStone,
    gatherWood,
    getAvailableStones: () => resourceSystem.current.getAvailableResources(gameState, 'stone'),
    getAvailableWood: () => resourceSystem.current.getAvailableResources(gameState, 'wood')
  }), [gameState])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const draw = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Render all entities
      renderSystem.current.render(ctx, gameState.base)
      gameState.stones.forEach(stone => renderSystem.current.render(ctx, stone))
      gameState.wood.forEach(wood => renderSystem.current.render(ctx, wood))
      renderSystem.current.render(ctx, gameState.player)

      // Render carried resource
      if (gameState.playerCarrying) {
        const carriedEntity = {
          ...gameState.playerCarrying,
          x: gameState.player.x,
          y: gameState.player.y - gameState.player.size/4
        }
        renderSystem.current.render(ctx, carriedEntity)
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState])

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      data-testid="game-canvas"
    />
  )
})

export default GameCanvas 