'use client'

import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'
import { GameEntity } from './types/game.types'
import type * as Phaser from 'phaser'
import MainScene from './scenes/MainScene'

interface GameCanvasProps {
  onStoneCollected?: () => void
  onWoodCollected?: () => void
  onFoodCollected?: () => void
}

export interface GameCanvasHandle {
  gatherStone: (stoneId: string) => Promise<void>
  gatherWood: (woodId: string) => Promise<void>
  gatherFood: (foodId: string) => Promise<void>
  getAvailableStones: () => GameEntity[]
  getAvailableWood: () => GameEntity[]
  getAvailableFood: () => GameEntity[]
}

const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(function GameCanvas(
  { onStoneCollected, onWoodCollected, onFoodCollected }, 
  ref
) {  
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<MainScene | null>(null)
  const callbacksRef = useRef({ onStoneCollected, onWoodCollected, onFoodCollected })

  // Update callbacks ref when props change
  useEffect(() => {
    callbacksRef.current = { onStoneCollected, onWoodCollected, onFoodCollected }
  }, [onStoneCollected, onWoodCollected, onFoodCollected])

  useEffect(() => {
    if (!containerRef.current) return

    let game: Phaser.Game | undefined

    const initPhaser = async () => {
      const Phaser = (await import('phaser')).default

      const mainScene = new MainScene()
      
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: containerRef.current,
        backgroundColor: '#1e293b', // slate-800
        scene: {
          preload: function(this: Phaser.Scene) {
            mainScene.init({ 
              onStoneCollected: () => callbacksRef.current.onStoneCollected?.(),
              onWoodCollected: () => callbacksRef.current.onWoodCollected?.(),
              onFoodCollected: () => callbacksRef.current.onFoodCollected?.(),
              scene: this
            })
            mainScene.preload()
          },
          create: function(this: Phaser.Scene) {
            mainScene.create()
          },
          update: function(this: Phaser.Scene) {
            mainScene.update()
          }
        },
        scale: {
          mode: Phaser.Scale.RESIZE,
          width: '100%',
          height: '100%'
        }
      }

      // Create the game instance
      game = new Phaser.Game(config)

      // Store scene reference
      sceneRef.current = mainScene
    }

    initPhaser()

    return () => {
      game?.destroy(true)
    }
  }, []) // Remove callbacks from dependencies

  useImperativeHandle(ref, () => ({
    gatherStone: async (stoneId: string) => {
      await sceneRef.current?.gatherResource(stoneId)
    },
    gatherWood: async (woodId: string) => {
      await sceneRef.current?.gatherResource(woodId)
    },
    gatherFood: async (foodId: string) => {
      await sceneRef.current?.gatherResource(foodId)
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
    },
    getAvailableFood: () => {
      const resources = sceneRef.current?.getAvailableResources('food') || []
      return resources.map(r => ({
        id: r.id,
        x: 0,
        y: 0,
        type: 'food',
        size: 12,
        color: '#22c55e'
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