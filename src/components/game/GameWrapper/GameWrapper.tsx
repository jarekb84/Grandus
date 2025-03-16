'use client'

import { useRef, useState, useCallback } from 'react'
import GameCanvas, { GameCanvasHandle } from './components/GameCanvas/GameCanvas'
import Inventory from './components/Inventory/Inventory'

const GameWrapper = () => {
  const gameCanvasRef = useRef<GameCanvasHandle>(null)
  const [stoneCount, setStoneCount] = useState(0)
  const [woodCount, setWoodCount] = useState(0)
  const [foodCount, setFoodCount] = useState(0)

  const handleGatherStone = () => {
    if (!gameCanvasRef.current) return
    
    const stones = gameCanvasRef.current.getAvailableStones()
    if (stones.length > 0) {
      gameCanvasRef.current.gatherStone(stones[0].id)
    }
  }

  const handleGatherWood = () => {
    if (!gameCanvasRef.current) return
    
    const wood = gameCanvasRef.current.getAvailableWood()
    if (wood.length > 0) {
      gameCanvasRef.current.gatherWood(wood[0].id)
    }
  }

  const handleGatherFood = () => {
    if (!gameCanvasRef.current) return
    
    const food = gameCanvasRef.current.getAvailableFood()
    if (food.length > 0) {
      gameCanvasRef.current.gatherFood(food[0].id)
    }
  }

  const handleStoneCollected = useCallback(() => {
    setStoneCount(prev => prev + 1)
  }, [])

  const handleWoodCollected = useCallback(() => {
    setWoodCount(prev => prev + 1)
  }, [])

  const handleFoodCollected = useCallback(() => {
    setFoodCount(prev => prev + 1)
  }, [])

  return (
    <div className="relative w-full h-screen bg-gray-900">
      <GameCanvas 
        ref={gameCanvasRef}
        onStoneCollected={handleStoneCollected}
        onWoodCollected={handleWoodCollected}
        onFoodCollected={handleFoodCollected}
      />
      <Inventory 
        stoneCount={stoneCount} 
        woodCount={woodCount} 
        foodCount={foodCount}
      />
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
        <button
          onClick={handleGatherFood}
          className="block px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600"
        >
          Gather Food
        </button>
      </div>
    </div>
  )
}

export default GameWrapper 