export interface GameState {
  PC: number; // Personal Contentment
  SS: number; // Social Standing
  starsByLevel: Record<string, 0 | 1 | 2 | 3>;
  flags: {
    usedHint?: boolean;
    authenticChoice?: boolean;
  };
  ending?: 'Fulfilled' | 'People-Pleaser' | 'Overloaded';
  currentLevel?: string;
}

export interface Level {
  id: string;
  type: 'mechanical' | 'social';
  title: string;
  goal: string;
  timerTargetSec: number;
  scoring: {
    timeCutoffs: [number, number];
    attemptsThreshold: number;
    hintPenalty: boolean;
  };
  meterEffects: {
    base: { PC: number; SS: number };
    authenticityHook?: { PC: number; SS: number };
  };
  reflectionLine: string;
}

export type Screen = 'home' | 'levelSelect' | 'level' | 'ending';

export interface PuzzleResult {
  stars: 0 | 1 | 2 | 3;
  pcDelta: number;
  ssDelta: number;
  timeElapsed: number;
  attempts: number;
  hintsUsed: number;
}