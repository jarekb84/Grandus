import React, { useCallback } from "react"; // Added useCallback
import { ManagementModeProps } from "@/features/management/Management.types";
import { useResourcesStore } from "@/features/shared/stores/Resources.store"; // Import store
import { ResourceType } from "@/features/shared/types/entities"; // Import ResourceType

export const ManagementMode: React.FC<ManagementModeProps> = () => {
  // Get store functions and state
  // Note: Destructuring functions directly might cause issues if the store instance changes.
  // It's often safer to select state and call actions via the hook instance.

  const hasResource = useResourcesStore((state) => state.hasResource);
  const removeResource = useResourcesStore((state) => state.removeResource);
  const addResource = useResourcesStore((state) => state.addResource);

  const canCraftPebbles = hasResource(ResourceType.STONE, 1);

  // Crafting handler
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
        {/* Placeholder for workshop upgrades */}
        <div className="upgrade-list">
          <p>Combat Stats Upgrades (Coming Soon)</p>
          {/* Will add upgrade components here */}
        </div>
      </div>

      <div className="management-section laboratory mb-4">
        <h2>Laboratory</h2>
        {/* Placeholder for laboratory research */}
        <div className="research-list">
          <p>Research Projects (Coming Soon)</p>
          {/* Will add research components here */}
        </div>
      </div>

      <div className="management-section crafting">
        <h2>Crafting</h2>
        {/* Placeholder for crafting system */}
        <div className="crafting-list space-y-2">
          <p>Crafting Recipes:</p>
          {/* Crafting Button */}
          <button
            onClick={handleCraftPebbles} // Added onClick handler
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
            disabled={!canCraftPebbles} // Added disabled state
          >
            Craft 10 Pebbles (Cost: 1 Stone)
          </button>
          {/* More recipes will be added later */}
        </div>
      </div>
    </div>
  );
};
