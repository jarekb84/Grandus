'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { useGameState } from '@/game/state/GameState'
import { EntityType, ResourceType } from '@/game/entities.types'
import type { GameCanvasHandle } from './components/GameCanvas/GameCanvas'
import Inventory from './components/Inventory/Inventory'

// Import GameCanvas with no SSR
const GameCanvas = dynamic(
  () => import('./components/GameCanvas/GameCanvas').then(mod => mod.GameCanvas),
  { ssr: false }
)

const GameWrapper = () => {
  const gameCanvasRef = useRef<GameCanvasHandle>(null)
  const { entities, inventory } = useGameState()

  const handleGatherResource = (type: ResourceType) => {
    if (!gameCanvasRef.current) return
    
    const resources = Array.from(entities.values())
      .filter(entity => 
        entity.type === EntityType.RESOURCE && 
        'resourceType' in entity && 
        entity.resourceType === type
      )

    if (resources.length > 0) {
      gameCanvasRef.current.gatherResource(resources[0].id)
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
          className="block px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Gather Stone
        </button>
        <button
          onClick={() => handleGatherResource(ResourceType.WOOD)}
          className="block px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-600"
        >
          Gather Wood
        </button>
        <button
          onClick={() => handleGatherResource(ResourceType.FOOD)}
          className="block px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600"
        >
          Gather Food
        </button>
      </div>
    </div>
  )
}

export default GameWrapper 