import { Building, Planet, Research } from '../types/game';
import { UNIVERSE_CONSTANTS, BUILDING_TYPES } from '../constants/game';

export const calculateUpgradeCost = (building: Building) => {
  // For level 0 buildings, use base cost directly without multiplier
  const multiplier = building.level === 0 ? 1 : Math.pow(UNIVERSE_CONSTANTS.UPGRADE_COST_MULTIPLIER, building.level);
  return {
    iron: Math.floor(building.baseCosts.iron * multiplier),
    kryptonite: Math.floor(building.baseCosts.kryptonite * multiplier),
  };
};

export const calculateConstructionTime = (building: Building, planet: Planet) => {
  const baseTime = UNIVERSE_CONSTANTS.BASE_UPGRADE_TIME * (building.level + 1);
  
  // Development Center reduces construction time by (1 - 1/(level+1))
  const developmentCenter = planet.buildings.find(b => b.id === BUILDING_TYPES.DEVELOPMENT_CENTER);
  const developmentReduction = developmentCenter && developmentCenter.level > 0 
    ? 1 - (1 / (developmentCenter.level + 1))
    : 0;

  // Microsystem Accelerator reduces time by 50% per level cumulatively
  const microsystemAccelerator = planet.buildings.find(b => b.id === BUILDING_TYPES.MICROSYSTEM_ACCELERATOR);
  const microsystemReduction = microsystemAccelerator?.level > 0
    ? 1 - Math.pow(0.5, microsystemAccelerator.level)
    : 0;

  // Apply both reductions cumulatively
  const totalReduction = 1 - ((1 - developmentReduction) * (1 - microsystemReduction));
  
  return Math.floor(baseTime * (1 - totalReduction));
};

export const checkRequirements = (building: Building, planet: Planet, research: Research[]) => {
  const missing: string[] = [];

  if (building.requirements) {
    if (building.requirements.buildings) {
      Object.entries(building.requirements.buildings).forEach(([buildingId, level]) => {
        const requiredBuilding = planet.buildings.find(b => b.id === buildingId);
        if (!requiredBuilding || requiredBuilding.level < level) {
          const buildingName = planet.buildings.find(b => b.id === buildingId)?.name || buildingId;
          missing.push(`${buildingName} level ${level}`);
        }
      });
    }

    if (building.requirements.research) {
      Object.entries(building.requirements.research).forEach(([researchId, level]) => {
        const requiredResearch = research.find(r => r.id === researchId);
        if (!requiredResearch || requiredResearch.level < level) {
          const researchName = research.find(r => r.id === researchId)?.name || researchId;
          missing.push(`${researchName} level ${level}`);
        }
      });
    }
  }

  return {
    met: missing.length === 0,
    missing,
  };
};

export const calculateProductionIncrease = (building: Building): number => {
  if (building.baseProduction === 0) return 0;
  
  const currentProduction = building.level === 0 ? 0 : 
    building.baseProduction * Math.pow(UNIVERSE_CONSTANTS.PRODUCTION_MULTIPLIER, building.level - 1);
  const nextProduction = building.baseProduction * Math.pow(UNIVERSE_CONSTANTS.PRODUCTION_MULTIPLIER, 
    building.level === 0 ? 0 : building.level);
  
  return nextProduction - currentProduction;
};