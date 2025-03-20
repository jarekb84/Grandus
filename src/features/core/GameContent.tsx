'use client'

import { FC, forwardRef, MutableRefObject } from 'react'
import dynamic from 'next/dynamic'
import { GameMode } from '@/features/shared/types/GameMode'
import { ManagementMode } from '@/features/management/Management'
import type { GameCanvasHandle } from '@/features/game-engine/GameCanvas'

// Import GameCanvas and CombatMode with no SSR
const GameCanvas = dynamic(
  () => import('@/features/game-engine/GameCanvas').then(mod => mod.GameCanvas),
  { ssr: false }
)

const CombatMode = dynamic(
  () => import('@/features/combat/Combat').then(mod => mod.CombatMode),
  { ssr: false }
)

interface GameContentProps {
  currentMode: GameMode
  gameCanvasRef: MutableRefObject<GameCanvasHandle | null>
}

const GameContent: FC<GameContentProps> = ({ currentMode, gameCanvasRef }) => {
  return (
    <div className="w-[1024px] bg-gray-800 rounded-lg">
      {currentMode === GameMode.MANAGEMENT ? (
        <ManagementMode />
      ) : currentMode === GameMode.COMBAT ? (
        <CombatMode />
      ) : (
        <GameCanvas ref={gameCanvasRef} />
      )}
    </div>
  )
}

export default GameContent 