import { Building } from '../types/game';

export const UNIVERSE_CONSTANTS = {
  GAME_SPEED: 20,
  BASE_UPGRADE_TIME: 10,
  BASE_RESEARCH_TIME: 30,
  TICK_INTERVAL: 1000,
  PRODUCTION_MULTIPLIER: 1.66,
  UPGRADE_COST_MULTIPLIER: 1.66,
  MAX_PLANETS: 10,
  INITIAL_PLANET_SPACES: 200,
  MIN_NEW_PLANET_SPACES: 100,
  MAX_NEW_PLANET_SPACES: 300
};

// Initial resources for the first planet (homeworld)
export const HOMEWORLD_RESOURCES = {
  iron: {
    current: 550000,
    capacity: 100000,
    production: 0,
    consumption: 0,
  },
  kryptonite: {
    current: 320000,
    capacity: 100000,
    production: 0,
    consumption: 0,
  },
  metal: {
    current: 200000,
    capacity: 100000,
    production: 0,
    consumption: 0,
  },
  spice: {
    current: 80000,
    capacity: 100000,
    production: 0,
    consumption: 0,
  },
  energy: {
    production: 0,
    consumption: 0,
  },
};

// Resources for newly colonized planets
export const COLONY_RESOURCES = {
  iron: {
    current: 150000,
    capacity: 100000,
    production: 0,
    consumption: 0,
  },
  kryptonite: {
    current: 100000,
    capacity: 100000,
    production: 0,
    consumption: 0,
  },
  metal: {
    current: 50000,
    capacity: 100000,
    production: 0,
    consumption: 0,
  },
  spice: {
    current: 20000,
    capacity: 100000,
    production: 0,
    consumption: 0,
  },
  energy: {
    production: 0,
    consumption: 0,
  },
};

// Base resources structure (used for type consistency)
export const BASE_RESOURCES = {
  iron: {
    current: 0,
    capacity: 100000,
    production: 0,
    consumption: 0,
  },
  kryptonite: {
    current: 0,
    capacity: 100000,
    production: 0,
    consumption: 0,
  },
  metal: {
    current: 0,
    capacity: 100000,
    production: 0,
    consumption: 0,
  },
  spice: {
    current: 0,
    capacity: 100000,
    production: 0,
    consumption: 0,
  },
  energy: {
    production: 0,
    consumption: 0,
  },
};

export const BUILDING_TYPES = {
  IRON_MINE: 'ironMine',
  KRYPTONITE_EXTRACTOR: 'kryptoniteExtractor',
  METAL_FOUNDRY: 'metalFoundry',
  SPICE_MINE: 'spiceMine',
  SOLAR_PLANT: 'solarPlant',
  FUSION_PLANT: 'fusionPlant',
  IRON_STORAGE: 'ironStorage',
  KRYPTONITE_STORAGE: 'kryptoniteStorage',
  METAL_STORAGE: 'metalStorage',
  SPICE_STORAGE: 'spiceStorage',
  RESEARCH_LAB: 'researchLab',
  WEAPONS_FACTORY: 'weaponsFactory',
  STARBASE: 'starbase',
  DEVELOPMENT_CENTER: 'developmentCenter',
  MICROSYSTEM_ACCELERATOR: 'microsystemAccelerator',
  TELEPORTER: 'teleporter',
  GALACTIC_SCANNER: 'galacticScanner'
} as const;

export const BASE_BUILDINGS: Building[] = [
  {
    id: BUILDING_TYPES.IRON_MINE,
    name: 'Iron Mine',
    level: 0,
    baseProduction: 30,
    baseConsumption: 10,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 60,
      kryptonite: 15,
    },
    spaces: 1,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.KRYPTONITE_EXTRACTOR,
    name: 'Kryptonite Extractor',
    level: 0,
    baseProduction: 20,
    baseConsumption: 10,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 75,
      kryptonite: 30,
    },
    spaces: 1,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.METAL_FOUNDRY,
    name: 'Metal Foundry',
    level: 0,
    baseProduction: 15,
    baseConsumption: 10,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 150,
      kryptonite: 50,
    },
    spaces: 1,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.SPICE_MINE,
    name: 'Spice Mine',
    level: 0,
    baseProduction: 15,
    baseConsumption: 12,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 80,
      kryptonite: 40,
    },
    spaces: 1,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.FUSION_PLANT,
    name: 'Fusion Plant',
    level: 0,
    baseProduction: 100,
    baseConsumption: 0,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 500,
      kryptonite: 200,
    },
    spaces: 1,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.IRON_STORAGE,
    name: 'Iron Storage',
    level: 0,
    baseProduction: 0,
    baseConsumption: 0,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 100,
      kryptonite: 25,
    },
    spaces: 1,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.KRYPTONITE_STORAGE,
    name: 'Kryptonite Storage',
    level: 0,
    baseProduction: 0,
    baseConsumption: 0,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 100,
      kryptonite: 25,
    },
    spaces: 1,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.METAL_STORAGE,
    name: 'Metal Storage',
    level: 0,
    baseProduction: 0,
    baseConsumption: 0,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 100,
      kryptonite: 25,
    },
    spaces: 1,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.SPICE_STORAGE,
    name: 'Spice Storage',
    level: 0,
    baseProduction: 0,
    baseConsumption: 0,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 100,
      kryptonite: 25,
    },
    spaces: 1,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.RESEARCH_LAB,
    name: 'Research Laboratory',
    level: 0,
    baseProduction: 0,
    baseConsumption: 10,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 2000,
      kryptonite: 1000,
    },
    spaces: 2,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.WEAPONS_FACTORY,
    name: 'Weapons Factory',
    level: 0,
    baseProduction: 0,
    baseConsumption: 20,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 1500,
      kryptonite: 750,
    },
    spaces: 2,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.STARBASE,
    name: 'Starbase',
    level: 0,
    baseProduction: 0,
    baseConsumption: 30,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 3000,
      kryptonite: 1500,
    },
    spaces: 3,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.DEVELOPMENT_CENTER,
    name: 'Development Center',
    level: 0,
    baseProduction: 0,
    baseConsumption: 15,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 1000,
      kryptonite: 500,
    },
    spaces: 2,
    requirements: {}
  },
  {
    id: BUILDING_TYPES.SOLAR_PLANT,
    name: 'Solar Plant',
    level: 0,
    baseProduction: 50,
    baseConsumption: 0,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 200,
      kryptonite: 50,
    },
    spaces: 1,
    requirements: {
      buildings: {
        [BUILDING_TYPES.SPICE_MINE]: 6
      },
      research: {
        'energyTechnology': 4
      }
    }
  },
  {
    id: BUILDING_TYPES.MICROSYSTEM_ACCELERATOR,
    name: 'Microsystem Accelerator',
    level: 0,
    baseProduction: 0,
    baseConsumption: 20,
    isUpgrading: false,
    upgradeTimeRemaining: 0,
    baseCosts: {
      iron: 4000,
      kryptonite: 2000,
    },
    spaces: 1,
    requirements: {
      buildings: {
        [BUILDING_TYPES.RESEARCH_LAB]: 3,
        [BUILDING_TYPES.DEVELOPMENT_CENTER]: 5,
      }
    }
  }
];