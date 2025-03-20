'use client'

import { useRef, useState } from 'react'
import { useGameState } from '@/features/shared/stores/GameState.store'
import { ResourceType } from '@/features/shared/types/entities'
import { GameMode } from '@/features/shared/types/GameMode'
import type { GameCanvasHandle } from '@/features/game-engine/GameCanvas'
import Inventory from '@/features/shared/ui/Inventory'
import { useResourcesStore } from '@/features/shared/stores/Resources.store'
import ModeSelector from './ModeSelector'
import GameContent from './GameContent'
import GatheringActions from '@/features/gathering/GatheringActions'
import { RESOURCE_TO_NODE_TYPE } from '@/features/shared/utils/resourceMapping'

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
      <div className="w-[1288px]">
        <ModeSelector 
          currentMode={currentMode} 
          onModeChange={handleModeChange} 
        />
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
        <GameContent 
          currentMode={currentMode} 
          gameCanvasRef={gameCanvasRef} 
        />
      </div>

      {/* Action panel below game */}
      {currentMode === GameMode.GATHERING && (
        <div className="w-[1288px]">
          <GatheringActions 
            isGathering={isGathering}
            onGather={handleGatherResource}
            hasAvailableNodeType={hasAvailableNodeType}
          />
        </div>
      )}
    </div>
  )
}

export default GameWrapper 
