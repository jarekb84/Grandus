'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useGameState } from '@/game/state/GameState'
import { ResourceType, ResourceNodeType } from '@/game/entities.types'
import type { GameCanvasHandle } from './components/GameCanvas/GameCanvas'
import Inventory from './components/Inventory/Inventory'

// Import GameCanvas with no SSR
const GameCanvas = dynamic(
  () => import('./components/GameCanvas/GameCanvas').then(mod => mod.GameCanvas),
  { ssr: false }
)

// Map resource types to their primary node types
const RESOURCE_TO_NODE_TYPE = {
  [ResourceType.STONE]: ResourceNodeType.STONE_DEPOSIT,
  [ResourceType.WOOD]: ResourceNodeType.FALLEN_BRANCHES,
  [ResourceType.FOOD]: ResourceNodeType.BERRY_BUSH
}

const GameWrapper = () => {
  const gameCanvasRef = useRef<GameCanvasHandle>(null)
  const { inventory, getNodesByType, hasAvailableNodeType } = useGameState()
  const [isGathering, setIsGathering] = useState(false)

  const handleGatherResource = async (type: ResourceType) => {
    if (!gameCanvasRef.current || isGathering) return
    
    // Get the primary node type for this resource
    const nodeType = RESOURCE_TO_NODE_TYPE[type]
    if (!hasAvailableNodeType(nodeType)) return

    // Get available nodes of this type
    const nodes = getNodesByType(nodeType)
    const firstNode = nodes[0]
    if (firstNode) {
      setIsGathering(true)
      try {
        await gameCanvasRef.current.gatherFromNode(firstNode.id)
      } finally {
        setIsGathering(false)
      }
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      {/* Main game area with inventory */}
      <div className="relative flex gap-4 mb-4">
        {/* Left sidebar with inventory */}
        <div className="w-64">
          <Inventory 
            stoneCount={inventory.stone} 
            woodCount={inventory.wood} 
            foodCount={inventory.food}
          />
        </div>
        
        {/* Centered game canvas */}
        <div className="w-[1024px] h-[768px] bg-gray-800 rounded-lg overflow-hidden">
          <GameCanvas 
            ref={gameCanvasRef}
            onResourceCollected={(type) => {
              useGameState.getState().incrementResource(type)
            }}
          />
        </div>
      </div>

      {/* Action panel below game */}
      <div className="w-[1288px] bg-gray-800 rounded-lg p-4"> {/* Width matches game + inventory + gap */}
      <div className="flex flex-col gap-4">
        {/* Action categories */}
        <div className="flex gap-4">
          <div className="flex-1">
            {/* TODO break this out into a component */}
            <h3 className="text-white font-semibold mb-2">Resource Gathering</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleGatherResource(ResourceType.STONE)}
                disabled={isGathering || !hasAvailableNodeType(RESOURCE_TO_NODE_TYPE[ResourceType.STONE])}
                className={`flex-1 px-4 py-2 bg-gray-700 text-white rounded ${
                  isGathering || !hasAvailableNodeType(RESOURCE_TO_NODE_TYPE[ResourceType.STONE]) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-600'
                }`}
              >
                Gather Stone
              </button>
              <button
                onClick={() => handleGatherResource(ResourceType.WOOD)}
                disabled={isGathering || !hasAvailableNodeType(RESOURCE_TO_NODE_TYPE[ResourceType.WOOD])}
                className={`flex-1 px-4 py-2 bg-yellow-700 text-white rounded ${
                  isGathering || !hasAvailableNodeType(RESOURCE_TO_NODE_TYPE[ResourceType.WOOD]) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-yellow-600'
                }`}
              >
                Gather Wood
              </button>
              <button
                onClick={() => handleGatherResource(ResourceType.FOOD)}
                disabled={isGathering || !hasAvailableNodeType(RESOURCE_TO_NODE_TYPE[ResourceType.FOOD])}
                className={`flex-1 px-4 py-2 bg-green-700 text-white rounded ${
                  isGathering || !hasAvailableNodeType(RESOURCE_TO_NODE_TYPE[ResourceType.FOOD]) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-green-600'
                }`}
              >
                Gather Food
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameWrapper 