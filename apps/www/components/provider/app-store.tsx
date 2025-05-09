'use client'

import { type ReactNode, createContext, useRef, useContext, useEffect } from 'react'
import { useStore } from 'zustand'
import { usePathname } from 'next/navigation'

import { type AppStore as BaseAppStore, createAppStore, defaultInitState } from '@/stores/app-store'

export type AppStore = BaseAppStore & { reset: () => void }
export type AppStoreApi = ReturnType<typeof createAppStore>

export const AppStoreContext = createContext<AppStoreApi | undefined>(
  undefined,
)

export interface AppStoreProviderProps {
  children: ReactNode
}

export const AppStoreProvider = ({
  children,
}: AppStoreProviderProps) => {
  const storeRef = useRef<AppStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createAppStore()
  }
  const pathname = usePathname()

  // Add reset method to store if not present
  const store = storeRef.current as AppStoreApi & { getState: () => AppStore }
  if (store && typeof store.getState().reset !== 'function') {
    store.setState({
      ...store.getState(),
      reset: () => store.setState(defaultInitState),
    })
  }

  useEffect(() => {
    store.getState().reset?.()
  }, [pathname, store])

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  )
}

export const useAppStore = <T,>(
  selector: (store: AppStore) => T,
): T => {
  const appStoreContext = useContext(AppStoreContext)

  if (!appStoreContext) {
    throw new Error(`useAppStore must be used within AppStoreProvider`)
  }

  return useStore(appStoreContext, selector)
}