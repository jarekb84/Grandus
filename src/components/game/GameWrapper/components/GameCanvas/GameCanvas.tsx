'use client'

import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MainScene } from '@/game/scenes/MainScene'
import { ResourceSystem } from '@/game/systems/ResourceSystem'
import { useGameState } from '@/game/state/GameState'
import { EntityType, ResourceType } from '@/game/types/entities.types'
import { generateInitialEntities } from '@/game/utils/entityGenerator'

// Types only import
import type * as Phaser from 'phaser'

export interface GameCanvasProps {
  onResourceCollected: (type: ResourceType) => void
}

export interface GameCanvasHandle {
  gatherResource: (resourceId: string) => void
}

const GameCanvasComponent = forwardRef<GameCanvasHandle, GameCanvasProps>(
  ({ onResourceCollected }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const gameRef = useRef<Phaser.Game | null>(null)
    const sceneRef = useRef<MainScene | null>(null)
    const systemsRef = useRef<{ resource: ResourceSystem } | null>(null)
    const { entities, addEntity } = useGameState()
    const [isClient, setIsClient] = useState(false)

    useImperativeHandle(ref, () => ({
      gatherResource: (resourceId: string) => {
        systemsRef.current?.resource.gatherResource(resourceId, 'player1')
      }
    }))

    useEffect(() => {
      setIsClient(true)
    }, [])

    useEffect(() => {
      if (!containerRef.current || !isClient) return

      let game: Phaser.Game | undefined

      const initGame = async () => {
        try {
          // Dynamically import Phaser only on client side
          const Phaser = (await import('phaser')).default

          const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: containerRef.current,
            width: 800,
            height: 600,
            backgroundColor: '#1e293b',
            scene: class extends MainScene {
              constructor() {
                super({
                  onEntityInteraction: (entityId: string, type: EntityType) => {
                    if (type === EntityType.RESOURCE) {
                      systemsRef.current?.resource.gatherResource(entityId, 'player1')
                    }
                  }
                })
              }

              create() {
                super.create()
                
                // Store scene reference after it's fully initialized
                sceneRef.current = this

                systemsRef.current = {
                  resource: new ResourceSystem(this)
                }

                const initialEntities = generateInitialEntities()
                initialEntities.forEach(entity => {
                  addEntity(entity)
                  this.addEntity(entity)
                })
              }
            }
          }

          game = new Phaser.Game(config)
          gameRef.current = game
        } catch (error) {
          console.error('Failed to initialize game:', error)
        }
      }

      // Initialize the game
      initGame()

      return () => {
        game?.destroy(true)
        gameRef.current = null
        sceneRef.current = null
        systemsRef.current = null
      }
    }, [isClient, addEntity])

    return <div ref={containerRef} className="w-full h-full bg-gray-900" />
  }
)

GameCanvasComponent.displayName = 'GameCanvas'

// Use dynamic import with ssr disabled for the component
export const GameCanvas = dynamic(() => Promise.resolve(GameCanvasComponent), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-900" />
}) 