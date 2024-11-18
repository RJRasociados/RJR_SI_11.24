import React from 'react';
import { Planet } from '../types/game';
import { 
  Battery, 
  Gem,
  Hammer,
  Mountain,
  Droplet,
  TrendingUp,
  TrendingDown,
  Gauge
} from 'lucide-react';

interface ResourceDisplayProps {
  planet: Planet;
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ planet }) => {
  const getResourceIcon = (resourceKey: string) => {
    switch (resourceKey) {
      case 'iron':
        return <Mountain className="w-4 h-4 text-gray-400" />;
      case 'kryptonite':
        return <Gem className="w-4 h-4 text-green-400" />;
      case 'metal':
        return <Hammer className="w-4 h-4 text-blue-400" />;
      case 'spice':
        return <Droplet className="w-4 h-4 text-orange-400" />;
      case 'energy':
        return <Battery className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const formatRate = (production: number, consumption: number) => {
    const rate = Math.floor(production - consumption);
    if (rate === 0) return null;
    
    return (
      <span className={`flex items-center text-sm ${rate > 0 ? 'text-green-400' : 'text-red-400'}`}>
        {rate > 0 ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 mr-1" />
        )}
        {Math.abs(rate)}/h
      </span>
    );
  };

  const calculateEnergyEfficiency = (production: number, consumption: number) => {
    if (consumption === 0) return 100;
    return Math.min(100, Math.floor((production / consumption) * 100));
  };

  const getResourceStatusColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (current > capacity) return 'text-red-400';
    if (percentage >= 95) return 'text-amber-500';
    return '';
  };

  const getCapacityStatusColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (current > capacity) return 'text-red-400/70';
    if (percentage >= 95) return 'text-amber-500/70';
    return 'text-gray-400';
  };

  return (
    <div className="flex space-x-6">
      {Object.entries(planet.resources).map(([key, resource]) => {
        if (key === 'energy') {
          const efficiency = calculateEnergyEfficiency(resource.production, resource.consumption);
          return (
            <div key={key} className="flex flex-col items-center">
              <div className="flex items-center space-x-1">
                {getResourceIcon(key)}
                <span className="font-bold capitalize">{key}</span>
              </div>
              <div className="text-sm">
                <span className={efficiency >= 100 ? 'text-green-400' : 'text-red-400'}>
                  {Math.floor(resource.production)} / {Math.floor(resource.consumption)}
                </span>
              </div>
              <div className="mt-1 flex items-center text-sm">
                <Gauge className="w-3 h-3 mr-1" />
                <span className={efficiency >= 100 ? 'text-green-400' : 'text-red-400'}>
                  {efficiency}%
                </span>
              </div>
            </div>
          );
        }

        const productionRate = formatRate(resource.production, resource.consumption);
        const resourceColor = getResourceStatusColor(resource.current, resource.capacity);
        const capacityColor = getCapacityStatusColor(resource.current, resource.capacity);
        
        return (
          <div key={key} className="flex flex-col items-center">
            <div className="flex items-center space-x-1">
              {getResourceIcon(key)}
              <span className="font-bold capitalize">{key}</span>
            </div>
            <div className={`text-sm ${resourceColor}`}>
              <span>
                {Math.floor(resource.current).toLocaleString()}
                <span className={capacityColor}>
                  {' '}/ {resource.capacity.toLocaleString()}
                </span>
              </span>
            </div>
            {productionRate && (
              <div className="mt-1">
                {productionRate}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ResourceDisplay;