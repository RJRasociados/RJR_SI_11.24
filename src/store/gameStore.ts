import { create } from 'zustand';
import { GameState, Planet, Fleet } from '../types/game';
import { calculateResourceProduction } from '../utils/production';
import { 
  UNIVERSE_CONSTANTS, 
  HOMEWORLD_RESOURCES, 
  COLONY_RESOURCES,
  BASE_BUILDINGS 
} from '../constants/game';
import { INITIAL_RESEARCH } from '../constants/research';
import { calculateResearchTime } from '../utils/research';
import { COMBAT_UNITS, DEFENSE_STRUCTURES } from '../constants/units';
import { calculateUpgradeCost, calculateConstructionTime } from '../utils/buildings';
import { calculateConstructionTime as calculateMilitaryConstructionTime } from '../utils/military';

const createInitialPlanet = (id: string, coordinates?: { galaxy: number; system: number; position: number }, isHomeworld: boolean = false) => ({
  id,
  name: isHomeworld ? 'Homeworld' : `Colony ${id}`,
  totalSpaces: UNIVERSE_CONSTANTS.INITIAL_PLANET_SPACES,
  usedSpaces: 0,
  sunDistance: Math.random() * 100,
  resources: isHomeworld ? { ...HOMEWORLD_RESOURCES } : { ...COLONY_RESOURCES },
  buildings: BASE_BUILDINGS.map(building => ({ ...building })),
  fleets: [],
  units: {},
  defenses: {},
  unitsInProduction: [],
  defensesInProduction: [],
  coordinates: coordinates || {
    galaxy: Math.floor(Math.random() * 3) + 1,
    system: Math.floor(Math.random() * 15) + 1,
    position: Math.floor(Math.random() * 10) + 1,
  },
});

const initialState: GameState = {
  player: {
    id: '1',
    name: 'Commander',
    planets: [createInitialPlanet('1', undefined, true)],
    research: INITIAL_RESEARCH,
    fleets: [],
  },
  gameSpeed: UNIVERSE_CONSTANTS.GAME_SPEED,
  lastUpdate: Date.now(),
};

