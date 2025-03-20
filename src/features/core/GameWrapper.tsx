'use client'

import { useRef, useState } from 'react'
import { GameMode } from '@/features/shared/types/GameMode'
import type { GameCanvasHandle } from '@/features/game-engine/GameCanvas'
import Inventory from '@/features/shared/ui/Inventory'
import ModeSelector from './ModeSelector'
import GameContent from './GameContent'
import GatheringActions from '@/features/gathering/GatheringActions'
import { useInventoryAdapter } from './inventory/useInventoryAdapter'
import { useGatheringAdapter } from './gathering/useGatheringAdapter'

const GameWrapper = () => {
  const gameCanvasRef = useRef<GameCanvasHandle>(null)
  const [currentMode, setCurrentMode] = useState<GameMode>(GameMode.GATHERING)
  
  // Use adapters for cross-feature communication
  const inventoryData = useInventoryAdapter()
  const { isGathering, hasAvailableNodeType, gatherResource } = useGatheringAdapter(gameCanvasRef)

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
            stoneCount={inventoryData.stoneCount} 
            woodCount={inventoryData.woodCount} 
            foodCount={inventoryData.foodCount}
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
            onGather={gatherResource}
            hasAvailableNodeType={hasAvailableNodeType}
          />
        </div>
      )}
    </div>
  )
}

export default GameWrapper 
