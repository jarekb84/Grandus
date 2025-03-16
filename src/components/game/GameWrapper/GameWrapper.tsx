'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useGameState } from '@/game/state/GameState'
import { ResourceType } from '@/game/entities.types'
import type { GameCanvasHandle } from './components/GameCanvas/GameCanvas'
import Inventory from './components/Inventory/Inventory'

// Import GameCanvas with no SSR
const GameCanvas = dynamic(
  () => import('./components/GameCanvas/GameCanvas').then(mod => mod.GameCanvas),
  { ssr: false }
)

const GameWrapper = () => {
  const gameCanvasRef = useRef<GameCanvasHandle>(null)
  const { inventory, getResourceEntitiesByType, hasAvailableResource } = useGameState()
  const [isGathering, setIsGathering] = useState(false)

  const handleGatherResource = async (type: ResourceType) => {
    if (!gameCanvasRef.current || isGathering || !hasAvailableResource(type)) return
    
    const resources = getResourceEntitiesByType(type)
    const firstResource = resources[0]
    if (firstResource) {
      setIsGathering(true)
      try {
        await gameCanvasRef.current.gatherResource(firstResource.id)
      } finally {
        setIsGathering(false)
      }
    }
  }

  return (
    <div className="relative w-full h-screen bg-gray-900">
      <GameCanvas 
        ref={gameCanvasRef}
        onResourceCollected={(type) => {
          useGameState.getState().incrementResource(type)
        }}
      />      
      <Inventory 
        stoneCount={inventory.stone} 
        woodCount={inventory.wood} 
        foodCount={inventory.food}
      />
      <div className="fixed bottom-4 left-4 space-y-2">
        <button
          onClick={() => handleGatherResource(ResourceType.STONE)}
          disabled={isGathering || !hasAvailableResource(ResourceType.STONE)}
          className={`block px-4 py-2 bg-gray-700 text-white rounded min-w-[120px] ${
            isGathering || !hasAvailableResource(ResourceType.STONE) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
          }`}
        >
          Gather Stone
        </button>
        <button
          onClick={() => handleGatherResource(ResourceType.WOOD)}
          disabled={isGathering || !hasAvailableResource(ResourceType.WOOD)}
          className={`block px-4 py-2 bg-yellow-700 text-white rounded min-w-[120px] ${
            isGathering || !hasAvailableResource(ResourceType.WOOD) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
          }`}
        >
          Gather Wood
        </button>
        <button
          onClick={() => handleGatherResource(ResourceType.FOOD)}
          disabled={isGathering || !hasAvailableResource(ResourceType.FOOD)}
          className={`block px-4 py-2 bg-green-700 text-white rounded min-w-[120px] ${
            isGathering || !hasAvailableResource(ResourceType.FOOD) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
          }`}
        >
          Gather Food
        </button>
      </div>
    </div>
  )
}

export default GameWrapper 