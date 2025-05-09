import { createStore } from 'zustand/vanilla'

export type AppState = {
  isWorkspaceCreatorShowing: boolean;
  formShareModalId: string | null;
  actions: React.ReactNode[];
}

export type AppActions = {
  setIsWorkspaceCreatorShowing: (isWorkspaceCreatorShowing: boolean) => void;
  setFormShareModalId: (formShareModalId: string | null) => void;
  setActions: (actions: React.ReactNode[]) => void;
  addAction: (action: React.ReactNode) => void;
  removeAction: (action: React.ReactNode) => void;
  clearActions: () => void;
}

export type AppStore = AppState & AppActions & { reset: () => void }

export const defaultInitState: AppState = {
  isWorkspaceCreatorShowing: false,
  formShareModalId: null,
  actions: [],
}

export const createAppStore = (
  initState: AppState = defaultInitState,
) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    setIsWorkspaceCreatorShowing: (isWorkspaceCreatorShowing: boolean) => set(() => ({ isWorkspaceCreatorShowing: isWorkspaceCreatorShowing })),
    setActions: (actions: React.ReactNode[]) => set(() => ({ actions: actions })),
    addAction: (action: React.ReactNode) => set((state) => ({ actions: [...state.actions, action] })),
    removeAction: (action: React.ReactNode) => set((state) => ({ actions: state.actions.filter((a) => a !== action) })),
    clearActions: () => set(() => ({ actions: [] })),
    setFormShareModalId: (formShareModalId: string | null) => set(() => ({ formShareModalId: formShareModalId })),
    reset: () => { }, // default no-op, will be replaced in provider
  }))
}
