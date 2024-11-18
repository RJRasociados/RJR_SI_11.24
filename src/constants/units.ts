import { CombatUnit, DefenseStructure } from '../types/combat';
import { BUILDING_TYPES } from './game';

export const COMBAT_UNITS: { [key: string]: CombatUnit } = {
  smallTransport: {
    id: 'smallTransport',
    name: 'Small Transport',
    attack: 2,
    defense: 6000,
    shield: 10,
    speed: 3000,
    capacity: 6000,
    consumption: 2,
    cost: {
      iron: 2000,
      kryptonite: 1000,
      metal: 1500,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 1,
    },
    buildTime: 1200, // 20 minutes
  },
  largeTransport: {
    id: 'largeTransport',
    name: 'Large Transport',
    attack: 5,
    defense: 14000,
    shield: 25,
    speed: 5000,
    capacity: 30000,
    consumption: 15,
    cost: {
      iron: 6000,
      kryptonite: 3000,
      metal: 4500,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 2,
    },
    buildTime: 2400, // 40 minutes
  },
  transmitter: {
    id: 'transmitter',
    name: 'Transmitter',
    attack: 130,
    defense: 50000,
    shield: 70,
    speed: 7000,
    capacity: 250000,
    consumption: 25,
    cost: {
      iron: 20000,
      kryptonite: 10000,
      metal: 15000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 2,
    },
    buildTime: 4800, // 80 minutes
  },
  fighter: {
    id: 'fighter',
    name: 'Fighter',
    attack: 50,
    defense: 6000,
    shield: 10,
    speed: 9000,
    capacity: 60,
    consumption: 15,
    cost: {
      iron: 3000,
      kryptonite: 1500,
      metal: 2000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 2,
    },
    buildTime: 1800, // 30 minutes
  },
  frigate: {
    id: 'frigate',
    name: 'Frigate',
    attack: 90,
    defense: 12000,
    shield: 30,
    speed: 6500,
    capacity: 100,
    consumption: 26,
    cost: {
      iron: 6000,
      kryptonite: 3000,
      metal: 4000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 3,
    },
    buildTime: 3600, // 60 minutes
  },
  starCruiser: {
    id: 'starCruiser',
    name: 'Star Cruiser',
    attack: 250,
    defense: 35000,
    shield: 100,
    speed: 4800,
    capacity: 200,
    consumption: 40,
    cost: {
      iron: 20000,
      kryptonite: 10000,
      metal: 15000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 9,
    },
    buildTime: 7200, // 120 minutes
  },
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix',
    attack: 320,
    defense: 50000,
    shield: 180,
    speed: 8000,
    capacity: 500,
    consumption: 55,
    cost: {
      iron: 30000,
      kryptonite: 15000,
      metal: 20000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 5,
    },
    buildTime: 9600, // 160 minutes
  },
  battleship: {
    id: 'battleship',
    name: 'Battleship',
    attack: 300,
    defense: 60000,
    shield: 300,
    speed: 6800,
    capacity: 1000,
    consumption: 90,
    cost: {
      iron: 40000,
      kryptonite: 20000,
      metal: 30000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 7,
    },
    buildTime: 14400, // 240 minutes
  },
  stealthBomber: {
    id: 'stealthBomber',
    name: 'Stealth Bomber',
    attack: 300,
    defense: 100000,
    shield: 100,
    speed: 5200,
    capacity: 1400,
    consumption: 110,
    cost: {
      iron: 50000,
      kryptonite: 25000,
      metal: 35000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 8,
    },
    buildTime: 18000, // 300 minutes
  },
  destroyer: {
    id: 'destroyer',
    name: 'Destroyer',
    attack: 700,
    defense: 110000,
    shield: 400,
    speed: 4000,
    capacity: 3000,
    consumption: 130,
    cost: {
      iron: 60000,
      kryptonite: 30000,
      metal: 45000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 9,
    },
    buildTime: 21600, // 360 minutes
  },
  imperialStarBase: {
    id: 'imperialStarBase',
    name: 'Imperial Star Base',
    attack: 35000,
    defense: 5000000,
    shield: 15000,
    speed: 300,
    capacity: 3500000,
    consumption: 250,
    cost: {
      iron: 1000000,
      kryptonite: 500000,
      metal: 750000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 12,
    },
    buildTime: 43200, // 720 minutes
  },
  spyProbe: {
    id: 'spyProbe',
    name: 'Spy Probe',
    attack: 0,
    defense: 3000,
    shield: 6,
    speed: 15000000,
    capacity: 0,
    consumption: 3,
    cost: {
      iron: 1000,
      kryptonite: 500,
      metal: 750,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 1,
    },
    buildTime: 900, // 15 minutes
  },
  recycler: {
    id: 'recycler',
    name: 'Recycler',
    attack: 8,
    defense: 17000,
    shield: 30,
    speed: 2000,
    capacity: 25000,
    consumption: 20,
    cost: {
      iron: 10000,
      kryptonite: 5000,
      metal: 7500,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 4,
    },
    buildTime: 3600, // 60 minutes
  },
  colonyShip: {
    id: 'colonyShip',
    name: 'Colony Ship',
    attack: 10,
    defense: 45000,
    shield: 80,
    speed: 1500,
    capacity: 5000,
    consumption: 32,
    cost: {
      iron: 20000,
      kryptonite: 10000,
      metal: 15000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 4,
    },
    buildTime: 14400, // 240 minutes
  },
};

