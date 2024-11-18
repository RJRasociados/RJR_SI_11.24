import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Globe2 } from 'lucide-react';

const PlanetDiscovery: React.FC = () => {
  const { player } = useGameStore();
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);

  const canDiscoverPlanet = player.planets.length < 10;

  const startSearch = () => {
    if (!canDiscoverPlanet || isSearching) return;
    
    setIsSearching(true);
    setSearchProgress(0);

    const searchDuration = 10000; // 10 seconds
    const updateInterval = 100; // Update every 100ms
    const startTime = Date.now();

    const searchInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed / searchDuration) * 100;

      if (progress >= 100) {
        clearInterval(searchInterval);
        setIsSearching(false);
        setSearchProgress(100);
        // TODO: Implement planet discovery logic
      } else {
        setSearchProgress(progress);
      }
    }, updateInterval);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Globe2 className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold">Planet Discovery</h2>
      </div>

      <div className="space-y-4">
        <div className="text-gray-400">
          Planets: {player.planets.length} / 10
        </div>

        {isSearching && (
          <div className="space-y-2">
            <div className="h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-200"
                style={{ width: `${searchProgress}%` }}
              />
            </div>
            <div className="text-center text-sm text-gray-400">
              Searching for habitable planets...
            </div>
          </div>
        )}

        <button
          onClick={startSearch}
          disabled={!canDiscoverPlanet || isSearching}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2
            ${canDiscoverPlanet && !isSearching
              ? 'bg-purple-500 hover:bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
        >
          <Globe2 className="w-5 h-5" />
          <span>Search for New Planet</span>
        </button>
      </div>
    </div>
  );
};

export default PlanetDiscovery;