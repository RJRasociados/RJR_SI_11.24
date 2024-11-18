import React, { useState } from 'react';
import { Planet } from '../types/game';
import { COMBAT_UNITS, DEFENSE_STRUCTURES } from '../constants/units';
import { useGameStore } from '../store/gameStore';
import { 
  Swords, 
  ShieldCheck,
  Clock, 
  AlertCircle, 
  Mountain, 
  Gem, 
  Hammer, 
  Gauge,
  Rocket,
  Hexagon,
  CircleDot,
  Zap,
  Shield,
  Lock
} from 'lucide-react';
import { BUILDING_TYPES } from '../constants/game';
import Section from './Section';
import { formatTime } from '../utils/time';
import { calculateConstructionTime, getConstructionTimeReduction, checkMilitaryRequirements } from '../utils/military';

interface MilitaryPanelProps {
  planet: Planet;
}

const MilitaryPanel: React.FC<MilitaryPanelProps> = ({ planet }) => {
  const { buildUnit, buildDefense } = useGameStore();
  const [unitCounts, setUnitCounts] = useState<{ [key: string]: number }>({});
  const [defenseCounts, setDefenseCounts] = useState<{ [key: string]: number }>({});

  const weaponsFactory = planet.buildings.find(b => b.id === BUILDING_TYPES.WEAPONS_FACTORY);
  const hasWeaponsFactory = weaponsFactory && weaponsFactory.level > 0;
  const timeReduction = getConstructionTimeReduction(planet);

  // Agrupar unidades en construcción por tipo
  const unitsInProgress = planet.unitsInProduction.reduce((acc, unit) => {
    if (!acc[unit.unitId]) {
      acc[unit.unitId] = [];
    }
    acc[unit.unitId].push(unit);
    return acc;
  }, {} as { [key: string]: typeof planet.unitsInProduction });

  // Agrupar defensas en construcción por tipo
  const defensesInProgress = planet.defensesInProduction.reduce((acc, defense) => {
    if (!acc[defense.defenseId]) {
      acc[defense.defenseId] = [];
    }
    acc[defense.defenseId].push(defense);
    return acc;
  }, {} as { [key: string]: typeof planet.defensesInProduction });

  const getShipIcon = (unitId: string) => {
    switch (unitId) {
      case 'lightFighter':
        return <Rocket className="w-5 h-5 text-blue-400" />;
      case 'heavyFighter':
        return <Hexagon className="w-5 h-5 text-indigo-400" />;
      case 'battleship':
        return <CircleDot className="w-5 h-5 text-purple-400" />;
      case 'colonyShip':
        return <Rocket className="w-5 h-5 rotate-45 text-green-400" />;
      default:
        return <Rocket className="w-5 h-5" />;
    }
  };

  const getDefenseIcon = (defenseId: string) => {
    switch (defenseId) {
      case 'laserTurret':
        return <Swords className="w-5 h-5 text-red-400" />;
      case 'plasmaCannon':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'shieldGenerator':
        return <Shield className="w-5 h-5 text-blue-400" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const calculateTotalCost = (unit: any, count: number) => {
    return {
      iron: unit.cost.iron * count,
      kryptonite: unit.cost.kryptonite * count,
      metal: unit.cost.metal * count,
    };
  };

  const canBuild = (costs: any, requirements: any) => {
    // Check resource costs
    const hasResources = (
      planet.resources.iron.current >= costs.iron &&
      planet.resources.kryptonite.current >= costs.kryptonite &&
      planet.resources.metal.current >= costs.metal
    );

    // Check building requirements
    const reqCheck = checkMilitaryRequirements(requirements, planet);

    return hasResources && reqCheck.met;
  };

  const getMissingRequirements = (requirements: any) => {
    return checkMilitaryRequirements(requirements, planet).missing;
  };

  return (
    <div className="space-y-6">
      <Section
        title="Military Units"
        icon={<Swords className="w-6 h-6 text-red-400" />}
        disabled={!hasWeaponsFactory}
        disabledMessage="Weapons Factory required to build units"
      >
        {hasWeaponsFactory && (
          <div className="mb-4 bg-gray-800 rounded-lg p-3 flex items-center">
            <Gauge className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-gray-300">Construction Speed Bonus: </span>
            <span className="text-blue-400 ml-1">{timeReduction.toFixed(0)}% faster</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(COMBAT_UNITS).map(([unitId, unit]) => {
            const count = unitCounts[unitId] || 0;
            const costs = calculateTotalCost(unit, count);
            const canBuildUnit = count > 0 && canBuild(costs, unit.requirements);
            const availableUnits = planet.units[unitId] || 0;
            const constructionTime = calculateConstructionTime(unit.buildTime, 1, planet);
            const missingReqs = getMissingRequirements(unit.requirements);
            const reqsMet = missingReqs.length === 0;
            const inProduction = unitsInProgress[unitId] || [];
            const totalInProduction = inProduction.reduce((sum, item) => sum + item.count, 0);

            return (
              <div key={unitId} className={`bg-gray-700 rounded-lg p-4 ${!reqsMet ? 'opacity-75' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    {getShipIcon(unitId)}
                    <h3 className="font-medium">{unit.name}</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-blue-400 mr-2">Available: {availableUnits}</span>
                    {!reqsMet && <Lock className="w-4 h-4 text-gray-500" />}
                  </div>
                </div>
                
                <div className="space-y-4 text-sm">
                  {/* Combat Stats */}
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex items-center">
                      <Swords className="w-3 h-3 text-red-400 mr-1" />
                      <span className="text-gray-400">Attack:</span>
                    </div>
                    <span className="text-right">{unit.attack}</span>
                    
                    <div className="flex items-center">
                      <ShieldCheck className="w-3 h-3 text-blue-400 mr-1" />
                      <span className="text-gray-400">Hull:</span>
                    </div>
                    <span className="text-right">{unit.defense}</span>
                    
                    <div className="flex items-center">
                      <Zap className="w-3 h-3 text-yellow-400 mr-1" />
                      <span className="text-gray-400">Shield:</span>
                    </div>
                    <span className="text-right">{unit.shield}</span>

                    <div className="flex items-center">
                      <Gauge className="w-3 h-3 text-green-400 mr-1" />
                      <span className="text-gray-400">Speed:</span>
                    </div>
                    <span className="text-right">{unit.speed}</span>

                    <div className="flex items-center">
                      <Gauge className="w-3 h-3 text-orange-400 mr-1" />
                      <span className="text-gray-400">Fuel Usage:</span>
                    </div>
                    <span className="text-right">{unit.consumption}/h</span>
                  </div>

                  {/* Construction Progress */}
                  {inProduction.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="text-sm font-medium text-gray-300">
                        In Production: {totalInProduction}
                      </div>
                      {inProduction.map((build, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Building {build.count} units</span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTime(build.timeRemaining)}
                            </span>
                          </div>
                          <div className="h-1 bg-gray-600 rounded-full">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                              style={{
                                width: `${((unit.buildTime - build.timeRemaining) / unit.buildTime) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {missingReqs.length > 0 && (
                    <div className="mt-2 p-2 bg-gray-800 rounded border border-gray-600">
                      <div className="flex items-center text-red-400 mb-2">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span className="font-medium">Missing Requirements:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        {missingReqs.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Unit Cost */}
                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400 mb-1">Unit Cost:</div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex items-center">
                        <Mountain className="w-3 h-3 text-gray-400 mr-1" />
                        <span>Iron:</span>
                      </div>
                      <span className="text-right">{unit.cost.iron.toLocaleString()}</span>
                      
                      <div className="flex items-center">
                        <Gem className="w-3 h-3 text-green-400 mr-1" />
                        <span>Kryptonite:</span>
                      </div>
                      <span className="text-right">{unit.cost.kryptonite.toLocaleString()}</span>
                      
                      <div className="flex items-center">
                        <Hammer className="w-3 h-3 text-blue-400 mr-1" />
                        <span>Metal:</span>
                      </div>
                      <span className="text-right">{unit.cost.metal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Build Time */}
                  <div className="flex items-center justify-between text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Build Time:</span>
                    </div>
                    <span>{formatTime(constructionTime)}/unit</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Build Quantity:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={count}
                      onChange={(e) => setUnitCounts({
                        ...unitCounts,
                        [unitId]: Math.max(0, parseInt(e.target.value) || 0),
                      })}
                      className="w-full bg-gray-600 rounded px-3 py-1 text-white"
                      disabled={!reqsMet}
                    />
                  </div>

                  {count > 0 && (
                    <div className="bg-gray-800 rounded p-2">
                      <div className="text-gray-400 mb-1">Total Cost:</div>
                      <div className="grid grid-cols-2 gap-1">
                        <span>Iron:</span>
                        <span className="text-right">{costs.iron.toLocaleString()}</span>
                        <span>Kryptonite:</span>
                        <span className="text-right">{costs.kryptonite.toLocaleString()}</span>
                        <span>Metal:</span>
                        <span className="text-right">{costs.metal.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-gray-400 mt-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatTime(calculateConstructionTime(unit.buildTime, count, planet))}</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    buildUnit(planet.id, unitId, count);
                    setUnitCounts({ ...unitCounts, [unitId]: 0 });
                  }}
                  disabled={!canBuildUnit || !reqsMet}
                  className={`mt-4 w-full py-2 px-4 rounded text-sm
                    ${canBuildUnit && reqsMet
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Build
                </button>
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        title="Planetary Defense"
        icon={<Shield className="w-6 h-6 text-blue-400" />}
        disabled={!hasWeaponsFactory}
        disabledMessage="Weapons Factory required to build defenses"
      >
        {hasWeaponsFactory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(DEFENSE_STRUCTURES).map(([defenseId, defense]) => {
              const count = defenseCounts[defenseId] || 0;
              const costs = calculateTotalCost(defense, count);
              const canBuildDefense = count > 0 && canBuild(costs, defense.requirements);
              const availableDefenses = planet.defenses[defenseId] || 0;
              const constructionTime = calculateConstructionTime(defense.buildTime, 1, planet);
              const missingReqs = getMissingRequirements(defense.requirements);
              const reqsMet = missingReqs.length === 0;
              const inProduction = defensesInProgress[defenseId] || [];
              const totalInProduction = inProduction.reduce((sum, item) => sum + item.count, 0);

              return (
                <div key={defenseId} className={`bg-gray-700 rounded-lg p-4 ${!reqsMet ? 'opacity-75' : ''}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      {getDefenseIcon(defenseId)}
                      <h3 className="font-medium">{defense.name}</h3>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-blue-400 mr-2">Built: {availableDefenses}</span>
                      {!reqsMet && <Lock className="w-4 h-4 text-gray-500" />}
                    </div>
                  </div>

                  <div className="space-y-4 text-sm">
                    {/* Combat Stats */}
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex items-center">
                        <Swords className="w-3 h-3 text-red-400 mr-1" />
                        <span className="text-gray-400">Attack:</span>
                      </div>
                      <span className="text-right">{defense.attack}</span>
                      
                      <div className="flex items-center">
                        <ShieldCheck className="w-3 h-3 text-blue-400 mr-1" />
                        <span className="text-gray-400">Hull:</span>
                      </div>
                      <span className="text-right">{defense.defense}</span>
                      
                      <div className="flex items-center">
                        <Zap className="w-3 h-3 text-yellow-400 mr-1" />
                        <span className="text-gray-400">Shield:</span>
                      </div>
                      <span className="text-right">{defense.shield}</span>
                    </div>

                    {/* Construction Progress */}
                    {inProduction.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <div className="text-sm font-medium text-gray-300">
                          In Production: {totalInProduction}
                        </div>
                        {inProduction.map((build, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Building {build.count} units</span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(build.timeRemaining)}
                              </span>
                            </div>
                            <div className="h-1 bg-gray-600 rounded-full">
                              <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                style={{
                                  width: `${((defense.buildTime - build.timeRemaining) / defense.buildTime) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {missingReqs.length > 0 && (
                      <div className="mt-2 p-2 bg-gray-800 rounded border border-gray-600">
                        <div className="flex items-center text-red-400 mb-2">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <span className="font-medium">Missing Requirements:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-400">
                          {missingReqs.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Defense Cost */}
                    <div className="bg-gray-800 rounded p-2">
                      <div className="text-gray-400 mb-1">Unit Cost:</div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center">
                          <Mountain className="w-3 h-3 text-gray-400 mr-1" />
                          <span>Iron:</span>
                        </div>
                        <span className="text-right">{defense.cost.iron.toLocaleString()}</span>
                        
                        <div className="flex items-center">
                          <Gem className="w-3 h-3 text-green-400 mr-1" />
                          <span>Kryptonite:</span>
                        </div>
                        <span className="text-right">{defense.cost.kryptonite.toLocaleString()}</span>
                        
                        <div className="flex items-center">
                          <Hammer className="w-3 h-3 text-blue-400 mr-1" />
                          <span>Metal:</span>
                        </div>
                        <span className="text-right">{defense.cost.metal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Build Time */}
                    <div className="flex items-center justify-between text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Build Time:</span>
                      </div>
                      <span>{formatTime(constructionTime)}/unit</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Build Quantity:
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={count}
                        onChange={(e) => setDefenseCounts({
                          ...defenseCounts,
                          [defenseId]: Math.max(0, parseInt(e.target.value) || 0),
                        })}
                        className="w-full bg-gray-600 rounded px-3 py-1 text-white"
                        disabled={!reqsMet}
                      />
                    </div>

                    {count > 0 && (
                      <div className="bg-gray-800 rounded p-2">
                        <div className="text-gray-400 mb-1">Total Cost:</div>
                        <div className="grid grid-cols-2 gap-1">
                          <span>Iron:</span>
                          <span className="text-right">{costs.iron.toLocaleString()}</span>
                          <span>Kryptonite:</span>
                          <span className="text-right">{costs.kryptonite.toLocaleString()}</span>
                          <span>Metal:</span>
                          <span className="text-right">{costs.metal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-gray-400 mt-2">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{formatTime(calculateConstructionTime(defense.buildTime, count, planet))}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      buildDefense(planet.id, defenseId, count);
                      setDefenseCounts({ ...defenseCounts, [defenseId]: 0 });
                    }}
                    disabled={!canBuildDefense || !reqsMet}
                    className={`mt-4 w-full py-2 px-4 rounded text-sm
                      ${canBuildDefense && reqsMet
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Build
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
};

export default MilitaryPanel;