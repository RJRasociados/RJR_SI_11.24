import React from 'react';
import { Building, Planet } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { ArrowUp, Lock, Clock, Mountain, Gem, Hammer, Droplet, Battery, AlertCircle } from 'lucide-react';
import { formatTime } from '../utils/time';
import { calculateUpgradeCost, checkRequirements, calculateProductionIncrease, calculateConstructionTime } from '../utils/buildings';
import { UNIVERSE_CONSTANTS } from '../constants/game';

interface BuildingCardProps {
  building: Building;
  planet: Planet;
}

const BuildingCard: React.FC<BuildingCardProps> = ({ building, planet }) => {
  const { upgradeBuilding, player } = useGameStore();

  const costs = calculateUpgradeCost(building);
  const requirements = checkRequirements(building, planet, player.research);
  const productionIncrease = calculateProductionIncrease(building);
  const constructionTime = calculateConstructionTime(building, planet);

  const currentProduction = building.level === 0 ? 0 : 
    building.baseProduction * Math.pow(UNIVERSE_CONSTANTS.PRODUCTION_MULTIPLIER, building.level - 1);
  
  const currentConsumption = building.level * building.baseConsumption;

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'iron': return <Mountain className="w-4 h-4 text-gray-400" />;
      case 'kryptonite': return <Gem className="w-4 h-4 text-green-400" />;
      case 'metal': return <Hammer className="w-4 h-4 text-blue-400" />;
      case 'spice': return <Droplet className="w-4 h-4 text-orange-400" />;
      case 'energy': return <Battery className="w-4 h-4 text-yellow-400" />;
      default: return null;
    }
  };

  const canUpgrade = planet.resources && 
    planet.resources.iron?.current >= costs.iron &&
    planet.resources.kryptonite?.current >= costs.kryptonite &&
    planet.totalSpaces >= planet.usedSpaces + building.spaces &&
    !building.isUpgrading &&
    requirements.met;

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium">{building.name}</h3>
          <span className="text-sm text-gray-400">• Level {building.level}</span>
        </div>
        {!requirements.met && (
          <Lock className="w-4 h-4 text-gray-500 ml-2" />
        )}
      </div>

      <div className="space-y-2 text-sm">
        {building.baseProduction > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-blue-400">
              {getResourceIcon(building.id.includes('iron') ? 'iron' : 
                building.id.includes('kryptonite') ? 'kryptonite' :
                building.id.includes('metal') ? 'metal' :
                building.id.includes('spice') ? 'spice' : 'energy')}
              <span className="ml-2">Production: {Math.floor(currentProduction)}</span>
            </div>
            {building.level > 0 && productionIncrease > 0 && (
              <span className="text-green-400">
                (Next: {Math.floor(currentProduction + productionIncrease)})
              </span>
            )}
          </div>
        )}
        
        {building.baseConsumption > 0 && (
          <div className="flex items-center justify-between text-red-400">
            <div className="flex items-center">
              <Battery className="w-4 h-4 mr-2" />
              <span>Energy: {currentConsumption}</span>
            </div>
            {building.level > 0 && (
              <span className="text-gray-400">
                (Next: {currentConsumption + building.baseConsumption})
              </span>
            )}
          </div>
        )}

        {!requirements.met && (
          <div className="mt-2 p-2 bg-gray-800 rounded border border-gray-600">
            <div className="flex items-center text-red-400 mb-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">Missing Requirements:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              {requirements.missing.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          <span>{formatTime(constructionTime)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-gray-400 mt-2">
          <div>Cost:</div>
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end">
              <span className="mr-2">Iron:</span>
              <Mountain className="w-4 h-4 mr-1" />
              <span>{Math.floor(costs.iron).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-end">
              <span className="mr-2">Kryptonite:</span>
              <Gem className="w-4 h-4 mr-1" />
              <span>{Math.floor(costs.kryptonite).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => upgradeBuilding(planet.id, building.id)}
        disabled={!canUpgrade}
        className={`mt-4 w-full py-2 px-4 rounded text-sm
          ${canUpgrade 
            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <ArrowUp className="w-4 h-4" />
          <span>Upgrade</span>
        </div>
      </button>

      {building.isUpgrading && (
        <div className="mt-2">
          <div className="h-2 bg-gray-600 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-1000"
              style={{
                width: `${((constructionTime - building.upgradeTimeRemaining) / constructionTime) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-center text-gray-400 mt-1">
            {formatTime(building.upgradeTimeRemaining)} remaining
          </p>
        </div>
      )}
    </div>
  );
};

export default BuildingCard;