import { Research, Planet } from '../types/game';
import { BUILDING_TYPES, UNIVERSE_CONSTANTS } from '../constants/game';

export const canResearch = (research: Research, currentResearch: Research[], planet: Planet): boolean => {
  // Check if any research is in progress
  if (currentResearch.some(r => r.isResearching)) {
    return false;
  }

  // Check if player has required laboratory level
  const lab = planet.buildings.find(b => b.id === BUILDING_TYPES.RESEARCH_LAB);
  if (!lab || lab.level < 1) {
    return false;
  }

  // Check if all required technologies are at required levels
  return Object.entries(research.requirements).every(([reqId, reqLevel]) => {
    // If it's a building requirement
    if (reqId.startsWith(BUILDING_TYPES.RESEARCH_LAB)) {
      return lab.level >= reqLevel;
    }
    // If it's a research requirement
    const requiredTech = currentResearch.find(r => r.id === reqId);
    return requiredTech && requiredTech.level >= reqLevel;
  });
};

export const calculateResearchTime = (research: Research, labLevel: number): number => {
  // Research Lab reduces research time by (1 - 1/level)
  const reduction = labLevel > 0 ? (1 - 1/labLevel) : 0;
  return Math.floor(UNIVERSE_CONSTANTS.BASE_RESEARCH_TIME * (research.level + 1) * (1 - reduction));
};

export const getResearchEffect = (research: Research): string => {
  const effectPercentage = (research.effect * 100).toFixed(0);
  return `+${effectPercentage}% per level`;
};