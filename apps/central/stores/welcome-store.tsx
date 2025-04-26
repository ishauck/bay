import { createStore } from 'zustand/vanilla'
export type WelcomeState = {
  isAllowedToContinue: boolean;
  currentStep: number;
  maxStepAchieved: number;
}

export type WelcomeActions = {
  setIsAllowedToContinue: (isAllowedToContinue: boolean) => void;
  setCurrentStep: (currentStep: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

export type WelcomeStore = WelcomeState & WelcomeActions

export const defaultInitState: WelcomeState = {
  isAllowedToContinue: true,
  currentStep: 0,
  maxStepAchieved: 0,
}

export const createWelcomeStore = (
  initState: WelcomeState = defaultInitState,
) => {
  return createStore<WelcomeStore>()((set, get) => ({
    ...initState,
    setIsAllowedToContinue: (isAllowedToContinue: boolean) => set(() => ({ isAllowedToContinue: isAllowedToContinue })),
    setCurrentStep: (currentStep: number) => set(() => ({ currentStep: currentStep, maxStepAchieved: Math.max(get().maxStepAchieved, currentStep) })),
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1, maxStepAchieved: Math.max(state.maxStepAchieved, state.currentStep + 1) })),
    previousStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    reset: () => set(defaultInitState),
  }))
}