interface GameStore extends GameState {
  updateResources: () => void;
  upgradeBuilding: (planetId: string, buildingId: string) => void;
  startResearch: (researchId: string) => void;
  buildUnit: (planetId: string, unitId: string, count: number) => void;
  buildDefense: (planetId: string, defenseId: string, count: number) => void;
  launchFleet: (fleet: Fleet) => void;
  processArrivedFleets: () => void;
  setGameSpeed: (speed: number) => void;
  renamePlanet: (planetId: string, newName: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  updateResources: () => {
    const now = Date.now();
    const state = get();
    const tickInSeconds = (now - state.lastUpdate) / 1000 * state.gameSpeed;

    set(state => ({
      lastUpdate: now,
      player: {
        ...state.player,
        planets: state.player.planets.map(planet => {
          const newResources = calculateResourceProduction(planet, state.player.research);

          Object.keys(newResources).forEach(key => {
            if (key !== 'energy') {
              const resource = newResources[key];
              const production = (resource.production - resource.consumption) * tickInSeconds / 3600;
              resource.current = Math.max(0, resource.current + production);
              if (resource.current <= resource.capacity) {
                resource.production = resource.production;
              } else {
                resource.production = 0;
              }
            }
          });

          const buildings = planet.buildings.map(building => {
            if (building.isUpgrading) {
              const newTime = building.upgradeTimeRemaining - tickInSeconds;
              if (newTime <= 0) {
                return {
                  ...building,
                  level: building.level + 1,
                  isUpgrading: false,
                  upgradeTimeRemaining: 0,
                };
              }
              return {
                ...building,
                upgradeTimeRemaining: newTime,
              };
            }
            return building;
          });

          const { completedUnits, remainingUnits } = planet.unitsInProduction.reduce(
            (acc, unit) => {
              const newTime = unit.timeRemaining - tickInSeconds;
              if (newTime <= 0) {
                acc.completedUnits[unit.unitId] = (acc.completedUnits[unit.unitId] || 0) + unit.count;
              } else {
                acc.remainingUnits.push({ ...unit, timeRemaining: newTime });
              }
              return acc;
            },
            { completedUnits: {}, remainingUnits: [] } as { 
              completedUnits: { [key: string]: number }, 
              remainingUnits: typeof planet.unitsInProduction 
            }
          );

          const { completedDefenses, remainingDefenses } = planet.defensesInProduction.reduce(
            (acc, defense) => {
              const newTime = defense.timeRemaining - tickInSeconds;
              if (newTime <= 0) {
                acc.completedDefenses[defense.defenseId] = (acc.completedDefenses[defense.defenseId] || 0) + defense.count;
              } else {
                acc.remainingDefenses.push({ ...defense, timeRemaining: newTime });
              }
              return acc;
            },
            { completedDefenses: {}, remainingDefenses: [] } as {
              completedDefenses: { [key: string]: number },
              remainingDefenses: typeof planet.defensesInProduction
            }
          );

          const units = { ...planet.units };
          Object.entries(completedUnits).forEach(([unitId, count]) => {
            units[unitId] = (units[unitId] || 0) + count;
          });

          const defenses = { ...planet.defenses };
          Object.entries(completedDefenses).forEach(([defenseId, count]) => {
            defenses[defenseId] = (defenses[defenseId] || 0) + count;
          });

          return {
            ...planet,
            resources: newResources,
            buildings,
            units,
            defenses,
            unitsInProduction: remainingUnits,
            defensesInProduction: remainingDefenses,
          };
        }),
        research: state.player.research.map(tech => {
          if (tech.isResearching) {
            const newTime = tech.timeRemaining - tickInSeconds;
            if (newTime <= 0) {
              return {
                ...tech,
                level: tech.level + 1,
                isResearching: false,
                timeRemaining: 0,
              };
            }
            return {
              ...tech,
              timeRemaining: newTime,
            };
          }
          return tech;
        }),
      },
    }));

    get().processArrivedFleets();
  },

  upgradeBuilding: (planetId: string, buildingId: string) => {
    set(state => ({
      player: {
        ...state.player,
        planets: state.player.planets.map(planet => {
          if (planet.id !== planetId) return planet;

          const building = planet.buildings.find(b => b.id === buildingId);
          if (!building) return planet;

          const costs = calculateUpgradeCost(building);
          const constructionTime = calculateConstructionTime(building, planet);

          if (planet.resources.iron.current < costs.iron ||
              planet.resources.kryptonite.current < costs.kryptonite) {
            return planet;
          }

          const newResources = {
            ...planet.resources,
            iron: {
              ...planet.resources.iron,
              current: planet.resources.iron.current - costs.iron
            },
            kryptonite: {
              ...planet.resources.kryptonite,
              current: planet.resources.kryptonite.current - costs.kryptonite
            }
          };

          const newBuildings = planet.buildings.map(b => {
            if (b.id === buildingId) {
              return {
                ...b,
                isUpgrading: true,
                upgradeTimeRemaining: constructionTime
              };
            }
            return b;
          });

          return {
            ...planet,
            resources: newResources,
            buildings: newBuildings
          };
        })
      }
    }));
  },

  startResearch: (researchId: string) => {
    set(state => ({
      player: {
        ...state.player,
        research: state.player.research.map(tech => {
          if (tech.id === researchId && !tech.isResearching) {
            const costs = {
              iron: tech.costs.iron * Math.pow(UNIVERSE_CONSTANTS.UPGRADE_COST_MULTIPLIER, tech.level),
              kryptonite: tech.costs.kryptonite * Math.pow(UNIVERSE_CONSTANTS.UPGRADE_COST_MULTIPLIER, tech.level),
              metal: tech.costs.metal * Math.pow(UNIVERSE_CONSTANTS.UPGRADE_COST_MULTIPLIER, tech.level),
            };

            const researchPlanet = state.player.planets.find(planet => {
              const lab = planet.buildings.find(b => b.id === 'researchLab');
              return lab && lab.level > 0 &&
                planet.resources.iron.current >= costs.iron &&
                planet.resources.kryptonite.current >= costs.kryptonite &&
                planet.resources.metal.current >= costs.metal;
            });

            if (!researchPlanet) return tech;

            const planetIndex = state.player.planets.indexOf(researchPlanet);
            state.player.planets[planetIndex] = {
              ...researchPlanet,
              resources: {
                ...researchPlanet.resources,
                iron: {
                  ...researchPlanet.resources.iron,
                  current: researchPlanet.resources.iron.current - costs.iron
                },
                kryptonite: {
                  ...researchPlanet.resources.kryptonite,
                  current: researchPlanet.resources.kryptonite.current - costs.kryptonite
                },
                metal: {
                  ...researchPlanet.resources.metal,
                  current: researchPlanet.resources.metal.current - costs.metal
                }
              }
            };

            const lab = researchPlanet.buildings.find(b => b.id === 'researchLab');
            return {
              ...tech,
              isResearching: true,
              timeRemaining: calculateResearchTime(tech, lab?.level || 0)
            };
          }
          return tech;
        })
      }
    }));
  },

  buildUnit: (planetId: string, unitId: string, count: number) => {
    set(state => ({
      player: {
        ...state.player,
        planets: state.player.planets.map(planet => {
          if (planet.id !== planetId) return planet;

          const unit = COMBAT_UNITS[unitId];
          if (!unit) return planet;

          const totalCost = {
            iron: unit.cost.iron * count,
            kryptonite: unit.cost.kryptonite * count,
            metal: unit.cost.metal * count,
          };

          if (planet.resources.iron.current < totalCost.iron ||
              planet.resources.kryptonite.current < totalCost.kryptonite ||
              planet.resources.metal.current < totalCost.metal) {
            return planet;
          }

          const newResources = {
            ...planet.resources,
            iron: {
              ...planet.resources.iron,
              current: planet.resources.iron.current - totalCost.iron
            },
            kryptonite: {
              ...planet.resources.kryptonite,
              current: planet.resources.kryptonite.current - totalCost.kryptonite
            },
            metal: {
              ...planet.resources.metal,
              current: planet.resources.metal.current - totalCost.metal
            }
          };

          const constructionTime = calculateMilitaryConstructionTime(unit.buildTime, count, planet);
          const newUnitsInProduction = [
            ...planet.unitsInProduction,
            {
              unitId,
              count,
              timeRemaining: constructionTime
            }
          ];

          return {
            ...planet,
            resources: newResources,
            unitsInProduction: newUnitsInProduction
          };
        })
      }
    }));
  },

  buildDefense: (planetId: string, defenseId: string, count: number) => {
    set(state => ({
      player: {
        ...state.player,
        planets: state.player.planets.map(planet => {
          if (planet.id !== planetId) return planet;

          const defense = DEFENSE_STRUCTURES[defenseId];
          if (!defense) return planet;

          const totalCost = {
            iron: defense.cost.iron * count,
            kryptonite: defense.cost.kryptonite * count,
            metal: defense.cost.metal * count,
          };

          if (planet.resources.iron.current < totalCost.iron ||
              planet.resources.kryptonite.current < totalCost.kryptonite ||
              planet.resources.metal.current < totalCost.metal) {
            return planet;
          }

          const newResources = {
            ...planet.resources,
            iron: {
              ...planet.resources.iron,
              current: planet.resources.iron.current - totalCost.iron
            },
            kryptonite: {
              ...planet.resources.kryptonite,
              current: planet.resources.kryptonite.current - totalCost.kryptonite
            },
            metal: {
              ...planet.resources.metal,
              current: planet.resources.metal.current - totalCost.metal
            }
          };

          const constructionTime = calculateMilitaryConstructionTime(defense.buildTime, count, planet);
          const newDefensesInProduction = [
            ...planet.defensesInProduction,
            {
              defenseId,
              count,
              timeRemaining: constructionTime
            }
          ];

          return {
            ...planet,
            resources: newResources,
            defensesInProduction: newDefensesInProduction
          };
        })
      }
    }));
  },

  launchFleet: (fleet: Fleet) => {
    set(state => ({
      player: {
        ...state.player,
        fleets: [...state.player.fleets, {
          ...fleet,
          departureTime: Date.now()
        }],
        planets: state.player.planets.map(p => {
          if (p.id === fleet.origin) {
            const updatedUnits = { ...p.units };
            Object.entries(fleet.units).forEach(([unitId, count]) => {
              updatedUnits[unitId] = (updatedUnits[unitId] || 0) - count;
            });

            const updatedResources = { ...p.resources };
            if (fleet.resources) {
              Object.entries(fleet.resources).forEach(([resource, amount]) => {
                if (resource !== 'energy') {
                  updatedResources[resource].current -= amount;
                }
              });
            }

            return {
              ...p,
              units: updatedUnits,
              resources: updatedResources
            };
          }
          return p;
        })
      }
    }));
  },

  processArrivedFleets: () => {
    set(state => {
      const now = Date.now();
      const { activeFleets, arrivedFleets } = state.player.fleets.reduce(
        (acc, fleet) => {
          if (fleet.arrivalTime && fleet.arrivalTime <= now) {
            acc.arrivedFleets.push(fleet);
          } else {
            acc.activeFleets.push(fleet);
          }
          return acc;
        },
        { activeFleets: [], arrivedFleets: [] } as { activeFleets: Fleet[], arrivedFleets: Fleet[] }
      );

      let updatedPlanets = [...state.player.planets];

      arrivedFleets.forEach(fleet => {
        if (fleet.mission === 'colonize') {
          if (updatedPlanets.length < UNIVERSE_CONSTANTS.MAX_PLANETS) {
            const [destGalaxy, destSystem, destPosition] = fleet.destination.split(':').map(Number);
            const newPlanet = createInitialPlanet(`planet-${Date.now()}`, {
              galaxy: destGalaxy,
              system: destSystem,
              position: destPosition
            });

            if (fleet.resources) {
              Object.entries(fleet.resources).forEach(([resource, amount]) => {
                if (resource !== 'energy') {
                  newPlanet.resources[resource as keyof typeof newPlanet.resources].current += amount;
                }
              });
            }

            const transportedUnits = { ...fleet.units };
            delete transportedUnits['colonyShip'];
            newPlanet.units = transportedUnits;

            updatedPlanets.push(newPlanet);
          }
        } else {
          const destPlanet = updatedPlanets.find(p => p.id === fleet.destination);
          if (destPlanet) {
            if (fleet.resources) {
              Object.entries(fleet.resources).forEach(([resource, amount]) => {
                if (resource !== 'energy') {
                  destPlanet.resources[resource as keyof typeof destPlanet.resources].current += amount;
                }
              });
            }

            Object.entries(fleet.units).forEach(([unitId, count]) => {
              destPlanet.units[unitId] = (destPlanet.units[unitId] || 0) + count;
            });
          }
        }
      });

      return {
        ...state,
        player: {
          ...state.player,
          planets: updatedPlanets,
          fleets: activeFleets
        }
      };
    });
  },

  setGameSpeed: (speed: number) => {
    set({ gameSpeed: speed });
  },

  renamePlanet: (planetId: string, newName: string) => {
    set(state => ({
      player: {
        ...state.player,
        planets: state.player.planets.map(planet => 
          planet.id === planetId ? { ...planet, name: newName } : planet
        )
      }
    }));
  }
}));