'use client'

import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import * as Phaser from 'phaser'
import { MainScene } from '@/game/scenes/MainScene'
import { ResourceSystem } from '@/game/systems/ResourceSystem'
import { useGameState } from '@/game/state/GameState'
import { EntityType, ResourceType } from '@/game/types/entities.types'
import { generateInitialEntities } from '@/game/utils/entityGenerator'

export interface GameCanvasProps {
  onResourceCollected: (type: ResourceType) => void
}

export interface GameCanvasHandle {
  gatherResource: (resourceId: string) => void
}

const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(
  ({ onResourceCollected }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const gameRef = useRef<Phaser.Game | null>(null)
    const sceneRef = useRef<MainScene | null>(null)
    const systemsRef = useRef<{ resource: ResourceSystem } | null>(null)
    const { entities, addEntity } = useGameState()

    useImperativeHandle(ref, () => ({
      gatherResource: (resourceId: string) => {
        systemsRef.current?.resource.gatherResource(resourceId, 'player1')
      }
    }))

    useEffect(() => {
      if (!containerRef.current) return

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

      const game = new Phaser.Game(config)
      gameRef.current = game

      return () => {
        game.destroy(true)
        gameRef.current = null
        sceneRef.current = null
        systemsRef.current = null
      }
    }, [addEntity])

    return <div ref={containerRef} className="w-full h-full bg-gray-900" />
  }
)

GameCanvas.displayName = 'GameCanvas'

export { GameCanvas }
export default GameCanvas 