export const DEFENSE_STRUCTURES: { [key: string]: DefenseStructure } = {
  mortar: {
    id: 'mortar',
    name: 'Mortar',
    attack: 35,
    defense: 2000,
    shield: 15,
    cost: {
      iron: 2000,
      kryptonite: 1000,
      metal: 1500,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 1,
    },
    buildTime: 900, // 15 minutes
  },
  lightGravitonCannon: {
    id: 'lightGravitonCannon',
    name: 'Light Graviton Cannon',
    attack: 50,
    defense: 3000,
    shield: 25,
    cost: {
      iron: 3000,
      kryptonite: 1500,
      metal: 2000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 2,
    },
    buildTime: 1800, // 30 minutes
  },
  heavyGravitonCannon: {
    id: 'heavyGravitonCannon',
    name: 'Heavy Graviton Cannon',
    attack: 115,
    defense: 7000,
    shield: 60,
    cost: {
      iron: 6000,
      kryptonite: 3000,
      metal: 4000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 3,
    },
    buildTime: 3600, // 60 minutes
  },
  ionCannon: {
    id: 'ionCannon',
    name: 'Ion Cannon',
    attack: 125,
    defense: 10000,
    shield: 125,
    cost: {
      iron: 8000,
      kryptonite: 4000,
      metal: 6000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 4,
    },
    buildTime: 5400, // 90 minutes
  },
  turboBattery: {
    id: 'turboBattery',
    name: 'Turbo Battery',
    attack: 220,
    defense: 12000,
    shield: 80,
    cost: {
      iron: 10000,
      kryptonite: 5000,
      metal: 7500,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 6,
    },
    buildTime: 7200, // 120 minutes
  },
  positronEmitter: {
    id: 'positronEmitter',
    name: 'Positron Emitter',
    attack: 700,
    defense: 40000,
    shield: 200,
    cost: {
      iron: 25000,
      kryptonite: 12500,
      metal: 18750,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 8,
    },
    buildTime: 10800, // 180 minutes
  },
  intervalCannon: {
    id: 'intervalCannon',
    name: 'Interval Cannon',
    attack: 900,
    defense: 30000,
    shield: 100,
    cost: {
      iron: 20000,
      kryptonite: 10000,
      metal: 15000,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 7,
    },
    buildTime: 9000, // 150 minutes
  },
  laserBattery: {
    id: 'laserBattery',
    name: 'Laser Battery',
    attack: 1000,
    defense: 40000,
    shield: 400,
    cost: {
      iron: 25000,
      kryptonite: 12500,
      metal: 18750,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 8,
    },
    buildTime: 12600, // 210 minutes
  },
  solarCannon: {
    id: 'solarCannon',
    name: 'Solar Cannon',
    attack: 2000,
    defense: 120000,
    shield: 1000,
    cost: {
      iron: 50000,
      kryptonite: 25000,
      metal: 37500,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 10,
    },
    buildTime: 18000, // 300 minutes
  },
  smallShieldDome: {
    id: 'smallShieldDome',
    name: 'Small Shield Dome',
    attack: 0,
    defense: 13000,
    shield: 3000,
    cost: {
      iron: 10000,
      kryptonite: 5000,
      metal: 7500,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 2,
    },
    buildTime: 7200, // 120 minutes
  },
  largeShieldDome: {
    id: 'largeShieldDome',
    name: 'Large Shield Dome',
    attack: 0,
    defense: 40000,
    shield: 30000,
    cost: {
      iron: 30000,
      kryptonite: 15000,
      metal: 22500,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 6,
    },
    buildTime: 14400, // 240 minutes
  },
  solarCell: {
    id: 'solarCell',
    name: 'Solar Cell',
    attack: 0,
    defense: 2200,
    shield: 5,
    cost: {
      iron: 2000,
      kryptonite: 1000,
      metal: 1500,
    },
    requirements: {
      [BUILDING_TYPES.WEAPONS_FACTORY]: 1,
    },
    buildTime: 1800, // 30 minutes
  },
};