'use client'

import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'
import { GameEntity } from './types/game.types'
import * as Phaser from 'phaser'
import MainScene from './scenes/MainScene'

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

const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(function GameCanvas(
  { onStoneCollected, onWoodCollected }, 
  ref
) {
  const gameRef = useRef<Phaser.Game | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<MainScene | null>(null)
  const callbacksRef = useRef({ onStoneCollected, onWoodCollected })

  // Update callbacks ref when props change
  useEffect(() => {
    callbacksRef.current = { onStoneCollected, onWoodCollected }
  }, [onStoneCollected, onWoodCollected])

  useEffect(() => {
    if (!containerRef.current) return

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: '#1e293b', // slate-800
      scene: MainScene,
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
      }
    }

    // Create the game instance
    gameRef.current = new Phaser.Game(config)

    // Get reference to the main scene
    gameRef.current.events.once('ready', () => {
      sceneRef.current = gameRef.current?.scene.getScene('MainScene') as MainScene
      sceneRef.current?.init({ 
        onStoneCollected: () => callbacksRef.current.onStoneCollected?.(),
        onWoodCollected: () => callbacksRef.current.onWoodCollected?.()
      })
    })

    return () => {
      gameRef.current?.destroy(true)
    }
  }, []) // Remove callbacks from dependencies

  useImperativeHandle(ref, () => ({
    gatherStone: async (stoneId: string) => {
      await sceneRef.current?.gatherResource(stoneId)
    },
    gatherWood: async (woodId: string) => {
      await sceneRef.current?.gatherResource(woodId)
    },
    getAvailableStones: () => {
      const resources = sceneRef.current?.getAvailableResources('stone') || []
      return resources.map(r => ({
        id: r.id,
        x: 0,
        y: 0,
        type: 'stone',
        size: 8,
        color: '#94a3b8'
      }))
    },
    getAvailableWood: () => {
      const resources = sceneRef.current?.getAvailableResources('wood') || []
      return resources.map(r => ({
        id: r.id,
        x: 0,
        y: 0,
        type: 'wood',
        size: 15,
        color: '#ca8a04'
      }))
    }
  }), [])

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      data-testid="game-canvas"
    />
  )
})

export default GameCanvas 