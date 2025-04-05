import React, { useCallback } from "react";
import { ManagementModeProps } from "@/features/management/Management.types";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";
import { ResourceType } from "@/features/shared/types/entities";

export const ManagementMode: React.FC<ManagementModeProps> = () => {
  const hasResource = useResourcesStore((state) => state.hasResource);
  const removeResource = useResourcesStore((state) => state.removeResource);
  const addResource = useResourcesStore((state) => state.addResource);

  const canCraftPebbles = hasResource(ResourceType.STONE, 1);

  const handleCraftPebbles = useCallback(() => {
    if (hasResource(ResourceType.STONE, 1)) {
      removeResource(ResourceType.STONE, 1);
      addResource(ResourceType.PEBBLE, 10);
    }
  }, [hasResource, removeResource, addResource]);

  return (
    <div className="management-mode p-4 text-white">
      <div className="management-section workshop mb-4">
        <h2>Workshop</h2>
        <div className="upgrade-list">
          <p>Combat Stats Upgrades (Coming Soon)</p>
        </div>
      </div>

      <div className="management-section laboratory mb-4">
        <h2>Laboratory</h2>
        <div className="research-list">
          <p>Research Projects (Coming Soon)</p>
        </div>
      </div>

      <div className="management-section crafting">
        <h2>Crafting</h2>
        <div className="crafting-list space-y-2">
          <p>Crafting Recipes:</p>
          <button
            onClick={handleCraftPebbles}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
            disabled={!canCraftPebbles}
          >
            Craft 10 Pebbles (Cost: 1 Stone)
          </button>
        </div>
      </div>
    </div>
  );
};
