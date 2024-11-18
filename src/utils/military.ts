import { Planet } from '../types/game';
import { BUILDING_TYPES } from '../constants/game';

export const calculateConstructionTime = (baseTime: number, count: number, planet: Planet): number => {
  // Weapons Factory reduces construction time by (1 - 1/(level+1))
  const weaponsFactory = planet.buildings.find(b => b.id === BUILDING_TYPES.WEAPONS_FACTORY);
  const weaponsReduction = weaponsFactory && weaponsFactory.level > 0 
    ? 1 - (1 / (weaponsFactory.level + 1))
    : 0;

  // Microsystem Accelerator reduces time by 50% per level cumulatively
  const microsystemAccelerator = planet.buildings.find(b => b.id === BUILDING_TYPES.MICROSYSTEM_ACCELERATOR);
  const microsystemReduction = microsystemAccelerator?.level > 0
    ? 1 - Math.pow(0.5, microsystemAccelerator.level)
    : 0;

  // Apply both reductions cumulatively
  const totalReduction = 1 - ((1 - weaponsReduction) * (1 - microsystemReduction));
  
  return Math.floor(baseTime * count * (1 - totalReduction));
};

// Helper function to get the time reduction percentage for UI display
export const getConstructionTimeReduction = (planet: Planet): number => {
  const weaponsFactory = planet.buildings.find(b => b.id === BUILDING_TYPES.WEAPONS_FACTORY);
  const weaponsReduction = weaponsFactory && weaponsFactory.level > 0 
    ? 1 - (1 / (weaponsFactory.level + 1))
    : 0;

  const microsystemAccelerator = planet.buildings.find(b => b.id === BUILDING_TYPES.MICROSYSTEM_ACCELERATOR);
  const microsystemReduction = microsystemAccelerator?.level > 0
    ? 1 - Math.pow(0.5, microsystemAccelerator.level)
    : 0;

  // Calculate cumulative reduction percentage
  const totalReduction = 1 - ((1 - weaponsReduction) * (1 - microsystemReduction));
  return totalReduction * 100;
};

export const checkMilitaryRequirements = (requirements: { [key: string]: number }, planet: Planet): { 
  met: boolean;
  missing: string[];
} => {
  const missing: string[] = [];

  Object.entries(requirements).forEach(([buildingId, requiredLevel]) => {
    const building = planet.buildings.find(b => b.id === buildingId);
    if (!building || building.level < requiredLevel) {
      const buildingName = building?.name || buildingId;
      missing.push(`${buildingName} Level ${requiredLevel}`);
    }
  });

  return {
    met: missing.length === 0,
    missing,
  };
};