import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface FiltersStore {
  selectedRoutes: Record<string, string>
  invisibleRoutes: Record<string, boolean>
  toggleInvisibleRoute: (code: string) => void
  setRoute: (code: string, routeCode: string) => void
}

export const useFilters = create(
  subscribeWithSelector(
    persist<FiltersStore>(
      (set, _get) => ({
        selectedRoutes: {},
        invisibleRoutes: {},
        toggleInvisibleRoute: code => set((state) => {
          if (state.invisibleRoutes[code]) {
            delete state.invisibleRoutes[code]
            return {
              invisibleRoutes: {
                ...state.invisibleRoutes,
              },
            }
          }

          return {
            invisibleRoutes: {
              ...state.invisibleRoutes,
              [code]: true,
            },
          }
        }),
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
