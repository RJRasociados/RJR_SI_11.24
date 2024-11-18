import React from 'react';
import { Resources } from '../types/game';
import { Mountain, Gem, Hammer, Droplet } from 'lucide-react';

interface ResourceSelectorProps {
  availableResources: Resources;
  selectedResources: {
    iron: number;
    kryptonite: number;
    metal: number;
    spice: number;
  };
  onChange: (resources: typeof selectedResources) => void;
  maxCapacity: number;
}

const ResourceSelector: React.FC<ResourceSelectorProps> = ({
  availableResources,
  selectedResources,
  onChange,
  maxCapacity,
}) => {
  const totalSelected = Object.values(selectedResources).reduce((a, b) => a + b, 0);
  const remainingCapacity = maxCapacity - totalSelected;

  const handleResourceChange = (resource: keyof typeof selectedResources, value: number) => {
    const newValue = Math.max(0, Math.min(value, availableResources[resource].current));
    const otherResourcesTotal = totalSelected - selectedResources[resource];
    
    // Ensure we don't exceed cargo capacity
    if (otherResourcesTotal + newValue > maxCapacity) {
      return;
    }

    onChange({
      ...selectedResources,
      [resource]: newValue,
    });
  };

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'iron': return <Mountain className="w-4 h-4 text-gray-400" />;
      case 'kryptonite': return <Gem className="w-4 h-4 text-green-400" />;
      case 'metal': return <Hammer className="w-4 h-4 text-blue-400" />;
      case 'spice': return <Droplet className="w-4 h-4 text-orange-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-400">
        <span>Cargo Capacity:</span>
        <span>{totalSelected.toLocaleString()} / {maxCapacity.toLocaleString()}</span>
      </div>

      {Object.entries(selectedResources).map(([resource, amount]) => (
        <div key={resource} className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {getResourceIcon(resource)}
              <span className="capitalize text-sm">{resource}</span>
            </div>
            <span className="text-sm text-gray-400">
              Available: {Math.floor(availableResources[resource as keyof Resources].current).toLocaleString()}
            </span>
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => handleResourceChange(resource as keyof typeof selectedResources, parseInt(e.target.value) || 0)}
              className="flex-1 bg-gray-600 rounded px-3 py-1 text-white"
              min="0"
              max={Math.min(availableResources[resource as keyof Resources].current, maxCapacity)}
            />
            <button
              onClick={() => handleResourceChange(
                resource as keyof typeof selectedResources,
                Math.min(
                  availableResources[resource as keyof Resources].current,
                  maxCapacity - (totalSelected - amount)
                )
              )}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
            >
              Max
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceSelector;