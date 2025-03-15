'use client'

import Button from './components/Button'
import StoneInventory from './components/StoneInventory'

interface ManagementUIProps {
  onGatherClick: () => void
  isGathering: boolean
  stoneCount: number
}

export default function ManagementUI({ onGatherClick, isGathering, stoneCount }: ManagementUIProps) {
  return (
    <div className="flex gap-4 items-start">
      <Button onClick={onGatherClick} disabled={isGathering} label="Gather Stone" />
      <StoneInventory count={stoneCount} />
    </div>
  )
} 