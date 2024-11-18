import React from 'react';
import { useGameStore } from '../store/gameStore';
import { COMBAT_UNITS } from '../constants/units';
import { formatTime } from '../utils/time';
import { Clock, Navigation, Target, Rocket } from 'lucide-react';
import Section from './Section';

const FleetTransitPanel: React.FC = () => {
  const { player, gameSpeed } = useGameStore();

  const activeFleets = player.fleets.filter(fleet => 
    fleet.arrivalTime && fleet.arrivalTime > Date.now()
  );

  if (activeFleets.length === 0) {
    return null;
  }

  return (
    <Section
      title="Fleets in Transit"
      icon={<Rocket className="w-6 h-6 text-blue-400" />}
    >
      <div className="space-y-4">
        {activeFleets.map(fleet => {
          const originPlanet = player.planets.find(p => p.id === fleet.origin);
          const now = Date.now();
          const timeRemaining = fleet.arrivalTime ? Math.max(0, fleet.arrivalTime - now) / gameSpeed : 0;
          const totalTime = fleet.arrivalTime && fleet.departureTime ? 
            (fleet.arrivalTime - fleet.departureTime) / gameSpeed : 0;
          const progress = totalTime > 0 ? 
            ((totalTime - timeRemaining) / totalTime) * 100 : 0;

          return (
            <div key={fleet.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">
                    {originPlanet?.name || 'Unknown Origin'}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span>{fleet.destination}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">{fleet.mission}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Units</h4>
                  <div className="space-y-1">
                    {Object.entries(fleet.units).map(([unitId, count]) => (
                      <div key={unitId} className="flex justify-between text-sm">
                        <span>{COMBAT_UNITS[unitId].name}</span>
                        <span className="text-gray-300">x{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {fleet.resources && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Resources</h4>
                    <div className="space-y-1">
                      {Object.entries(fleet.resources).map(([resource, amount]) => (
                        <div key={resource} className="flex justify-between text-sm">
                          <span className="capitalize">{resource}</span>
                          <span className="text-gray-300">{amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatTime(timeRemaining)}</span>
                  </div>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-600 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default FleetTransitPanel;