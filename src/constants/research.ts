import { Research } from '../types/game';
import { BUILDING_TYPES } from './game';

export const RESEARCH_CATEGORIES = {
  ENERGY: 'energy',
  MINING: 'mining',
  PROPULSION: 'propulsion',
  DEFENSE: 'defense',
  WEAPONS: 'weapons',
} as const;

export const INITIAL_RESEARCH: Research[] = [
  {
    id: 'energyTechnology',
    name: 'Energy Technology',
    level: 0,
    effect: 0.1,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      [BUILDING_TYPES.RESEARCH_LAB]: 1,
    },
    costs: {
      iron: 800,
      kryptonite: 400,
      metal: 200,
    }
  },
  {
    id: 'gravitonTechnology',
    name: 'Graviton Technology',
    level: 0,
    effect: 0.15,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      'energyTechnology': 2,
      [BUILDING_TYPES.RESEARCH_LAB]: 1,
    },
    costs: {
      iron: 2000,
      kryptonite: 1000,
      metal: 500,
    }
  },
  {
    id: 'miningTechnology',
    name: 'Mining Technology',
    level: 0,
    effect: 0.12,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      'energyTechnology': 4,
      [BUILDING_TYPES.RESEARCH_LAB]: 1,
    },
    costs: {
      iron: 1500,
      kryptonite: 750,
      metal: 375,
    }
  },
  {
    id: 'shieldTechnology',
    name: 'Shield Technology',
    level: 0,
    effect: 0.1,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      'energyTechnology': 4,
      [BUILDING_TYPES.RESEARCH_LAB]: 1,
    },
    costs: {
      iron: 2500,
      kryptonite: 1250,
      metal: 625,
    }
  },
  {
    id: 'targetingSystem',
    name: 'Targeting System',
    level: 0,
    effect: 0.1,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      'energyTechnology': 6,
      [BUILDING_TYPES.RESEARCH_LAB]: 1,
    },
    costs: {
      iron: 3000,
      kryptonite: 1500,
      metal: 750,
    }
  },
  {
    id: 'propulsionResearch',
    name: 'Propulsion Research',
    level: 0,
    effect: 0.1,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      [BUILDING_TYPES.RESEARCH_LAB]: 1,
    },
    costs: {
      iron: 1000,
      kryptonite: 500,
      metal: 250,
    }
  },
  {
    id: 'rocketEngines',
    name: 'Rocket Engines',
    level: 0,
    effect: 0.1,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      'propulsionResearch': 2,
      [BUILDING_TYPES.RESEARCH_LAB]: 1,
    },
    costs: {
      iron: 2000,
      kryptonite: 1000,
      metal: 500,
    }
  },
  {
    id: 'diffusionDrive',
    name: 'Diffusion Drive',
    level: 0,
    effect: 0.15,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      'propulsionResearch': 6,
      [BUILDING_TYPES.RESEARCH_LAB]: 1,
    },
    costs: {
      iron: 4000,
      kryptonite: 2000,
      metal: 1000,
    }
  },
  {
    id: 'warpDrive',
    name: 'Warp Drive',
    level: 0,
    effect: 0.2,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      'propulsionResearch': 8,
      [BUILDING_TYPES.RESEARCH_LAB]: 1,
    },
    costs: {
      iron: 8000,
      kryptonite: 4000,
      metal: 2000,
    }
  },
  {
    id: 'espionageTechnology',
    name: 'Espionage Technology',
    level: 0,
    effect: 0.1,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      [BUILDING_TYPES.RESEARCH_LAB]: 3,
    },
    costs: {
      iron: 3000,
      kryptonite: 1500,
      metal: 750,
    }
  },
  {
    id: 'weaponTechnology',
    name: 'Weapon Technology',
    level: 0,
    effect: 0.1,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      [BUILDING_TYPES.RESEARCH_LAB]: 3,
    },
    costs: {
      iron: 4000,
      kryptonite: 2000,
      metal: 1000,
    }
  },
  {
    id: 'defenseSystems',
    name: 'Defense Systems',
    level: 0,
    effect: 0.1,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      [BUILDING_TYPES.RESEARCH_LAB]: 5,
    },
    costs: {
      iron: 5000,
      kryptonite: 2500,
      metal: 1250,
    }
  },
  {
    id: 'particleAnalyzer',
    name: 'Particle Analyzer',
    level: 0,
    effect: 0.15,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      'shieldTechnology': 5,
      [BUILDING_TYPES.RESEARCH_LAB]: 1,
    },
    costs: {
      iron: 6000,
      kryptonite: 3000,
      metal: 1500,
    }
  },
  {
    id: 'teleportation',
    name: 'Teleportation',
    level: 0,
    effect: 0.2,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      [BUILDING_TYPES.RESEARCH_LAB]: 10,
    },
    costs: {
      iron: 10000,
      kryptonite: 5000,
      metal: 2500,
    }
  },
  {
    id: 'blackHoleResearch',
    name: 'Black Hole Research',
    level: 0,
    effect: 0.25,
    isResearching: false,
    timeRemaining: 0,
    requirements: {
      'gravitonTechnology': 10,
      'warpDrive': 10,
      [BUILDING_TYPES.RESEARCH_LAB]: 1,
    },
    costs: {
      iron: 20000,
      kryptonite: 10000,
      metal: 5000,
    }
  },
];