import { FC } from "react";
import {
  ResourceType,
  ResourceNodeType,
} from "@/features/shared/types/entities";
import { RESOURCE_TO_NODE_TYPE } from "@/features/shared/utils/resourceMapping";

interface TerritoryActionsProps {
  isGathering: boolean;
  onGather: (type: ResourceType) => void;
  hasAvailableNodeType: (nodeType: ResourceNodeType) => boolean;
  onStartCombat: () => void;
}

const TerritoryActions: FC<TerritoryActionsProps> = ({
  isGathering,
  onGather,
  hasAvailableNodeType,
  onStartCombat,
}) => {
  return (
    <div className="w-full bg-gray-800 rounded-lg p-4 mt-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">Gather Resources</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onGather(ResourceType.STONE)}
                disabled={
                  isGathering ||
                  !hasAvailableNodeType(
                    RESOURCE_TO_NODE_TYPE[ResourceType.STONE],
                  )
                }
                className={`flex-1 px-4 py-2 bg-gray-700 text-white rounded ${
                  isGathering ||
                  !hasAvailableNodeType(
                    RESOURCE_TO_NODE_TYPE[ResourceType.STONE],
                  )
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-600"
                }`}
              >
                Gather Stone
              </button>
              <button
                onClick={() => onGather(ResourceType.WOOD)}
                disabled={
                  isGathering ||
                  !hasAvailableNodeType(
                    RESOURCE_TO_NODE_TYPE[ResourceType.WOOD],
                  )
                }
                className={`flex-1 px-4 py-2 bg-yellow-700 text-white rounded ${
                  isGathering ||
                  !hasAvailableNodeType(
                    RESOURCE_TO_NODE_TYPE[ResourceType.WOOD],
                  )
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-yellow-600"
                }`}
              >
                Gather Wood
              </button>
              <button
                onClick={() => onGather(ResourceType.FOOD)}
                disabled={
                  isGathering ||
                  !hasAvailableNodeType(
                    RESOURCE_TO_NODE_TYPE[ResourceType.FOOD],
                  )
                }
                className={`flex-1 px-4 py-2 bg-green-700 text-white rounded ${
                  isGathering ||
                  !hasAvailableNodeType(
                    RESOURCE_TO_NODE_TYPE[ResourceType.FOOD],
                  )
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-600"
                }`}
              >
                Gather Food
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">Territory Actions</h3>
            <div className="flex gap-2">
              <button
                onClick={onStartCombat}
                disabled={isGathering}
                className={`flex-1 px-4 py-2 bg-red-700 text-white rounded ${
                  isGathering
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-600"
                }`}
              >
                Expand Combat (Test Hex)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerritoryActions;
