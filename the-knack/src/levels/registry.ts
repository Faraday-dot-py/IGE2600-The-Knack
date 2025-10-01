import type { Level } from '../types';

export const LEVELS: Level[] = [
  {
    id: 'printerPanic',
    type: 'mechanical',
    title: 'Printer Panic',
    goal: 'Get the 3D printer to achieve first-layer adhesion via bed leveling and nozzle temp.',
    timerTargetSec: 60,
    scoring: {
      timeCutoffs: [60, 90],
      attemptsThreshold: 3,
      hintPenalty: true,
    },
    meterEffects: {
      base: { PC: 15, SS: 5 }, // 3 star mechanical success
    },
    reflectionLine: "I don't know, it just \"looks\" like a good first layer."
  },
  {
    id: 'smallTalk',
    type: 'social',
    title: 'Small Talk, Big Gap',
    goal: 'Sustain a basic chat without derailing.',
    timerTargetSec: 60,
    scoring: {
      timeCutoffs: [60, 90],
      attemptsThreshold: 2,
      hintPenalty: true,
    },
    meterEffects: {
      base: { PC: 5, SS: 15 }, // 3 star social success
      authenticityHook: { PC: 8, SS: -6 },
    },
    reflectionLine: "I answer the question asked, not the question meant."
  },
  {
    id: 'powerLoop',
    type: 'mechanical',
    title: 'Power Loop',
    goal: 'Snap together a battery → switch → fan circuit so the fan spins.',
    timerTargetSec: 60,
    scoring: {
      timeCutoffs: [60, 90],
      attemptsThreshold: 3,
      hintPenalty: true,
    },
    meterEffects: {
      base: { PC: 15, SS: 5 }, // 3 star mechanical success
    },
    reflectionLine: "When the path is clear, power flows."
  },
  {
    id: 'showAndTell',
    type: 'social',
    title: 'Show & Tell (...or Brag?)',
    goal: 'Share your cool project without being perceived as bragging.',
    timerTargetSec: 60,
    scoring: {
      timeCutoffs: [60, 90],
      attemptsThreshold: 2,
      hintPenalty: true,
    },
    meterEffects: {
      base: { PC: 5, SS: 15 }, // 3 star social success
      authenticityHook: { PC: 8, SS: -6 },
    },
    reflectionLine: "Sharing joy reads different depending on who's listening."
  },
];

export const getLevelById = (id: string): Level | undefined => {
  return LEVELS.find(level => level.id === id);
};

export const getNextLevel = (currentId: string): Level | undefined => {
  const currentIndex = LEVELS.findIndex(level => level.id === currentId);
  return currentIndex !== -1 && currentIndex < LEVELS.length - 1 
    ? LEVELS[currentIndex + 1] 
    : undefined;
};