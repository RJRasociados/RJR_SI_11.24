import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Planet } from '../types/game';
import { ChevronDown, ChevronUp, Navigation } from 'lucide-react';

interface PlanetSelectorProps {
  selectedPlanetId: string | null;
  onPlanetSelect: (planetId: string) => void;
  showEmpireView?: boolean;
}

const PlanetSelector: React.FC<PlanetSelectorProps> = ({
  selectedPlanetId,
  onPlanetSelect,
  showEmpireView = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { player } = useGameStore();
  
  const selectedPlanet = player.planets.find(p => p.id === selectedPlanetId);

  const handlePlanetSelect = (planetId: string) => {
    onPlanetSelect(planetId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
      >
        <Navigation className="w-4 h-4 text-blue-400" />
        <div className="flex items-center space-x-2">
          <span>{selectedPlanet?.name || 'Select Planet'}</span>
          {selectedPlanet && (
            <span className="text-gray-400 text-sm">
              [{selectedPlanet.coordinates.galaxy}:
              {selectedPlanet.coordinates.system}:
              {selectedPlanet.coordinates.position}]
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg py-1">
          {showEmpireView && (
            <button
              onClick={() => {
                onPlanetSelect('empire');
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
            >
              Empire Overview
            </button>
          )}
          
          <div className="border-t border-gray-700 my-1"></div>
          
          {player.planets.map(planet => (
            <button
              key={planet.id}
              onClick={() => handlePlanetSelect(planet.id)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                planet.id === selectedPlanetId ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{planet.name}</span>
                <span className="text-gray-400 text-sm">
                  [{planet.coordinates.galaxy}:
                  {planet.coordinates.system}:
                  {planet.coordinates.position}]
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanetSelector;