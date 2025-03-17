'use client'

import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react'
import * as Phaser from 'phaser'
import { GatheringScene } from '@/game/scenes/GatheringScene'
import { ResourceSystem } from '@/game/systems/ResourceSystem'
import { useGameState } from '@/game/state/GameState'
import { EntityType, ResourceType } from '@/game/entities.types'
import { GameMode } from '@/game/types/GameMode'
import { generateInitialEntities } from '@/game/utils/entityGenerator'
import { CombatContainer } from '@/components/combat/CombatContainer/CombatContainer'

export interface GameCanvasProps {
  onResourceCollected: (type: ResourceType) => void
}

export interface GameCanvasHandle {
  gatherFromNode: (nodeId: string) => Promise<void>
  switchMode: (mode: GameMode) => void
}

const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(
  ({ onResourceCollected }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const gameRef = useRef<Phaser.Game | null>(null)
    const sceneRef = useRef<GatheringScene | null>(null)
    const systemsRef = useRef<{ resource: ResourceSystem } | null>(null)
    const initialEntitiesRef = useRef<ReturnType<typeof generateInitialEntities> | null>(null)
    const { addEntity } = useGameState()
    const [currentMode, setCurrentMode] = useState<GameMode>(GameMode.GATHERING)

    useImperativeHandle(ref, () => ({
      gatherFromNode: async (nodeId: string) => {
        if (!systemsRef.current) return
        await systemsRef.current.resource.gatherResource(nodeId, 'player1')
      },
      switchMode: (mode: GameMode) => {
        setCurrentMode(mode)
      }
    }))

    useEffect(() => {
      if (!containerRef.current || currentMode !== GameMode.GATHERING) return

      // Generate entities only once
      if (!initialEntitiesRef.current) {
        initialEntitiesRef.current = generateInitialEntities()
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: 1024,
        height: 768,
        backgroundColor: '#1e293b',
        scene: [
          class extends GatheringScene {
            constructor() {
              super({
                onEntityInteraction: (entityId: string, type: EntityType) => {
                  if (type === EntityType.RESOURCE_NODE) {
                    systemsRef.current?.resource.gatherResource(entityId, 'player1')
                  }
                }
              })
            }

            override create() {
              super.create()
              
              // Store scene reference after it's fully initialized
              sceneRef.current = this

              systemsRef.current = {
                resource: new ResourceSystem(this)
              }

              // Use stored entities instead of generating new ones
              const entities = initialEntitiesRef.current!
              entities.forEach(entity => {
                addEntity(entity)
                this.addEntity(entity)
              })
            }
          }
        ]
      }

      const game = new Phaser.Game(config)
      gameRef.current = game

      return () => {
        game.destroy(true)
        gameRef.current = null
        sceneRef.current = null
        systemsRef.current = null
        // Don't clear initialEntitiesRef so we keep the same entities
      }
    }, [addEntity, currentMode])

    if (currentMode === GameMode.COMBAT) {
      return <CombatContainer />
    }

    return <div ref={containerRef} className="w-full h-full bg-gray-900" />
  }
)

GameCanvas.displayName = 'GameCanvas'

export { GameCanvas }
export default GameCanvas 