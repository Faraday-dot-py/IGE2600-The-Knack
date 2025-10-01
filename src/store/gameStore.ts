import { create } from 'zustand';
import type { GameState, Screen, PuzzleResult } from '../types';

interface GameStore extends GameState {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  setCurrentLevel: (levelId: string) => void;
  completePuzzle: (levelId: string, result: PuzzleResult) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  PC: 50,
  SS: 50,
  starsByLevel: {},
  flags: {},
  ending: undefined,
  currentLevel: undefined,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  currentScreen: 'home',
  
  setScreen: (screen: Screen) => set({ currentScreen: screen }),
  
  setCurrentLevel: (levelId: string) => set({ currentLevel: levelId }),
  
  completePuzzle: (levelId: string, result: PuzzleResult) => {
    const state = get();
    const newPC = Math.max(0, Math.min(100, state.PC + result.pcDelta));
    const newSS = Math.max(0, Math.min(100, state.SS + result.ssDelta));
    
    // Check for overload condition
    if (newPC <= 10 || newSS <= 10) {
      set({
        PC: newPC,
        SS: newSS,
        starsByLevel: { ...state.starsByLevel, [levelId]: result.stars },
        ending: 'Overloaded'
      });
      return;
    }
    
    set({
      PC: newPC,
      SS: newSS,
      starsByLevel: { ...state.starsByLevel, [levelId]: result.stars },
    });
  },
  
  resetGame: () => set({ ...initialState, currentScreen: 'home' }),
}));