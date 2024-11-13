import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface FiltersStore {
  selectedRoutes: Record<string, string>
  setRoute: (code: string, routeCode: string) => void
}

export const useFilters = create(
  subscribeWithSelector(
    persist<FiltersStore>(
      (set, _get) => ({
        selectedRoutes: {},
        setRoute: (code, routeCode) =>
          set(state => ({
            selectedRoutes: { ...state.selectedRoutes, [code]: routeCode },
          })),
      }),
      {
        name: 'filter-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)
