import React, { useState, useEffect } from 'react';
import { useUniverseStore } from '../store/universeStore';
import { getSystemPlanets, calculateTravelTime } from '../utils/universe';
import { Planet } from '../types/universe';
import { useGameStore } from '../store/gameStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const UniverseMap: React.FC = () => {
  const { planets, selectedPlanet, selectPlanet } = useUniverseStore();
  const { player } = useGameStore();
  const [selectedGalaxy, setSelectedGalaxy] = useState(1);
  const [selectedSystem, setSelectedSystem] = useState(1);
  const [time, setTime] = useState(Date.now());

  // Update orbital positions over time
  useEffect(() => {
    const timer = setInterval(() => setTime(Date.now()), 50);
    return () => clearInterval(timer);
  }, []);

  const systemPlanets = getSystemPlanets(planets, selectedGalaxy, selectedSystem);
  const playerPlanet = player.planets[0];

  const handlePlanetClick = (planet: Planet) => {
    selectPlanet(planet === selectedPlanet ? null : planet);
  };

  const getTravelTimeToSelected = (planet: Planet) => {
    if (!playerPlanet) return null;
    return calculateTravelTime(
      playerPlanet.coordinates,
      planet.coordinates
    );
  };

  const isPlayerPlanet = (planet: Planet) => {
    return player.planets.some(p => 
      p.coordinates.galaxy === planet.coordinates.galaxy &&
      p.coordinates.system === planet.coordinates.system &&
      p.coordinates.position === planet.coordinates.position
    );
  };

  const getPlanetColor = (planet: Planet) => {
    if (isPlayerPlanet(planet)) return '#4ade80'; // Verde brillante para planetas del jugador
    if (planet.isColonized) return '#eab308'; // Amarillo para otros planetas colonizados
    if (planet.temperature < -50) return '#60a5fa'; // Azul para planetas fríos
    if (planet.temperature > 100) return '#ef4444'; // Rojo para planetas calientes
    return '#d1d5db'; // Gris para planetas templados
  };

  const getPlanetSize = (planet: Planet) => {
    const baseSize = 28;
    const sizeMultiplier = planet.totalSpaces / 200;
    return baseSize * sizeMultiplier;
  };

  const getOrbitalPosition = (planet: Planet) => {
    const orbitalPeriod = 20000 + (planet.sunDistance * 100);
    const angle = ((time / orbitalPeriod) * Math.PI * 2) + planet.orbitAngleOffset;
    
    const x = Math.cos(angle) * planet.sunDistance;
    const y = Math.sin(angle) * planet.sunDistance;
    
    return { x, y };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedGalaxy(Math.max(1, selectedGalaxy - 1))}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold">Galaxy {selectedGalaxy}</span>
            <button
              onClick={() => setSelectedGalaxy(Math.min(3, selectedGalaxy + 1))}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedSystem(Math.max(1, selectedSystem - 1))}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg">System {selectedSystem}</span>
            <button
              onClick={() => setSelectedSystem(Math.min(15, selectedSystem + 1))}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-gray-400">
            {selectedGalaxy}:{selectedSystem}
          </div>
        </div>
      </div>

      {/* Space View */}
      <div className="relative w-full" style={{ height: 'calc(100vh - 73px)' }}>
        {/* Central Star */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '56px',
            height: '56px',
            background: 'radial-gradient(circle, #fbbf24 0%, #b45309 100%)',
            borderRadius: '50%',
            boxShadow: '0 0 28px #b45309'
          }}
        />

        {/* Planets */}
        {systemPlanets.map((planet) => {
          const { x, y } = getOrbitalPosition(planet);
          const size = getPlanetSize(planet);
          const color = getPlanetColor(planet);
          const isSelected = selectedPlanet?.id === planet.id;
          const travelTime = getTravelTimeToSelected(planet);
          const owned = isPlayerPlanet(planet);

          return (
            <div
              key={planet.id}
              onClick={() => handlePlanetClick(planet)}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
            >
              {/* Planet Orbit */}
              {isSelected && (
                <div
                  className="absolute rounded-full border border-blue-500/30"
                  style={{
                    width: planet.sunDistance * 2,
                    height: planet.sunDistance * 2,
                    left: -planet.sunDistance,
                    top: -planet.sunDistance,
                  }}
                />
              )}

              {/* Planet Body */}
              <div
                className={`relative rounded-full transition-shadow ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                } ${owned ? 'ring-2 ring-green-500' : ''}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  boxShadow: `inset -${size/4}px -${size/4}px ${size/3}px rgba(0,0,0,0.5)`
                }}
              >
                {/* Planet Info Tooltip */}
                <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-gray-800 rounded-lg p-2 text-xs ${
                  isSelected ? 'block' : 'hidden'
                }`}>
                  <div className="font-bold mb-1">{planet.name}</div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-400">Temperature:</span>
                    <span>{planet.temperature}°C</span>
                    <span className="text-gray-400">Distance:</span>
                    <span>{Math.round(planet.sunDistance)} AU</span>
                    {planet.isColonized && (
                      <>
                        <span className="text-gray-400">Spaces:</span>
                        <span>{planet.availableSpaces}/{planet.totalSpaces}</span>
                      </>
                    )}
                    {travelTime && (
                      <>
                        <span className="text-gray-400">Travel time:</span>
                        <span>{travelTime.minutes}m {travelTime.seconds}s</span>
                      </>
                    )}
                    <span className="text-gray-400">Status:</span>
                    <span className={owned ? 'text-green-400' : planet.isColonized ? 'text-yellow-400' : 'text-gray-300'}>
                      {owned ? 'Your Colony' : planet.isColonized ? 'Colonized' : 'Uncolonized'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UniverseMap;