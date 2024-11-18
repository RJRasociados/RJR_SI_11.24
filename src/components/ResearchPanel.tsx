import React from 'react';
import { Research, Planet } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { canResearch, calculateResearchTime, getResearchEffect } from '../utils/research';
import { Microscope, Lock, Clock, AlertCircle, Mountain, Gem, Hammer } from 'lucide-react';
import { formatTime } from '../utils/time';
import { UNIVERSE_CONSTANTS } from '../constants/game';
import Section from './Section';

interface ResearchPanelProps {
  planet: Planet;
}

const ResearchPanel: React.FC<ResearchPanelProps> = ({ planet }) => {
  const { player, startResearch } = useGameStore();
  const lab = planet.buildings.find(b => b.id === 'researchLab');
  const hasLab = lab && lab.level > 0;

  const calculateResearchCost = (research: Research) => {
    const multiplier = Math.pow(UNIVERSE_CONSTANTS.UPGRADE_COST_MULTIPLIER, research.level);
    return {
      iron: Math.floor(research.costs.iron * multiplier),
      kryptonite: Math.floor(research.costs.kryptonite * multiplier),
      metal: Math.floor(research.costs.metal * multiplier),
    };
  };

  const canAffordResearch = (research: Research) => {
    const costs = calculateResearchCost(research);
    return (
      planet.resources.iron.current >= costs.iron &&
      planet.resources.kryptonite.current >= costs.kryptonite &&
      planet.resources.metal.current >= costs.metal
    );
  };

  const getMissingRequirements = (research: Research) => {
    const missing: string[] = [];
    
    Object.entries(research.requirements).forEach(([reqId, reqLevel]) => {
      if (reqId === 'researchLab') {
        const lab = planet.buildings.find(b => b.id === reqId);
        if (!lab || lab.level < reqLevel) {
          missing.push(`Research Lab level ${reqLevel}`);
        }
      } else {
        const requiredTech = player.research.find(r => r.id === reqId);
        if (!requiredTech || requiredTech.level < reqLevel) {
          const techName = player.research.find(r => r.id === reqId)?.name || reqId;
          missing.push(`${techName} level ${reqLevel}`);
        }
      }
    });

    return missing;
  };

  return (
    <Section
      title="Research Laboratory"
      icon={<Microscope className="w-6 h-6 text-purple-400" />}
      disabled={!hasLab}
      disabledMessage="Research Laboratory required to conduct research"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {player.research.map(research => {
          const isAvailable = canResearch(research, player.research, planet);
          const researchTime = lab ? calculateResearchTime(research, lab.level) : 0;
          const costs = calculateResearchCost(research);
          const canStart = isAvailable && canAffordResearch(research);
          const missingRequirements = getMissingRequirements(research);

          return (
            <div
              key={research.id}
              className={`bg-gray-700 rounded-lg p-4 ${
                !isAvailable ? 'opacity-75' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{research.name}</h3>
                  <span className="text-sm text-gray-400">• Level {research.level}</span>
                </div>
                {!isAvailable && (
                  <Lock className="w-4 h-4 text-gray-500 ml-2" />
                )}
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  Effect: {getResearchEffect(research)}
                </p>

                {missingRequirements.length > 0 && (
                  <div className="mt-2 p-2 bg-gray-800 rounded border border-gray-600">
                    <div className="flex items-center text-red-400 mb-2">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="font-medium">Missing Requirements:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-400">
                      {missingRequirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{formatTime(researchTime)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-gray-400">
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
                    <div className="flex items-center justify-end">
                      <span className="mr-2">Metal:</span>
                      <Hammer className="w-4 h-4 mr-1" />
                      <span>{Math.floor(costs.metal).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => startResearch(research.id)}
                disabled={!canStart || research.isResearching}
                className={`mt-4 w-full py-2 px-4 rounded text-sm
                  ${
                    canStart && !research.isResearching
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {research.isResearching ? 'Researching...' : 'Start Research'}
              </button>

              {research.isResearching && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-600 rounded-full">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                      style={{
                        width: `${((researchTime - research.timeRemaining) / researchTime) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-center text-gray-400 mt-1">
                    {formatTime(research.timeRemaining)} remaining
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default ResearchPanel;