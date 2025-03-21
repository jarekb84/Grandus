import { useState, useCallback, MutableRefObject, useMemo } from 'react'
import { ResourceType, ResourceNodeType } from '@/features/shared/types/entities'
import { useGameState } from '@/features/shared/stores/GameState.store'
import { RESOURCE_TO_NODE_TYPE } from '@/features/shared/utils/resourceMapping'
import type { GameCanvasHandle } from '@/features/game-engine/GameCanvas'

interface GatheringAdapter {
  isGathering: boolean
  hasAvailableNodeType: (nodeType: ResourceNodeType) => boolean
  gatherResource: (type: ResourceType) => Promise<void>
}

/**
 * Adapter hook for the gathering functionality
 * Provides a clean interface for the core feature to interact with gathering mechanics
 */
export const useGatheringAdapter = (
  gameCanvasRef: MutableRefObject<GameCanvasHandle | null>
): GatheringAdapter => {
  const [isGathering, setIsGathering] = useState(false)
  const { getNodesByType, hasAvailableNodeType } = useGameState()

  const gatherResource = useCallback(async (type: ResourceType) => {
    if (!gameCanvasRef.current || isGathering) return
    
    // Get the primary node type for this resource
    const nodeType = RESOURCE_TO_NODE_TYPE[type]
    if (!hasAvailableNodeType(nodeType)) return
    
    // Get available nodes of this type
    const nodes = getNodesByType(nodeType)
    const firstNode = nodes[0]
    if (firstNode) {
      setIsGathering(true)
      try {
        await gameCanvasRef.current.gatherFromNode(firstNode.id)
      } finally {
        setIsGathering(false)
      }
    }
  }, [gameCanvasRef, isGathering, getNodesByType, hasAvailableNodeType])

  // Return a stable reference to the adapter interface
  return useMemo(() => ({
    isGathering,
    hasAvailableNodeType,
    gatherResource
  }), [isGathering, hasAvailableNodeType, gatherResource])
} 