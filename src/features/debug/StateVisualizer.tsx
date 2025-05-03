import React, { useState } from "react";
import { useResourceNodeStore } from "@/features/territory/ResourceNode.store";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";
import { useGameState } from "@/features/shared/stores/GameState.store";
import { useCurrencyStore } from "@/features/shared/stores/Currency.store";
import { useCombatStore } from "@/features/combat/Combat.store";

interface StoreSectionProps {
  title: string;
  data: object;
  expanded?: boolean;
}

const StoreSection: React.FC<StoreSectionProps> = ({
  title,
  data,
  expanded = false,
}) => {
  const [isOpen, setIsOpen] = useState(expanded);

  const toggleOpen = (): void => setIsOpen(!isOpen);

  return (
    <div className="mb-4 border border-gray-700 rounded">
      <button
        onClick={toggleOpen}
        className="w-full text-left bg-gray-700 hover:bg-gray-600 p-2 rounded-t font-semibold flex justify-between items-center"
      >
        <span>{title}</span>
        <span>{isOpen ? "[-]" : "[+]"}</span>
      </button>
      {isOpen && (
        <div className="p-2 bg-gray-800 rounded-b max-h-250 overflow-y-auto">
          <pre className="text-xs whitespace-pre-wrap break-all">
            {JSON.stringify(data, replacer, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

function replacer(key: string, value: unknown): unknown {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}

const StateVisualizer = (): React.ReactElement => {
  const resourceNodeState = useResourceNodeStore((state) => state);
  const resourcesState = useResourcesStore((state) => state);
  const gameState = useGameState((state) => state);
  const currencyState = useCurrencyStore((state) => state);
  const combatState = useCombatStore((state) => state);

  return (
    <div className="fixed top-4 right-4 w-100 h-[calc(100vh-2rem)] bg-gray-900 text-white p-4 border border-gray-700 rounded-lg shadow-lg overflow-y-auto z-50 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
        State Visualizer
      </h2>
      <StoreSection
        title="Resource Nodes"
        data={resourceNodeState.nodeStates}
        expanded
      />
      <StoreSection title="Resources" data={resourcesState} />
      <StoreSection title="Game State" data={gameState} />
      <StoreSection title="Currency" data={currencyState} />
      <StoreSection title="Combat" data={combatState} />
      <StoreSection
        title="Territory Scene Entities"
        data={{ status: "Data access not yet implemented" }}
      />
      <StoreSection
        title="Combat Scene Entities"
        data={{ status: "Data access not yet implemented" }}
      />
    </div>
  );
};

export default StateVisualizer;
