'use client'

import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react'

interface Position {
  x: number
  y: number
}

interface GameEntity {
  id: string
  x: number
  y: number
  type: 'player' | 'base' | 'stone'
  size: number
  color: string
  isCarried?: boolean
}

interface GameState {
  player: GameEntity
  base: GameEntity
  stones: GameEntity[]
  playerCarrying: GameEntity | null
  isAnimating: boolean
}

interface GameCanvasProps {
  onStoneCollected?: () => void
}

export interface GameCanvasHandle {
  gatherStone: (stoneId: string) => Promise<void>
}

const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(function GameCanvas({ onStoneCollected }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
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
    playerCarrying: null,
    isAnimating: false
  })

  const moveTowards = (current: Position, target: Position, speed: number): Position => {
    const dx = target.x - current.x
    const dy = target.y - current.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < speed) {
      return target
    }
    
    const ratio = speed / distance
    return {
      x: current.x + dx * ratio,
      y: current.y + dy * ratio
    }
  }

  const gatherStone = async (stoneId: string) => {
    if (gameState.isAnimating || gameState.stones.length === 0) return

    const stone = gameState.stones.find(s => s.id === stoneId)
    if (!stone) return

    setGameState(prev => ({ ...prev, isAnimating: true }))

    // Move to stone
    while (Math.abs(gameState.player.x - stone.x) > 5 || Math.abs(gameState.player.y - stone.y) > 5) {
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          ...moveTowards(prev.player, stone, 5)
        }
      }))
      await new Promise(resolve => setTimeout(resolve, 16))
    }

    // Pick up stone
    await new Promise(resolve => setTimeout(resolve, 500))
    setGameState(prev => ({
      ...prev,
      stones: prev.stones.filter(s => s.id !== stoneId),
      playerCarrying: stone
    }))

    // Return to base
    while (Math.abs(gameState.player.x - gameState.base.x) > 5 || Math.abs(gameState.player.y - gameState.base.y) > 5) {
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          ...moveTowards(prev.player, prev.base, 5)
        }
      }))
      await new Promise(resolve => setTimeout(resolve, 16))
    }

    // Drop stone at base
    await new Promise(resolve => setTimeout(resolve, 500))
    setGameState(prev => ({
      ...prev,
      playerCarrying: null,
      isAnimating: false
    }))

    if (onStoneCollected) {
      onStoneCollected()
    }
  }

  useImperativeHandle(ref, () => ({
    gatherStone
  }), [gameState.isAnimating, gameState.stones])

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

      // Draw base
      ctx.beginPath()
      ctx.arc(gameState.base.x, gameState.base.y, gameState.base.size, 0, Math.PI * 2)
      ctx.fillStyle = gameState.base.color
      ctx.globalAlpha = 0.3
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.strokeStyle = gameState.base.color
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw stones
      gameState.stones.forEach(stone => {
        ctx.beginPath()
        ctx.arc(stone.x, stone.y, stone.size, 0, Math.PI * 2)
        ctx.fillStyle = stone.color
        ctx.fill()
      })

      // Draw player
      const player = gameState.player
      // Head
      ctx.beginPath()
      ctx.arc(player.x, player.y - player.size/2, player.size/4, 0, Math.PI * 2)
      ctx.fillStyle = player.color
      ctx.fill()

      // Body
      ctx.beginPath()
      ctx.moveTo(player.x, player.y - player.size/3)
      ctx.lineTo(player.x, player.y + player.size/3)
      ctx.strokeStyle = player.color
      ctx.lineWidth = 2
      ctx.stroke()

      // Arms
      ctx.beginPath()
      ctx.moveTo(player.x - player.size/3, player.y)
      ctx.lineTo(player.x + player.size/3, player.y)
      ctx.stroke()

      // Legs
      ctx.beginPath()
      ctx.moveTo(player.x, player.y + player.size/3)
      ctx.lineTo(player.x - player.size/3, player.y + player.size)
      ctx.moveTo(player.x, player.y + player.size/3)
      ctx.lineTo(player.x + player.size/3, player.y + player.size)
      ctx.stroke()

      // Draw carried stone if any
      if (gameState.playerCarrying) {
        ctx.beginPath()
        ctx.arc(player.x, player.y - player.size/4, gameState.playerCarrying.size, 0, Math.PI * 2)
        ctx.fillStyle = gameState.playerCarrying.color
        ctx.fill()
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