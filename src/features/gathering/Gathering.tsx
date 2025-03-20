'use client'

import React, { useRef } from 'react'
import type { GameCanvasHandle } from '@/features/game-engine/GameCanvas'
import GatheringActions from './GatheringActions'
import { useGatheringAdapter } from '@/features/core/gathering/useGatheringAdapter'
import dynamic from 'next/dynamic'

// Import canvas component dynamically to avoid SSR issues
const DynamicGameCanvas = dynamic(
  () => import('@/features/game-engine/GameCanvas').then(mod => mod.GameCanvas),
  { ssr: false }
)

export interface GatheringModeProps {
  // Props here if needed
}

export const GatheringMode: React.FC<GatheringModeProps> = () => {
  // Create local ref for the game canvas
  const gameCanvasRef = useRef<GameCanvasHandle>(null)
  
  // Use adapter to connect with gathering functionality
  const { isGathering, hasAvailableNodeType, gatherResource } = useGatheringAdapter(gameCanvasRef)

  return (
    <div className="flex flex-col w-full">
      {/* Game canvas area */}
      <div className="w-full h-[768px]">
        <DynamicGameCanvas ref={gameCanvasRef} />
      </div>
      
      {/* Gathering actions below the canvas */}
      <div className="w-full">
        <GatheringActions 
          isGathering={isGathering}
          onGather={gatherResource}
          hasAvailableNodeType={hasAvailableNodeType}
        />
      </div>
    </div>
  )
}

// Export both as named export and default export
export default GatheringMode 