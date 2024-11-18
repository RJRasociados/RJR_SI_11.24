import React from 'react';
import { Planet } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { Database, ArrowUp } from 'lucide-react';

interface StorageManagerProps {
  planet: Planet;
}

const StorageManager: React.FC<StorageManagerProps> = ({ planet }) => {
  const { resources } = planet;
  const upgradeStorage = useGameStore(state => state.upgradeStorage);

  const storageTypes = [
    {
      id: 'iron',
      name: 'Iron Storage',
      current: resources.iron.capacity,
      upgradeCost: {
        metal: Math.floor(resources.iron.capacity * 0.2),
        kryptonite: Math.floor(resources.iron.capacity * 0.1)
      }
    },
    {
      id: 'kryptonite',
      name: 'Kryptonite Storage',
      current: resources.kryptonite.capacity,
      upgradeCost: {
        metal: Math.floor(resources.kryptonite.capacity * 0.2),
        iron: Math.floor(resources.kryptonite.capacity * 0.1)
      }
    },
    {
      id: 'metal',
      name: 'Metal Storage',
      current: resources.metal.capacity,
      upgradeCost: {
        iron: Math.floor(resources.metal.capacity * 0.2),
        kryptonite: Math.floor(resources.metal.capacity * 0.1)
      }
    },
    {
      id: 'spice',
      name: 'Spice Storage',
      current: resources.spice.capacity,
      upgradeCost: {
        metal: Math.floor(resources.spice.capacity * 0.2),
        kryptonite: Math.floor(resources.spice.capacity * 0.1)
      }
    }
  ];

  const canUpgrade = (costs: { [key: string]: number }) => {
    return Object.entries(costs).every(([resource, cost]) => 
      resources[resource as keyof typeof resources].current >= cost
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Database className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold">Storage Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {storageTypes.map(storage => {
          const isUpgradeable = canUpgrade(storage.upgradeCost);
          
          return (
            <div key={storage.id} className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium mb-2">{storage.name}</h3>
              <div className="text-sm text-gray-400 mb-4">
                Current Capacity: {storage.current.toLocaleString()}
              </div>

              <div className="space-y-2 text-sm mb-4">
                <h4 className="text-gray-400">Upgrade Cost:</h4>
                {Object.entries(storage.upgradeCost).map(([resource, cost]) => (
                  <div key={resource} className="flex justify-between">
                    <span className="capitalize">{resource}:</span>
                    <span>{cost.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => upgradeStorage(planet.id, storage.id)}
                disabled={!isUpgradeable}
                className={`w-full py-2 px-4 rounded flex items-center justify-center space-x-2
                  ${isUpgradeable 
                    ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <ArrowUp className="w-4 h-4" />
                <span>Upgrade (+50%)</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StorageManager;
