import { Building, Planet, Research } from '../types/game';
import { UNIVERSE_CONSTANTS, BUILDING_TYPES, INITIAL_RESOURCES } from '../constants/game';

export const calculateTechnologyBonus = (research: Research[], techId: string): number => {
  const tech = research.find(r => r.id === techId);
  if (!tech || tech.level === 0) return 1;
  // Apply effect for current level (not level - 1)
  return 1 + (tech.level * tech.effect);
};

export const calculateStorageCapacity = (baseCapacity: number, storageLevel: number): number => {
  if (storageLevel === 0) return baseCapacity;
  return baseCapacity * Math.pow(1.5, storageLevel);
};

export const calculateBuildingProduction = (building: Building, sunDistance: number, research: Research[]) => {
  if (building.level === 0) return 0;
  
  // Calculate base production based on level
  const baseProduction = building.baseProduction * Math.pow(UNIVERSE_CONSTANTS.PRODUCTION_MULTIPLIER, building.level - 1);
  
  let techBonus = 1;
  
  // Apply Mining Technology bonus only to resource extraction buildings
  if (building.id === BUILDING_TYPES.IRON_MINE || 
      building.id === BUILDING_TYPES.KRYPTONITE_EXTRACTOR || 
      building.id === BUILDING_TYPES.SPICE_MINE) {
    techBonus = calculateTechnologyBonus(research, 'miningTechnology');
  } 
  // Apply Energy Technology bonus only to energy production buildings
  else if (building.id === BUILDING_TYPES.SOLAR_PLANT || 
           building.id === BUILDING_TYPES.FUSION_PLANT) {
    techBonus = calculateTechnologyBonus(research, 'energyTechnology');
  }
  
  // Apply special modifiers for solar and spice production
  if (building.id === BUILDING_TYPES.SPICE_MINE) {
    return baseProduction * (1 + (sunDistance / 100)) * techBonus;
  } else if (building.id === BUILDING_TYPES.SOLAR_PLANT) {
    return baseProduction * (1 - (sunDistance / 200)) * techBonus;
  }
  
  return baseProduction * techBonus;
};

export const calculateResourceProduction = (planet: Planet, research: Research[]) => {
  const baseResources = {
    iron: { ...planet.resources.iron },
    kryptonite: { ...planet.resources.kryptonite },
    metal: { ...planet.resources.metal },
    spice: { ...planet.resources.spice },
    energy: {
      production: 0,
      consumption: 0,
    },
  };

  // Update storage capacities based on storage building levels
  const ironStorage = planet.buildings.find(b => b.id === BUILDING_TYPES.IRON_STORAGE);
  const kryptoniteStorage = planet.buildings.find(b => b.id === BUILDING_TYPES.KRYPTONITE_STORAGE);
  const metalStorage = planet.buildings.find(b => b.id === BUILDING_TYPES.METAL_STORAGE);
  const spiceStorage = planet.buildings.find(b => b.id === BUILDING_TYPES.SPICE_STORAGE);

  baseResources.iron.capacity = calculateStorageCapacity(100000, ironStorage?.level || 0);
  baseResources.kryptonite.capacity = calculateStorageCapacity(100000, kryptoniteStorage?.level || 0);
  baseResources.metal.capacity = calculateStorageCapacity(100000, metalStorage?.level || 0);
  baseResources.spice.capacity = calculateStorageCapacity(100000, spiceStorage?.level || 0);

  const production = Object.entries(baseResources).reduce((acc, [key, value]) => {
    if (key === 'energy') {
      acc[key] = {
        production: 0,
        consumption: 0,
      };
    } else {
      acc[key] = {
        current: value.current,
        capacity: value.capacity,
        production: 0,
        consumption: 0,
      };
    }
    return acc;
  }, {} as typeof baseResources);

  // Calculate energy production and consumption first
  planet.buildings.forEach(building => {
    if (building.level > 0) {
      if (building.id === BUILDING_TYPES.SOLAR_PLANT || building.id === BUILDING_TYPES.FUSION_PLANT) {
        production.energy.production += calculateBuildingProduction(building, planet.sunDistance, research);
      }
      if (building.baseConsumption > 0) {
        production.energy.consumption += building.baseConsumption * building.level;
      }
    }
  });

  // Calculate energy efficiency ratio (available energy / required energy)
  const energyEfficiency = Math.min(1, production.energy.production / Math.max(1, production.energy.consumption));

  // Calculate other resources production with energy efficiency
  planet.buildings.forEach(building => {
    if (building.level > 0) {
      const resourceKey = getResourceKey(building.id);
      if (resourceKey && resourceKey !== 'energy') {
        const produced = calculateBuildingProduction(building, planet.sunDistance, research);
        
        // Apply energy efficiency to production
        const actualProduction = produced * energyEfficiency;
        
        if (production[resourceKey]) {
          // Si está sobre la capacidad, detiene la producción pero mantiene el consumo
          if (production[resourceKey].current > production[resourceKey].capacity) {
            production[resourceKey].production = 0;
          } else {
            production[resourceKey].production += actualProduction;
          }

          // Special case for Metal Foundry: consumes 2 iron per metal produced
          if (building.id === BUILDING_TYPES.METAL_FOUNDRY) {
            const ironConsumption = actualProduction * 2;
            production.iron.consumption += ironConsumption;
          }
        }
      }
    }
  });

  return production;
};

const getResourceKey = (buildingId: string): keyof typeof INITIAL_RESOURCES | null => {
  switch (buildingId) {
    case BUILDING_TYPES.IRON_MINE:
      return 'iron';
    case BUILDING_TYPES.KRYPTONITE_EXTRACTOR:
      return 'kryptonite';
    case BUILDING_TYPES.METAL_FOUNDRY:
      return 'metal';
    case BUILDING_TYPES.SPICE_MINE:
      return 'spice';
    case BUILDING_TYPES.SOLAR_PLANT:
    case BUILDING_TYPES.FUSION_PLANT:
      return 'energy';
    default:
      return null;
  }
};