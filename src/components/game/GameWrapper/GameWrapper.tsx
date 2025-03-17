'use client'

import { useCallback, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { GameMode } from '@/game/types/GameMode'
import { ResourceType } from '@/game/entities.types'
import { useGameState } from '@/game/state/GameState'
import { GameCanvasHandle } from './components/GameCanvas/GameCanvas'
import Inventory from './components/Inventory/Inventory'
import { ManagementMode } from '../ManagementMode/ManagementMode'
import styles from './GameWrapper.module.css'

// Import GameCanvas with no SSR
const GameCanvas = dynamic(
  () => import('./components/GameCanvas/GameCanvas').then(mod => mod.GameCanvas),
  { ssr: false }
)

export const GameWrapper: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<GameMode>(GameMode.GATHERING)
  const canvasRef = useRef<GameCanvasHandle>(null)
  const { inventory, incrementResource } = useGameState()

  const handleModeChange = useCallback((mode: GameMode) => {
    setCurrentMode(mode)
    canvasRef.current?.switchMode(mode)
  }, [])

  const handleResourceCollected = useCallback((type: ResourceType) => {
    incrementResource(type)
  }, [incrementResource])

  return (
    <div className={styles.container}>
      {/* Mode selection tabs */}
      <div className="w-[1288px] mb-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              currentMode === GameMode.GATHERING
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => handleModeChange(GameMode.GATHERING)}
          >
            Gathering
          </button>
          <button
            className={`px-4 py-2 rounded ${
              currentMode === GameMode.COMBAT
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => handleModeChange(GameMode.COMBAT)}
          >
            Combat
          </button>
          <button
            className={`px-4 py-2 rounded ${
              currentMode === GameMode.MANAGEMENT
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => handleModeChange(GameMode.MANAGEMENT)}
          >
            Management
          </button>
        </div>
      </div>

      {/* Game content */}
      <div className="w-[1288px] flex">
        <div className="flex-1">
          <GameCanvas
            ref={canvasRef}
            onResourceCollected={handleResourceCollected}
          />
        </div>
        <div className="w-64 ml-4">
          <Inventory 
            stoneCount={inventory.stone} 
            woodCount={inventory.wood} 
            foodCount={inventory.food}
          />
        </div>
      </div>
    </div>
  )
}

export default GameWrapper 