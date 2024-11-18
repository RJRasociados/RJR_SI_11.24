import { Coordinates, Planet, TravelTime, TravelType } from '../types/universe';

// Constants for universe generation
export const GALAXIES = 3;
export const SYSTEMS_PER_GALAXY = 15;
export const PLANETS_PER_SYSTEM = 10;

// Constants for travel calculations
const BASE_SYSTEM_TRAVEL = 300; // 5 minutes in seconds
const BASE_GALAXY_TRAVEL = 600; // 10 minutes in seconds
const SYSTEM_DISTANCE_MULTIPLIER = 10; // 10 seconds per system difference

// Constants for planet generation
const MIN_ORBIT_RADIUS = 30;
const MAX_ORBIT_RADIUS = 200;
const ORBIT_VARIANCE = 0.3; // 30% variance in orbital position

export const generatePlanetId = (coords: Coordinates): string => {
  return `${coords.galaxy}:${coords.system}:${coords.position}`;
};

export const parsePlanetId = (id: string): Coordinates => {
  const [galaxy, system, position] = id.split(':').map(Number);
  return { galaxy, system, position };
};

export const calculateTemperature = (sunDistance: number): number => {
  // Base temperature of 20°C at optimal distance (100)
  // Temperature ranges from -100°C to 150°C
  const optimalDistance = 100;
  const tempRange = 250; // Total range of temperature
  const baseTemp = 20;
  
  // Calculate temperature based on distance
  const tempDiff = (optimalDistance - sunDistance) * (tempRange / 200);
  return Math.round(baseTemp + tempDiff);
};

export const calculateTravelTime = (
  origin: Coordinates,
  destination: Coordinates
): TravelTime => {
  // Determine travel type
  let travelType: TravelType = 'intra_system';
  if (origin.galaxy !== destination.galaxy) {
    travelType = 'inter_galaxy';
  } else if (origin.system !== destination.system) {
    travelType = 'inter_system';
  }

  let totalSeconds = 0;

  switch (travelType) {
    case 'intra_system': {
      // Calculate distance between planets
      const distance = Math.abs(origin.position - destination.position);
      totalSeconds = Math.ceil((distance / PLANETS_PER_SYSTEM) * 600); // Max 10 minutes
      break;
    }
    case 'inter_system': {
      // Base time plus system difference
      const systemDiff = Math.abs(origin.system - destination.system);
      const systemTime = BASE_SYSTEM_TRAVEL + (systemDiff * SYSTEM_DISTANCE_MULTIPLIER);
      
      // Add intra-system travel time for origin and destination
      const originDistance = Math.abs(origin.position - (PLANETS_PER_SYSTEM / 2));
      const destDistance = Math.abs(destination.position - (PLANETS_PER_SYSTEM / 2));
      const intraSystemTime = ((originDistance + destDistance) / PLANETS_PER_SYSTEM) * 600;
      
      totalSeconds = Math.ceil(systemTime + intraSystemTime);
      break;
    }
    case 'inter_galaxy': {
      // Base galaxy travel time
      totalSeconds = BASE_GALAXY_TRAVEL;
      
      // Add system travel time
      const systemDiff = Math.abs(origin.system - destination.system);
      totalSeconds += systemDiff * SYSTEM_DISTANCE_MULTIPLIER;
      
      // Add intra-system travel time for origin and destination
      const originDistance = Math.abs(origin.position - (PLANETS_PER_SYSTEM / 2));
      const destDistance = Math.abs(destination.position - (PLANETS_PER_SYSTEM / 2));
      totalSeconds += Math.ceil(((originDistance + destDistance) / PLANETS_PER_SYSTEM) * 600);
      break;
    }
  }

  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
    total: totalSeconds,
  };
};

export const generateUniverse = (): Planet[] => {
  const planets: Planet[] = [];

  for (let g = 1; g <= GALAXIES; g++) {
    for (let s = 1; s <= SYSTEMS_PER_GALAXY; s++) {
      // Generate random positions for planets in this system
      const positions = Array.from({ length: PLANETS_PER_SYSTEM }, (_, i) => i + 1)
        .sort(() => Math.random() - 0.5);

      for (let p = 0; p < PLANETS_PER_SYSTEM; p++) {
        const coordinates = {
          galaxy: g,
          system: s,
          position: positions[p],
        };

        // Calculate base orbit radius based on position
        const baseRadius = MIN_ORBIT_RADIUS + 
          ((positions[p] - 1) / (PLANETS_PER_SYSTEM - 1)) * (MAX_ORBIT_RADIUS - MIN_ORBIT_RADIUS);
        
        // Add some random variance to the orbit radius
        const variance = (Math.random() * 2 - 1) * ORBIT_VARIANCE;
        const sunDistance = Math.max(MIN_ORBIT_RADIUS, 
          Math.min(MAX_ORBIT_RADIUS, baseRadius * (1 + variance)));
        
        planets.push({
          id: generatePlanetId(coordinates),
          name: `Planet ${generatePlanetId(coordinates)}`,
          coordinates,
          temperature: calculateTemperature(sunDistance),
          sunDistance,
          isColonized: false,
          availableSpaces: 0,
          totalSpaces: Math.floor(Math.random() * 100) + 150, // 150-250 spaces
          orbitAngleOffset: Math.random() * Math.PI * 2, // Random starting position in orbit
        });
      }
    }
  }

  return planets;
};

export const getSystemPlanets = (planets: Planet[], galaxy: number, system: number): Planet[] => {
  return planets.filter(p => 
    p.coordinates.galaxy === galaxy && 
    p.coordinates.system === system
  ).sort((a, b) => a.sunDistance - b.sunDistance);
};

export const getGalaxyPlanets = (planets: Planet[], galaxy: number): Planet[] => {
  return planets.filter(p => 
    p.coordinates.galaxy === galaxy
  ).sort((a, b) => 
    a.coordinates.system === b.coordinates.system
      ? a.coordinates.position - b.coordinates.position
      : a.coordinates.system - b.coordinates.system
  );
};