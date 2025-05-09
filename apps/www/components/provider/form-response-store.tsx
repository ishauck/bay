// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type FormResponseStore, createFormResponseStore } from '@/stores/form-response-store'

export type FormResponseStoreApi = ReturnType<typeof createFormResponseStore>

export const FormResponseStoreContext = createContext<FormResponseStoreApi | undefined>(
  undefined,
)

export interface FormResponseStoreProviderProps {
  children: ReactNode
}

export const FormResponseStoreProvider = ({
  children,
}: FormResponseStoreProviderProps) => {
  const storeRef = useRef<FormResponseStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createFormResponseStore()
  }

  return (
    <FormResponseStoreContext.Provider value={storeRef.current}>
      {children}
    </FormResponseStoreContext.Provider>
  )
}

export const useFormResponseStore = <T,>(
  selector: (store: FormResponseStore) => T,
): T => {
  const formResponseStoreContext = useContext(FormResponseStoreContext)

  if (!formResponseStoreContext) {
    throw new Error(`useFormResponseStore must be used within FormResponseStoreProvider`)
  }

  return useStore(formResponseStoreContext, selector)
}
