import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { randomUUID } from 'expo-crypto'
import { ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface FiltersStore {
  selectedRoutes: Record<string, string>
  invisibleLines: Record<string, boolean>
  lineGroups: Record<string, string[]>
  selectedGroup: string | undefined
}

export const useFilters = create(
  subscribeWithSelector(
    persist<FiltersStore>(
      () => ({
        selectedRoutes: {},
        invisibleLines: {},
        lineGroups: {},
        selectedGroup: undefined,
      }),
      {
        name: 'filter-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)

export const toggleLineVisibility = (lineCode: string) => useFilters.setState((state) => {
  if (state.invisibleLines[lineCode]) {
    delete state.invisibleLines[lineCode]
    return {
      invisibleLines: {
        ...state.invisibleLines,
      },
    }
  }

  return {
    invisibleLines: {
      [lineCode]: true,
    },
  }
})

export const selectRoute = (lineCode: string, routeCode: string) => useFilters.setState((state) => {
  return {
    selectedRoutes: {
      ...state.selectedRoutes,
      [lineCode]: routeCode,
    },
  }
})

export const selectGroup = (groupId: string) => useFilters.setState((state) => {
  return {
    selectedGroup: groupId,
  }
})

export const createNewGroup = () => useFilters.setState((state) => {
  return {
    lineGroups: {
      ...state.lineGroups,
      [randomUUID()]: [],
    },
  }
})

export const addLineToGroup = (groupId: string, lineCode: string) => useFilters.setState((state) => {
  const group = state.lineGroups[groupId]
  if (!group) return state

  if (group.includes(lineCode)) {
    ToastAndroid.show('This line is already in group', ToastAndroid.SHORT)
    return state
  }

  return {
    lineGroups: {
      ...state.lineGroups,
      [groupId]: [...group, lineCode],
    },
  }
})

export const deleteLineFromGroup = (groupId: string, lineCode: string) => useFilters.setState((state) => {
  const codeIndex = state.lineGroups[groupId]?.findIndex(code => code === lineCode)
  if (!codeIndex) return state

  state.lineGroups[groupId]?.splice(codeIndex, 1)
  return {
    lineGroups: {
      ...state.lineGroups,
      [groupId]: [...(state.lineGroups[groupId] || [])],
    },
  }
})
