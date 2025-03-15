'use client'

interface InventoryProps {
  stoneCount: number
  woodCount: number
}

const Inventory = ({ stoneCount, woodCount }: InventoryProps) => {
  return (
    <div className="fixed top-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <h2 className="text-lg font-bold mb-2">Inventory</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-400" />
          <span>Stone: {stoneCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-600" />
          <span>Wood: {woodCount}</span>
        </div>
      </div>
    </div>
  )
}

export default Inventory 