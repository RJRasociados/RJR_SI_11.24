import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import PlanetOverview from './components/PlanetOverview';
import ResourceDisplay from './components/ResourceDisplay';
import ResearchPanel from './components/ResearchPanel';
import MilitaryPanel from './components/MilitaryPanel';
import FleetPanel from './components/FleetPanel';
import FleetTransitPanel from './components/FleetTransitPanel';
import PlanetSelector from './components/PlanetSelector';
import PlanetManagement from './components/PlanetManagement';
import UniverseMap from './components/UniverseMap';
import { Activity, Globe2 } from 'lucide-react';

function App() {
  const { player, updateResources } = useGameStore();
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>(player?.planets[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'planet' | 'universe'>('planet');
  const selectedPlanet = player?.planets.find(p => p.id === selectedPlanetId);

  useEffect(() => {
    if (player?.planets[0]?.id && !selectedPlanetId) {
      setSelectedPlanetId(player.planets[0].id);
    }
  }, [player]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateResources();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateResources]);

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-xl">Initializing game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Activity className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">SI-RJR</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('planet')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'planet' ? 'bg-blue-500' : 'hover:bg-gray-700'
                }`}
              >
                <Activity className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveTab('universe')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'universe' ? 'bg-blue-500' : 'hover:bg-gray-700'
                }`}
              >
                <Globe2 className="w-5 h-5" />
              </button>
            </div>
            {activeTab === 'planet' && (
              <PlanetSelector
                selectedPlanetId={selectedPlanetId}
                onPlanetSelect={setSelectedPlanetId}
              />
            )}
          </div>
          {activeTab === 'planet' && selectedPlanet && <ResourceDisplay planet={selectedPlanet} />}
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {activeTab === 'planet' ? (
          <div className="space-y-6">
            {selectedPlanetId === 'empire' ? (
              <PlanetManagement />
            ) : (
              selectedPlanet && (
                <>
                  <PlanetOverview planet={selectedPlanet} />
                  <ResearchPanel planet={selectedPlanet} />
                  <MilitaryPanel planet={selectedPlanet} />
                  <FleetPanel planet={selectedPlanet} />
                  <FleetTransitPanel />
                </>
              )
            )}
          </div>
        ) : (
          <UniverseMap />
        )}
      </main>
    </div>
  );
}

export default App;