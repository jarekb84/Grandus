'use client'

import { FC, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { GameMode } from '@/features/shared/types/GameMode'
import { ManagementMode } from '@/features/management/Management'

// Import components directly with dynamic
const DynamicGatheringMode = dynamic(
  () => import('@/features/gathering/Gathering').then(mod => mod.GatheringMode),
  { ssr: false }
)

const DynamicCombatMode = dynamic(
  () => import('@/features/combat/Combat').then(mod => mod.CombatMode), 
  { ssr: false }
)

interface GameContentProps {
  currentMode: GameMode
}

const GameContent: FC<GameContentProps> = ({ currentMode }) => {
  // Stabilize the render to prevent flashing/re-renders
  const content = useMemo(() => {
    switch (currentMode) {
      case GameMode.MANAGEMENT:
        return <ManagementMode />
      case GameMode.COMBAT:
        return <DynamicCombatMode />
      case GameMode.GATHERING:
        return <DynamicGatheringMode />
      default:
        return null
    }
  }, [currentMode])

  return (
    <div className="w-[1024px] bg-gray-800 rounded-lg">
      {content}
    </div>
  )
}

export default GameContent 