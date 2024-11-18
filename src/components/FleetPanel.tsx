import React, { useState, useMemo } from 'react';
import { Planet } from '../types/game';
import { COMBAT_UNITS } from '../constants/units';
import { useGameStore } from '../store/gameStore';
import { 
  Rocket, Shield, Swords, Gauge, Clock, Send, Eye, Truck,
  AlertTriangle, Navigation, Fuel, Recycle, ParkingSquare,
  Globe2, CheckSquare
} from 'lucide-react';
import Section from './Section';
import { formatTime } from '../utils/time';
import { BUILDING_TYPES } from '../constants/game';
import { calculateTravelTime } from '../utils/universe';
import ResourceSelector from './ResourceSelector';
import { useUniverseStore } from '../store/universeStore';

interface FleetPanelProps {
  planet: Planet;
}

const FleetPanel: React.FC<FleetPanelProps> = ({ planet }) => {
  const { player, launchFleet } = useGameStore();
  const { planets: universePlanets } = useUniverseStore();
  const [selectedMission, setSelectedMission] = useState<'attack' | 'spy' | 'transport' | 'recycle' | 'park' | 'colonize' | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<{ [key: string]: number }>({});
  const [selectedResources, setSelectedResources] = useState({
    iron: 0, kryptonite: 0, metal: 0, spice: 0,
  });
  const [destination, setDestination] = useState({
    galaxy: planet.coordinates.galaxy,
    system: planet.coordinates.system,
    position: planet.coordinates.position
  });

  const starbase = planet.buildings.find(b => b.id === BUILDING_TYPES.STARBASE);
  const hasStarbase = starbase && starbase.level > 0;
  const starbaseLevel = starbase?.level || 0;

  const totalCargoCapacity = useMemo(() => 
    Object.entries(selectedUnits).reduce((total, [unitId, count]) => 
      total + (COMBAT_UNITS[unitId].capacity * count), 0), [selectedUnits]);

  const fleetStats = useMemo(() => {
    if (!selectedMission || Object.keys(selectedUnits).length === 0) return null;

    const selectedShips = Object.entries(selectedUnits)
      .filter(([_, count]) => count > 0)
      .map(([unitId]) => COMBAT_UNITS[unitId]);

    if (selectedShips.length === 0) return null;

    const travelTime = calculateTravelTime(planet.coordinates, destination);
    const fuelConsumption = Object.entries(selectedUnits)
      .reduce((total, [unitId, count]) => {
        const unit = COMBAT_UNITS[unitId];
        return total + (unit.consumption * count * travelTime.total / 3600);
      }, 0);

    return {
      travelTime,
      fuelConsumption: Math.ceil(fuelConsumption),
      speed: Math.min(...selectedShips.map(ship => ship.speed))
    };
  }, [selectedUnits, destination, selectedMission, planet.coordinates]);

  const unitsInProgress = planet.unitsInProduction.reduce((acc, unit) => {
    if (!acc[unit.unitId]) acc[unit.unitId] = [];
    acc[unit.unitId].push(unit);
    return acc;
  }, {} as { [key: string]: typeof planet.unitsInProduction });

  const missions = [
    { id: 'attack' as const, name: 'Attack', icon: <Swords className="w-4 h-4" />, level: 2 },
    { id: 'spy' as const, name: 'Spy', icon: <Eye className="w-4 h-4" />, level: 1 },
    { id: 'transport' as const, name: 'Transport', icon: <Truck className="w-4 h-4" />, level: 1 },
    { id: 'recycle' as const, name: 'Recycle', icon: <Recycle className="w-4 h-4" />, level: 2 },
    { id: 'park' as const, name: 'Park', icon: <ParkingSquare className="w-4 h-4" />, level: 1 },
    { id: 'colonize' as const, name: 'Colonize', icon: <Globe2 className="w-4 h-4" />, level: 3 }
  ];

  const canColonize = useMemo(() => {
    if (selectedMission !== 'colonize') return true;
    
    // Check if player has reached planet limit
    if (player.planets.length >= 10) return false;
    
    // Check if destination is already colonized
    const targetPlanet = universePlanets.find(p => 
      p.coordinates.galaxy === destination.galaxy &&
      p.coordinates.system === destination.system &&
      p.coordinates.position === destination.position
    );
    
    if (!targetPlanet || targetPlanet.isColonized) return false;
    
    // Check if colony ship is selected
    return selectedUnits['colonyShip'] > 0;
  }, [selectedMission, player.planets.length, destination, universePlanets, selectedUnits]);

  const handleSelectAll = (unitId: string) => {
    const availableUnits = planet.units[unitId] || 0;
    setSelectedUnits(prev => ({
      ...prev,
      [unitId]: availableUnits
    }));
  };

  const handleLaunchMission = () => {
    if (!selectedMission || !fleetStats) return;

    // Check if trying to colonize origin planet
    const destString = `${destination.galaxy}:${destination.system}:${destination.position}`;
    const originString = `${planet.coordinates.galaxy}:${planet.coordinates.system}:${planet.coordinates.position}`;
    
    if (selectedMission === 'colonize' && destString === originString) {
      alert('Cannot colonize origin planet. Please select a different destination.');
      return;
    }

    const fleet = {
      id: `fleet-${Date.now()}`,
      units: selectedUnits,
      origin: planet.id,
      destination: destString,
      mission: selectedMission,
      arrivalTime: Date.now() + (fleetStats.travelTime.total * 1000),
      returnTime: null,
      resources: selectedMission === 'transport' || selectedMission === 'colonize' ? selectedResources : undefined
    };

    launchFleet(fleet);

    // Reset form
    setSelectedMission(null);
    setSelectedUnits({});
    setSelectedResources({ iron: 0, kryptonite: 0, metal: 0, spice: 0 });
  };

  return (
    <Section
      title="Fleet Management"
      icon={<Rocket className="w-6 h-6 text-blue-400" />}
      disabled={!hasStarbase}
      disabledMessage="Starbase required to manage fleets"
    >
      {hasStarbase && (
        <div className="space-y-6">
          {/* Mission Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {missions.filter(m => m.level <= starbaseLevel).map(mission => (
              <button
                key={mission.id}
                onClick={() => setSelectedMission(mission.id)}
                className={`p-3 rounded-lg flex items-center justify-center space-x-2
                  ${selectedMission === mission.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                  }`}
              >
                {mission.icon}
                <span>{mission.name}</span>
              </button>
            ))}
          </div>

          {/* Available Ships */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(COMBAT_UNITS).map(([unitId, unit]) => {
              const available = planet.units[unitId] || 0;
              const selected = selectedUnits[unitId] || 0;
              const inProduction = unitsInProgress[unitId]?.reduce((sum, item) => sum + item.count, 0) || 0;

              return (
                <div key={unitId} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{unit.name}</h3>
                    <div className="text-sm">
                      <span className="text-blue-400">{available}</span>
                      {inProduction > 0 && (
                        <span className="text-gray-400 ml-2">(+{inProduction})</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="flex items-center">
                      <Swords className="w-3 h-3 text-red-400 mr-1" />
                      <span>{unit.attack}</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-3 h-3 text-blue-400 mr-1" />
                      <span>{unit.defense}</span>
                    </div>
                    <div className="flex items-center">
                      <Gauge className="w-3 h-3 text-green-400 mr-1" />
                      <span>{unit.speed}</span>
                    </div>
                    <div className="flex items-center">
                      <Fuel className="w-3 h-3 text-yellow-400 mr-1" />
                      <span>{unit.consumption}/h</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="0"
                      max={available}
                      value={selected}
                      onChange={(e) => setSelectedUnits({
                        ...selectedUnits,
                        [unitId]: Math.min(available, Math.max(0, parseInt(e.target.value) || 0))
                      })}
                      className="flex-1 bg-gray-600 rounded px-3 py-1"
                    />
                    <button
                      onClick={() => handleSelectAll(unitId)}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded"
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Destination Selection */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium mb-4">Destination</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Galaxy</label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={destination.galaxy}
                  onChange={(e) => setDestination({
                    ...destination,
                    galaxy: Math.max(1, Math.min(3, parseInt(e.target.value) || 1))
                  })}
                  className="w-full bg-gray-600 rounded px-3 py-1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">System</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={destination.system}
                  onChange={(e) => setDestination({
                    ...destination,
                    system: Math.max(1, Math.min(15, parseInt(e.target.value) || 1))
                  })}
                  className="w-full bg-gray-600 rounded px-3 py-1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Position</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={destination.position}
                  onChange={(e) => setDestination({
                    ...destination,
                    position: Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                  })}
                  className="w-full bg-gray-600 rounded px-3 py-1"
                />
              </div>
            </div>
          </div>

          {/* Resource Selection for Transport/Colonize */}
          {(selectedMission === 'transport' || selectedMission === 'colonize') && totalCargoCapacity > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium mb-4">Resources</h3>
              <ResourceSelector
                availableResources={planet.resources}
                selectedResources={selectedResources}
                onChange={setSelectedResources}
                maxCapacity={totalCargoCapacity}
              />
            </div>
          )}

          {/* Mission Summary */}
          {selectedMission && fleetStats && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium mb-4">Mission Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-400" />
                  <span>Travel Time: {formatTime(fleetStats.travelTime.total)}</span>
                </div>
                <div className="flex items-center">
                  <Fuel className="w-4 h-4 mr-2 text-yellow-400" />
                  <span>Fuel Usage: {fleetStats.fuelConsumption}/h</span>
                </div>
                <div className="flex items-center">
                  <Gauge className="w-4 h-4 mr-2 text-green-400" />
                  <span>Fleet Speed: {fleetStats.speed}</span>
                </div>
                {totalCargoCapacity > 0 && (
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-purple-400" />
                    <span>Cargo Capacity: {totalCargoCapacity}</span>
                  </div>
                )}
              </div>

              {selectedMission === 'colonize' && !canColonize && (
                <div className="mt-4 p-3 bg-red-500/20 rounded-lg flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-sm">
                    {player.planets.length >= 10
                      ? 'Maximum number of colonies reached'
                      : 'Colony ship required for colonization'}
                  </span>
                </div>
              )}

              <button
                onClick={handleLaunchMission}
                disabled={Object.values(selectedUnits).every(v => v === 0) || (selectedMission === 'colonize' && !canColonize)}
                className={`mt-4 w-full py-2 rounded-lg flex items-center justify-center space-x-2
                  ${Object.values(selectedUnits).some(v => v > 0) && (!selectedMission === 'colonize' || canColonize)
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-600 cursor-not-allowed'
                  }`}
              >
                <Send className="w-4 h-4" />
                <span>Launch Fleet</span>
              </button>
            </div>
          )}
        </div>
      )}
    </Section>
  );
};

export default FleetPanel;