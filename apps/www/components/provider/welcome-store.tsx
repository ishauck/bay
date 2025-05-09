'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type WelcomeStore, createWelcomeStore } from '@/stores/welcome-store'

export type WelcomeStoreApi = ReturnType<typeof createWelcomeStore>

export const WelcomeStoreContext = createContext<WelcomeStoreApi | undefined>(
  undefined,
)

export interface WelcomeStoreProviderProps {
  children: ReactNode
}

export const WelcomeStoreProvider = ({
  children,
}: WelcomeStoreProviderProps) => {
  const storeRef = useRef<WelcomeStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createWelcomeStore()
  }

  return (
    <WelcomeStoreContext.Provider value={storeRef.current}>
      {children}
    </WelcomeStoreContext.Provider>
  )
}

export const useWelcomeStore = <T,>(
  selector: (store: WelcomeStore) => T,
): T => {
  const welcomeStoreContext = useContext(WelcomeStoreContext)

  if (!welcomeStoreContext) {
    throw new Error(`useWelcomeStore must be used within WelcomeStoreProvider`)
  }

  return useStore(welcomeStoreContext, selector)
}