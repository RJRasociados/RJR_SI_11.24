export interface Coordinates {
  galaxy: number;
  system: number;
  position: number;
}

export interface Planet {
  id: string;
  name: string;
  coordinates: Coordinates;
  temperature: number;
  sunDistance: number;
  isColonized: boolean;
  availableSpaces: number;
  totalSpaces: number;
  orbitAngleOffset: number; // Added for random starting position
}

export interface TravelTime {
  minutes: number;
  seconds: number;
  total: number;
}

export type TravelType = 'intra_system' | 'inter_system' | 'inter_galaxy';