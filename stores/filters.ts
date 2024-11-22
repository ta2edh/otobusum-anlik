import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { randomUUID } from 'expo-crypto'
import { ToastAndroid } from 'react-native'

export interface FiltersStore {
  selectedRoutes: Record<string, string>
  invisibleRoutes: Record<string, boolean>
  lineGroups: Record<string, string[]>
  addLineToGroup: (lineCode: string, groupUuid: string) => void
  createNewGroup: (lineCode: string) => void
  toggleInvisibleRoute: (code: string) => void
  setRoute: (code: string, routeCode: string) => void
}

export const useFilters = create(
  subscribeWithSelector(
    persist<FiltersStore>(
      (set, _get) => ({
        selectedRoutes: {},
        invisibleRoutes: {},
        lineGroups: {},
        addLineToGroup: (lineCode: string, groupUuid: string) => set((state) => {
          const targetGroup = state.lineGroups[groupUuid] || []

          if (targetGroup.includes(lineCode)) {
            ToastAndroid.show('This line is already in group', ToastAndroid.SHORT)
            return state
          }

          return {
            lineGroups: {
              ...state.lineGroups,
              [groupUuid]: [...targetGroup, lineCode],
            },
          }
        }),
        createNewGroup: (lineCode: string) => set((state) => {
          const uuid = randomUUID()

          return {
            lineGroups: {
              ...state.lineGroups,
              [uuid]: [lineCode],
            },
          }
        }),
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
