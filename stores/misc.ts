import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

export interface MiscStore {
  selectedLineScrollIndex: number
}

export const useMisc = create(
  subscribeWithSelector(
    persist(
      () => ({
        selectedLineScrollIndex: 0,
      }),
      {
        name: 'misc-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)
