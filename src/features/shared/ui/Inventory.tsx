'use client'

import { FC } from 'react'

interface InventoryProps {
  stoneCount: number
  woodCount: number
  foodCount: number
}

const Inventory: FC<InventoryProps> = ({ stoneCount, woodCount, foodCount }) => {
  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <h2 className="text-lg font-bold mb-3">Inventory</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-400 flex-shrink-0" />
          <span>Stone: {stoneCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-600 flex-shrink-0" />
          <span>Wood: {woodCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0" />
          <span>Food: {foodCount}</span>
        </div>
      </div>
    </div>
  )
}

export default Inventory 