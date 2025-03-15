'use client'

import { useRef, useState } from 'react'
import GameCanvas, { GameCanvasHandle } from './components/GameCanvas/GameCanvas'
import Inventory from './components/Inventory/Inventory'

const GameWrapper = () => {
  const gameCanvasRef = useRef<GameCanvasHandle>(null)
  const [stoneCount, setStoneCount] = useState(0)
  const [woodCount, setWoodCount] = useState(0)

  const handleGatherStone = () => {
    if (!gameCanvasRef.current) return
    
    const canvas = gameCanvasRef.current
    const stones = canvas.getAvailableStones()
    
    if (stones.length > 0) {
      canvas.gatherStone(stones[0].id)
    }
  }

  const handleGatherWood = () => {
    if (!gameCanvasRef.current) return
    
    const canvas = gameCanvasRef.current
    const wood = canvas.getAvailableWood()
    
    if (wood.length > 0) {
      canvas.gatherWood(wood[0].id)
    }
  }

  const handleStoneCollected = () => {
    setStoneCount(prev => prev + 1)
  }

  const handleWoodCollected = () => {
    setWoodCount(prev => prev + 1)
  }

  return (
    <div className="relative w-full h-screen bg-gray-900">
      <GameCanvas 
        ref={gameCanvasRef}
        onStoneCollected={handleStoneCollected}
        onWoodCollected={handleWoodCollected}
      />
      <Inventory stoneCount={stoneCount} woodCount={woodCount} />
      <div className="fixed bottom-4 left-4 space-y-2">
        <button
          onClick={handleGatherStone}
          className="block px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Gather Stone
        </button>
        <button
          onClick={handleGatherWood}
          className="block px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-600"
        >
          Gather Wood
        </button>
      </div>
    </div>
  )
}

export default GameWrapper 