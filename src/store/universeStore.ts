import { create } from 'zustand';
import { Planet } from '../types/universe';
import { generateUniverse } from '../utils/universe';

interface UniverseState {
  planets: Planet[];
  selectedPlanet: Planet | null;
  selectPlanet: (planet: Planet | null) => void;
}

export const useUniverseStore = create<UniverseState>((set) => ({
  planets: generateUniverse(),
  selectedPlanet: null,
  selectPlanet: (planet) => set({ selectedPlanet: planet }),
}));