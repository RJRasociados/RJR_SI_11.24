import React from 'react';
import { Planet } from '../types/game';
import BuildingCard from './BuildingCard';
import { BASE_BUILDINGS, BUILDING_TYPES } from '../constants/game';
import { Factory, Database, Building2 } from 'lucide-react';
import Section from './Section';

interface PlanetOverviewProps {
  planet: Planet;
}

const PlanetOverview: React.FC<PlanetOverviewProps> = ({ planet }) => {
  const getAvailableBuildings = () => {
    return BASE_BUILDINGS.map(buildingTemplate => {
      const existingBuilding = planet.buildings.find(b => b.id === buildingTemplate.id);
      if (existingBuilding) {
        return existingBuilding;
      }
      return {
        ...buildingTemplate,
        level: 0,
        isUpgrading: false,
        upgradeTimeRemaining: 0,
      };
    });
  };

  const buildings = getAvailableBuildings();
  
  const resourceBuildings = buildings.filter(b => 
    [
      BUILDING_TYPES.IRON_MINE,
      BUILDING_TYPES.KRYPTONITE_EXTRACTOR,
      BUILDING_TYPES.METAL_FOUNDRY,
      BUILDING_TYPES.SPICE_MINE,
      BUILDING_TYPES.FUSION_PLANT,
      BUILDING_TYPES.SOLAR_PLANT,
    ].includes(b.id)
  );
  
  const storageBuildings = buildings.filter(b => 
    [
      BUILDING_TYPES.IRON_STORAGE,
      BUILDING_TYPES.KRYPTONITE_STORAGE,
      BUILDING_TYPES.METAL_STORAGE,
      BUILDING_TYPES.SPICE_STORAGE,
    ].includes(b.id)
  );
  
  const facilityBuildings = buildings.filter(b => 
    [
      BUILDING_TYPES.RESEARCH_LAB,
      BUILDING_TYPES.WEAPONS_FACTORY,
      BUILDING_TYPES.STARBASE,
      BUILDING_TYPES.DEVELOPMENT_CENTER,
      BUILDING_TYPES.MICROSYSTEM_ACCELERATOR,
    ].includes(b.id)
  );

  return (
    <div className="space-y-6">
      <Section
        title="Resource Production"
        icon={<Factory className="w-6 h-6 text-green-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourceBuildings.map(building => (
            <BuildingCard 
              key={building.id} 
              building={building} 
              planet={planet}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Storage Facilities"
        icon={<Database className="w-6 h-6 text-blue-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storageBuildings.map(building => (
            <BuildingCard 
              key={building.id} 
              building={building} 
              planet={planet}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Facilities"
        icon={<Building2 className="w-6 h-6 text-purple-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilityBuildings.map(building => (
            <BuildingCard 
              key={building.id} 
              building={building} 
              planet={planet}
            />
          ))}
        </div>
      </Section>
    </div>
  );
};

export default PlanetOverview;