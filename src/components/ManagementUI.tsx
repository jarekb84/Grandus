'use client'

import ActionButton from './ActionButton'
import StoneInventory from './StoneInventory'

interface ManagementUIProps {
  onGatherClick: () => void
  isGathering: boolean
  stoneCount: number
}

export default function ManagementUI({ onGatherClick, isGathering, stoneCount }: ManagementUIProps) {
  return (
    <div className="flex gap-4 items-start">
      <ActionButton onClick={onGatherClick} disabled={isGathering} />
      <StoneInventory count={stoneCount} />
    </div>
  )
} 