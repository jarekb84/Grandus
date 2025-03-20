'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useGameState } from '@/features/shared/stores/GameState.store'
import { ResourceType, ResourceNodeType } from '@/features/shared/types/entities'
import { GameMode } from '@/features/shared/types/GameMode'
import type { GameCanvasHandle } from '@/features/game-engine/GameCanvas'
import Inventory from '@/features/shared/ui/Inventory'
import { ManagementMode } from '@/features/management/Management'
import { useResourcesStore } from '@/features/shared/stores/Resources.store'

// Import GameCanvas and CombatMode with no SSR
const GameCanvas = dynamic(
  () => import('@/features/game-engine/GameCanvas').then(mod => mod.GameCanvas),
  { ssr: false }
)

const CombatMode = dynamic(
  () => import('@/features/combat/Combat').then(mod => mod.CombatMode),
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
  const { getNodesByType, hasAvailableNodeType } = useGameState()
  const resourcesStore = useResourcesStore()
  const [isGathering, setIsGathering] = useState(false)
  const [currentMode, setCurrentMode] = useState<GameMode>(GameMode.GATHERING)

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

  const handleModeChange = (mode: GameMode) => {
    setCurrentMode(mode)
    if (gameCanvasRef.current) {
      gameCanvasRef.current.switchMode(mode)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      {/* Mode selection tabs */}
      <div className="w-[1288px] mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange(GameMode.GATHERING)}
            className={`px-6 py-2 rounded-t-lg ${
              currentMode === GameMode.GATHERING
                ? 'bg-gray-800 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Gathering
          </button>
          <button
            onClick={() => handleModeChange(GameMode.MANAGEMENT)}
            className={`px-6 py-2 rounded-t-lg ${
              currentMode === GameMode.MANAGEMENT
                ? 'bg-gray-800 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Management
          </button>
          <button
            onClick={() => handleModeChange(GameMode.COMBAT)}
            className={`px-6 py-2 rounded-t-lg ${
              currentMode === GameMode.COMBAT
                ? 'bg-gray-800 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Combat
          </button>
        </div>
      </div>

      {/* Main game area with inventory */}
      <div className="relative flex gap-4">
        {/* Left sidebar with inventory */}
        <div className="w-64">
          <Inventory 
            stoneCount={resourcesStore.resources[ResourceType.STONE]} 
            woodCount={resourcesStore.resources[ResourceType.WOOD]} 
            foodCount={resourcesStore.resources[ResourceType.FOOD]}
          />
        </div>
        
        {/* Main content area */}
        <div className="w-[1024px] bg-gray-800 rounded-lg">
          {currentMode === GameMode.MANAGEMENT ? (
            <ManagementMode />
          ) : currentMode === GameMode.COMBAT ? (
            <CombatMode />
          ) : (
            <GameCanvas ref={gameCanvasRef} />
          )}
        </div>
      </div>

      {/* Action panel below game */}
      {currentMode === GameMode.GATHERING && (
        <div className="w-[1288px] bg-gray-800 rounded-lg p-4 mt-4">
          <div className="flex flex-col gap-4">
            {/* Action categories */}
            <div className="flex gap-4">
              <div className="flex-1">
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
      )}
    </div>
  )
}

export default GameWrapper 
