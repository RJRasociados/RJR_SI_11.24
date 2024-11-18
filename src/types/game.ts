export interface Research {
  id: string;
  name: string;
  level: number;
  effect: number;
  isResearching: boolean;
  timeRemaining: number;
  requirements: {
    [key: string]: number;
  };
  costs: {
    iron: number;
    kryptonite: number;
    metal: number;
  };
}

export interface Building {
  id: string;
  name: string;
  level: number;
  baseProduction: number;
  baseConsumption: number;
  isUpgrading: boolean;
  upgradeTimeRemaining: number;
  baseCosts: {
    iron: number;
    kryptonite: number;
  };
  spaces: number;
  requirements: {
    buildings?: {
      [key: string]: number;
    };
    research?: {
      [key: string]: number;
    };
  };
}

export interface Resources {
  iron: {
    current: number;
    capacity: number;
    production: number;
    consumption: number;
  };
  kryptonite: {
    current: number;
    capacity: number;
    production: number;
    consumption: number;
  };
  metal: {
    current: number;
    capacity: number;
    production: number;
    consumption: number;
  };
  spice: {
    current: number;
    capacity: number;
    production: number;
    consumption: number;
  };
  energy: {
    production: number;
    consumption: number;
  };
}

export interface Planet {
  id: string;
  name: string;
  totalSpaces: number;
  usedSpaces: number;
  sunDistance: number;
  resources: Resources;
  buildings: Building[];
  fleets: Fleet[];
  units: { [key: string]: number };
  defenses: { [key: string]: number };
  unitsInProduction: UnitInProduction[];
  defensesInProduction: DefenseInProduction[];
  coordinates: {
    galaxy: number;
    system: number;
    position: number;
  };
}

export interface Player {
  id: string;
  name: string;
  planets: Planet[];
  research: Research[];
  fleets: Fleet[];
}

export interface GameState {
  player: Player;
  gameSpeed: number;
  lastUpdate: number;
}

export interface UnitInProduction {
  unitId: string;
  count: number;
  timeRemaining: number;
}

export interface DefenseInProduction {
  defenseId: string;
  count: number;
  timeRemaining: number;
}

export interface Fleet {
  id: string;
  units: {
    [unitId: string]: number;
  };
  origin: string;
  destination: string | null;
  mission: FleetMission | null;
  arrivalTime: number | null;
  returnTime: number | null;
  departureTime: number | null;
  resources?: {
    iron: number;
    kryptonite: number;
    metal: number;
    spice: number;
  };
}

export type FleetMission = 'attack' | 'transport' | 'colonize' | 'spy' | 'recycle';