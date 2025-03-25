'use client'

import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import * as Phaser from 'phaser'
import { GatheringScene } from '@/features/gathering/Gathering.scene'
import { CombatScene } from '@/features/combat/Combat.scene'
import { ResourceSystem } from '@/features/gathering/Resource'
import { useGameState } from '@/features/shared/stores/GameState.store'
import { EntityType } from '@/features/shared/types/entities'
import { GameMode } from '@/features/shared/types/GameMode'
import { generateInitialEntities } from '@/features/shared/utils/entityGenerator'
import { useCurrencyStore } from '@/features/shared/stores/Currency.store'

export interface GameCanvasProps {
  className?: string;
}

export interface GameCanvasHandle {
  gatherFromNode: (nodeId: string) => Promise<void>
  switchMode: (mode: GameMode) => void
}

const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(
  (props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const gameRef = useRef<Phaser.Game | null>(null)
    const sceneRef = useRef<GatheringScene | CombatScene | null>(null)
    const systemsRef = useRef<{ resource: ResourceSystem } | null>(null)
    const initialEntitiesRef = useRef<ReturnType<typeof generateInitialEntities> | null>(null)
    const { addEntity } = useGameState()

    useImperativeHandle(ref, () => ({
      gatherFromNode: async (nodeId: string): Promise<void> => {
        if (!systemsRef.current) return
        await systemsRef.current.resource.gatherResource(nodeId, 'player1')
      },
      switchMode: (mode: GameMode): void => {
        if (!gameRef.current) return

        // Stop all current scenes
        gameRef.current.scene.scenes.forEach(scene => {
          gameRef.current?.scene.stop(scene.scene.key)
        })

        // Start the appropriate scene
        switch (mode) {
          case GameMode.GATHERING:
            gameRef.current.scene.start('MainScene')
            break
          case GameMode.COMBAT:
            gameRef.current.scene.start('CombatScene')
            break
          // Management mode is handled by React
        }
      }
    }))

    useEffect(() => {
      if (!containerRef.current) return

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
                onEntityInteraction: async (entityId: string, type: EntityType): Promise<void> => {
                  if (type === EntityType.RESOURCE_NODE) {
                    try {
                      await systemsRef.current?.resource.gatherResource(entityId, 'player1')
                    } catch (error) {
                      console.error('Error gathering resource:', error)
                    }
                  }
                },
                onPlayerHealthChanged: (): void => {}
              })
            }

            override create(): void {
              super.create()
              
              // Store scene reference after it's fully initialized
              sceneRef.current = this

              systemsRef.current = {
                resource: new ResourceSystem(this)
              }

              // Use stored entities if available
              const entities = initialEntitiesRef.current
              if (entities) {
                entities.forEach(entity => {
                  addEntity(entity)
                  this.addEntity(entity)
                })
              }
            }
          },
          class extends CombatScene {
            constructor() {
              super({
                onWaveComplete: (waveNumber: number, rewards: { [key: string]: number }): void => {
                  // TODO: Handle wave completion rewards
                  console.log(`Wave ${waveNumber} complete! Rewards:`, rewards)
                },
                onGameOver: (score: number): void => {
                  // TODO: Handle game over
                  console.log('Game Over! Score:', score)
                  
                  // Reset cash before restarting scene
                  const { resetCash } = useCurrencyStore.getState()
                  resetCash()
                  
                  // Restart the scene after a short delay
                  setTimeout(() => {
                    this.scene.restart()
                  }, 1000)
                },
                onStatsUpdate: (stats): void => {
                  // Stats are handled by the CombatMode component
                  console.log('Stats update:', stats)
                },
                onAmmoChanged: (ammo: number): void => {
                  // Handled by CombatMode component
                  console.log('Ammo changed:', ammo)
                },
                onOutOfAmmo: (): void => {
                  // Handled by CombatMode component
                  console.log('Out of ammo!')
                },
                onPlayerHealthChanged: (health: number): void => {
                  // Handled by CombatMode component
                  console.log('Player health changed:', health)
                }
              })
            }

            override create(): void {
              super.create()
              // Set auto-shooting to false initially
              this.setAutoShooting(false)
            }
          }
        ]
      }

      const game = new Phaser.Game(config)
      gameRef.current = game

      return (): void => {
        game.destroy(true)
        gameRef.current = null
        sceneRef.current = null
        systemsRef.current = null
        // Don't clear initialEntitiesRef so we keep the same entities
      }
    }, [addEntity])

    return <div ref={containerRef} className={`w-full h-full bg-gray-900 ${props.className ?? ''}`} />
  }
)

GameCanvas.displayName = 'GameCanvas'

export { GameCanvas }
export default GameCanvas 