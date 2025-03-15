'use client'

interface StoneInventoryProps {
  count: number
}

export default function StoneInventory({ count }: StoneInventoryProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 text-white">
      <h2 className="text-lg font-semibold mb-2">Inventory</h2>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-slate-400"></div>
        <span>Stones: {count}</span>
      </div>
    </div>
  )
} 