'use client'

import { useEffect, useRef } from 'react'

interface GameEntity {
  x: number
  y: number
  type: 'player' | 'base' | 'stone'
  size: number
  color: string
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initial game entities
  const entities: GameEntity[] = [
    // Player character
    { x: 400, y: 300, type: 'player', size: 20, color: '#4ade80' },
    // Home base
    { x: 400, y: 400, type: 'base', size: 40, color: '#60a5fa' },
    // Stones
    { x: 200, y: 200, type: 'stone', size: 15, color: '#94a3b8' },
    { x: 600, y: 200, type: 'stone', size: 15, color: '#94a3b8' },
    { x: 300, y: 500, type: 'stone', size: 15, color: '#94a3b8' },
    { x: 500, y: 500, type: 'stone', size: 15, color: '#94a3b8' },
    { x: 400, y: 150, type: 'stone', size: 15, color: '#94a3b8' },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Draw function
    const draw = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw entities
      entities.forEach(entity => {
        ctx.beginPath()
        
        if (entity.type === 'player') {
          // Draw stick figure
          const x = entity.x
          const y = entity.y
          const size = entity.size

          // Head
          ctx.beginPath()
          ctx.arc(x, y - size/2, size/4, 0, Math.PI * 2)
          ctx.fillStyle = entity.color
          ctx.fill()

          // Body
          ctx.beginPath()
          ctx.moveTo(x, y - size/3)
          ctx.lineTo(x, y + size/3)
          ctx.strokeStyle = entity.color
          ctx.lineWidth = 2
          ctx.stroke()

          // Arms
          ctx.beginPath()
          ctx.moveTo(x - size/3, y)
          ctx.lineTo(x + size/3, y)
          ctx.stroke()

          // Legs
          ctx.beginPath()
          ctx.moveTo(x, y + size/3)
          ctx.lineTo(x - size/3, y + size)
          ctx.moveTo(x, y + size/3)
          ctx.lineTo(x + size/3, y + size)
          ctx.stroke()
        } else if (entity.type === 'base') {
          // Draw base as a circle
          ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2)
          ctx.fillStyle = entity.color
          ctx.globalAlpha = 0.3
          ctx.fill()
          ctx.globalAlpha = 1
          ctx.strokeStyle = entity.color
          ctx.lineWidth = 2
          ctx.stroke()
        } else {
          // Draw stones as filled circles
          ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2)
          ctx.fillStyle = entity.color
          ctx.fill()
        }
      })
    }

    // Initial draw
    draw()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
} 