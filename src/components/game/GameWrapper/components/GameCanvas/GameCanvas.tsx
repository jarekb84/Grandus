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
  type: 'player' | 'base' | 'stone' | 'wood'
  size: number
  color: string
  isCarried?: boolean
}

interface GameState {
  player: GameEntity
  base: GameEntity
  stones: GameEntity[]
  wood: GameEntity[]
  playerCarrying: GameEntity | null
  isAnimating: boolean
}

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
    wood: [
      { id: 'wood1', x: 150, y: 150, type: 'wood', size: 15, color: '#ca8a04' },
      { id: 'wood2', x: 650, y: 150, type: 'wood', size: 15, color: '#ca8a04' },
      { id: 'wood3', x: 250, y: 550, type: 'wood', size: 15, color: '#ca8a04' },
      { id: 'wood4', x: 550, y: 550, type: 'wood', size: 15, color: '#ca8a04' },
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

    // Create a local copy of the state to work with
    let currentState = { ...gameState, isAnimating: true }
    setGameState(currentState)

    // Move to stone
    while (Math.abs(currentState.player.x - stone.x) > 5 || Math.abs(currentState.player.y - stone.y) > 5) {
      const newPosition = moveTowards(currentState.player, stone, 5)
      currentState = {
        ...currentState,
        player: {
          ...currentState.player,
          ...newPosition
        }
      }
      setGameState(currentState)
      await new Promise(resolve => setTimeout(resolve, 16))
    }

    // Pick up stone
    await new Promise(resolve => setTimeout(resolve, 500))
    currentState = {
      ...currentState,
      stones: currentState.stones.filter(s => s.id !== stoneId),
      playerCarrying: stone
    }
    setGameState(currentState)

    // Return to base
    while (Math.abs(currentState.player.x - currentState.base.x) > 5 || 
           Math.abs(currentState.player.y - currentState.base.y) > 5) {
      const newPosition = moveTowards(currentState.player, currentState.base, 5)
      currentState = {
        ...currentState,
        player: {
          ...currentState.player,
          ...newPosition
        }
      }
      setGameState(currentState)
      await new Promise(resolve => setTimeout(resolve, 16))
    }

    // Drop stone at base
    await new Promise(resolve => setTimeout(resolve, 500))
    currentState = {
      ...currentState,
      playerCarrying: null,
      isAnimating: false
    }
    setGameState(currentState)

    if (onStoneCollected) {
      onStoneCollected()
    }
  }

  const gatherWood = async (woodId: string) => {
    if (gameState.isAnimating || gameState.wood.length === 0) return

    const wood = gameState.wood.find(w => w.id === woodId)
    if (!wood) return

    // Create a local copy of the state to work with
    let currentState = { ...gameState, isAnimating: true }
    setGameState(currentState)

    // Move to wood
    while (Math.abs(currentState.player.x - wood.x) > 5 || Math.abs(currentState.player.y - wood.y) > 5) {
      const newPosition = moveTowards(currentState.player, wood, 5)
      currentState = {
        ...currentState,
        player: {
          ...currentState.player,
          ...newPosition
        }
      }
      setGameState(currentState)
      await new Promise(resolve => setTimeout(resolve, 16))
    }

    // Pick up wood
    await new Promise(resolve => setTimeout(resolve, 500))
    currentState = {
      ...currentState,
      wood: currentState.wood.filter(w => w.id !== woodId),
      playerCarrying: wood
    }
    setGameState(currentState)

    // Return to base
    while (Math.abs(currentState.player.x - currentState.base.x) > 5 || 
           Math.abs(currentState.player.y - currentState.base.y) > 5) {
      const newPosition = moveTowards(currentState.player, currentState.base, 5)
      currentState = {
        ...currentState,
        player: {
          ...currentState.player,
          ...newPosition
        }
      }
      setGameState(currentState)
      await new Promise(resolve => setTimeout(resolve, 16))
    }

    // Drop wood at base
    await new Promise(resolve => setTimeout(resolve, 500))
    currentState = {
      ...currentState,
      playerCarrying: null,
      isAnimating: false
    }
    setGameState(currentState)

    if (onWoodCollected) {
      onWoodCollected()
    }
  }

  useImperativeHandle(ref, () => ({
    gatherStone,
    gatherWood,
    getAvailableStones: () => gameState.stones,
    getAvailableWood: () => gameState.wood
  }), [gameState.isAnimating, gameState.stones, gameState.wood])

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

      // Draw wood
      gameState.wood.forEach(wood => {
        // Draw log body
        ctx.beginPath()
        ctx.save()
        ctx.translate(wood.x, wood.y)
        ctx.rotate(Math.PI / 4) // Rotate 45 degrees
        ctx.fillStyle = wood.color
        ctx.fillRect(-wood.size, -wood.size/3, wood.size * 2, wood.size/1.5)
        
        // Add wood grain lines
        ctx.strokeStyle = '#92400e'
        ctx.lineWidth = 1
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath()
          ctx.moveTo(-wood.size + (i * wood.size/2), -wood.size/3)
          ctx.lineTo(-wood.size + (i * wood.size/2), wood.size/3)
          ctx.stroke()
        }
        ctx.restore()
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