
import { createStore } from 'zustand/vanilla'
export type AppState = {
    isWorkspaceCreatorShowing: boolean
}

export type AppActions = {
    setIsWorkspaceCreatorShowing: (isWorkspaceCreatorShowing: boolean) => void
}

export type AppStore = AppState & AppActions

export const defaultInitState: AppState = {
    isWorkspaceCreatorShowing: false,
}

export const createAppStore = (
  initState: AppState = defaultInitState,
) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    setIsWorkspaceCreatorShowing: (isWorkspaceCreatorShowing: boolean) => set(() => ({ isWorkspaceCreatorShowing: isWorkspaceCreatorShowing })),
  }))
}
