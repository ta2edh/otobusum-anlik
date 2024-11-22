import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { randomUUID } from 'expo-crypto'
import { ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface FiltersStore {
  selectedRoutes: Record<string, string>
  invisibleRoutes: Record<string, boolean>
  lineGroups: Record<string, string[]>
  selectedGroup: string | undefined
  selectGroup: (groupUuid: string) => void
  addLineToGroup: (lineCode: string, groupUuid: string) => void
  createNewGroup: () => void
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
        selectedGroup: undefined,
        selectGroup: groupId => set(() => ({ selectedGroup: groupId })),
        addLineToGroup: (lineCode, groupUuid) =>
          set((state) => {
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
        createNewGroup: () =>
          set((state) => {
            const uuid = randomUUID()
            return {
              lineGroups: {
                ...state.lineGroups,
                [uuid]: [],
              },
            }
          }),
        toggleInvisibleRoute: code =>
          set((state) => {
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
