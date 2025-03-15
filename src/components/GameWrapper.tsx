'use client'

import { useRef, useState } from 'react'
import GameCanvas, { GameCanvasHandle } from '@/components/GameCanvas'
import ManagementUI from '@/components/ManagementUI'

export default function GameWrapper() {
  const canvasRef = useRef<GameCanvasHandle>(null)
  const [isGathering, setIsGathering] = useState(false)
  const [stoneCount, setStoneCount] = useState(0)

  const handleGatherStone = async () => {
    if (!canvasRef.current || isGathering) return
    
    setIsGathering(true)
    const stones = ['stone1', 'stone2', 'stone3', 'stone4', 'stone5']
    const availableStones = stones.slice(stoneCount)
    
    if (availableStones.length > 0) {
      await canvasRef.current.gatherStone(availableStones[0])
      setStoneCount(prev => prev + 1)
    }
    
    setIsGathering(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="w-full aspect-[16/9] max-w-4xl mx-auto bg-slate-800 rounded-lg overflow-hidden">
        <GameCanvas ref={canvasRef} onStoneCollected={() => {}} />
      </div>
      <div className="max-w-4xl mx-auto w-full">
        <ManagementUI 
          onGatherClick={handleGatherStone}
          isGathering={isGathering}
          stoneCount={stoneCount}
        />
      </div>
    </div>
  )
} 