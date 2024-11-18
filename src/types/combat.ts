export interface CombatUnit {
  id: string;
  name: string;
  attack: number;
  defense: number;
  shield: number;
  speed: number;
  capacity: number;
  consumption: number;  // Fuel consumption per hour
  cost: {
    iron: number;
    kryptonite: number;
    metal: number;
  };
  requirements: {
    [key: string]: number;
  };
  buildTime: number;
}

export interface DefenseStructure {
  id: string;
  name: string;
  attack: number;
  defense: number;
  shield: number;
  cost: {
    iron: number;
    kryptonite: number;
    metal: number;
  };
  requirements: {
    [key: string]: number;
  };
  buildTime: number;
}