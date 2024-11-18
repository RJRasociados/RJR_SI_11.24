import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import UniverseMap from './UniverseMap';
import { Globe2, Battery, BatteryCharging, BatteryWarning, Edit2, Check, Mountain, Gem, Hammer, Droplet, Microscope } from 'lucide-react';
import Section from './Section';

const PlanetManagement: React.FC = () => {
  const { player, renamePlanet } = useGameStore();
  const [editingPlanetId, setEditingPlanetId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const handleStartEdit = (planetId: string, currentName: string) => {
    setEditingPlanetId(planetId);
    setNewName(currentName);
  };

  const handleSaveEdit = (planetId: string) => {
    if (newName.trim()) {
      renamePlanet(planetId, newName.trim());
    }
    setEditingPlanetId(null);
  };

  const totalResources = player.planets.reduce((acc, planet) => ({
    iron: acc.iron + planet.resources.iron.current,
    kryptonite: acc.kryptonite + planet.resources.kryptonite.current,
    metal: acc.metal + planet.resources.metal.current,
    spice: acc.spice + planet.resources.spice.current,
  }), {
    iron: 0,
    kryptonite: 0,
    metal: 0,
    spice: 0,
  });

  const getEnergyStatus = (production: number, consumption: number) => {
    const balance = Math.floor(production - consumption);
    if (balance > 0) return <BatteryCharging className="w-4 h-4 text-green-400" />;
    if (balance === 0) return <Battery className="w-4 h-4 text-yellow-400" />;
    return <BatteryWarning className="w-4 h-4 text-red-400" />;
  };

  return (
    <div className="space-y-6">
      <Section
        title="Empire Summary"
        icon={<Globe2 className="w-6 h-6 text-blue-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Globe2 className="w-5 h-5 text-blue-400 mr-2" />
              Total Resources
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mountain className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Iron</div>
                  <div>{Math.floor(totalResources.iron).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Gem className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-sm text-gray-400">Kryptonite</div>
                  <div>{Math.floor(totalResources.kryptonite).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Hammer className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-400">Metal</div>
                  <div>{Math.floor(totalResources.metal).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Droplet className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-sm text-gray-400">Spice</div>
                  <div>{Math.floor(totalResources.spice).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Microscope className="w-5 h-5 text-purple-400 mr-2" />
              Research Progress
            </h3>
            <div className="space-y-2">
              {player.research.filter(r => r.level > 0).map(tech => (
                <div key={tech.id} className="flex justify-between items-center">
                  <span className="text-sm">{tech.name}</span>
                  <span className="text-sm text-purple-400">Level {tech.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Universe Map"
        icon={<Globe2 className="w-6 h-6 text-blue-400" />}
      >
        <UniverseMap />
      </Section>

      <Section
        title="Empire Overview"
        icon={<Globe2 className="w-6 h-6 text-blue-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {player.planets.map(planet => (
            <div key={planet.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                {editingPlanetId === planet.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-gray-600 rounded px-2 py-1 text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(planet.id)}
                      className="p-1 hover:bg-gray-600 rounded"
                    >
                      <Check className="w-4 h-4 text-green-400" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{planet.name}</h3>
                    <button
                      onClick={() => handleStartEdit(planet.id, planet.name)}
                      className="p-1 hover:bg-gray-600 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                )}
                <div className="text-sm text-gray-400">
                  {planet.coordinates.galaxy}:{planet.coordinates.system}:{planet.coordinates.position}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-gray-400">Spaces:</span>
                  <span className="text-right">{planet.usedSpaces} / {planet.totalSpaces}</span>
                  <span className="text-gray-400">Buildings:</span>
                  <span className="text-right">{planet.buildings.filter(b => b.level > 0).length}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {Object.entries(planet.resources).map(([key, value]) => {
                    if (key === 'energy') {
                      const balance = Math.floor(value.production - value.consumption);
                      return (
                        <div key={key} className="col-span-2 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400 capitalize">{key}</span>
                            {getEnergyStatus(value.production, value.consumption)}
                          </div>
                          <div className="text-right">
                            <span className={balance >= 0 ? 'text-green-400' : 'text-red-400'}>
                              {balance}
                            </span>
                            <span className="text-gray-400 text-xs ml-1">
                              ({Math.floor(value.production)}/{Math.floor(value.consumption)})
                            </span>
                          </div>
                        </div>
                      );
                    }

                    const isOverCapacity = value.current > value.capacity;
                    return (
                      <div key={key} className="text-right">
                        <div className="text-xs text-gray-400 capitalize">{key}</div>
                        <div className={isOverCapacity ? 'text-yellow-400' : ''}>
                          {Math.floor(value.current).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default PlanetManagement;