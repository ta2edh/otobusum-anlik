import { create } from 'zustand'
import { subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware'
import { ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Theme } from '@material/material-color-utilities'
import { createTheme } from '@/utils/createTheme'
import { queryClient } from '@/api/client'
import { useFilters } from './filters'
import { randomUUID } from 'expo-crypto'
import { i18n } from '@/translations/i18n'

export interface LinesStore {
  lines: Record<string, string>
  lineTheme: Record<string, Theme>
  lineGroups: Record<string, string[]>
}

export const useLines = create(
  subscribeWithSelector(
    persist<LinesStore>(
      () => ({
        lines: {},
        lineTheme: {},
        lineGroups: {},
      }),
      {
        name: 'line-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)

export const deleteLine = (lineCode: string) => useLines.setState((state) => {
  delete state.lines[lineCode]
  delete state.lineTheme[lineCode]

  const selectedGroup = useFilters.getState().selectedGroup
  if (selectedGroup) {
    deleteLineFromGroup(selectedGroup, lineCode)
  }

  return { ...state }
})

export const addTheme = (lineCode: string) => useLines.setState((state) => {
  if (state.lineTheme[lineCode]) {
    return state
  }

  return {
    lineTheme: {
      ...state.lineTheme,
      [lineCode]: createTheme(),
    },
  }
})

export const addLine = (lineCode: string) => useLines.setState((state) => {
  if (Object.keys(state.lines).length > 3) {
    ToastAndroid.show(i18n.t('lineLimitExceeded'), ToastAndroid.SHORT)
    return state
  }

  addTheme(lineCode)
  return {
    lines: {
      ...state.lines,
      [lineCode]: lineCode,
    },
  }
})

export const createNewGroup = () => useLines.setState((state) => {
  return {
    lineGroups: {
      ...state.lineGroups,
      [randomUUID()]: [],
    },
  }
})

export const addLineToGroup = (groupId: string, lineCode: string) => useLines.setState((state) => {
  const group = state.lineGroups[groupId]
  if (!group) return state

  if (group.includes(lineCode)) {
    ToastAndroid.show(i18n.t('lineAlreadyInGroup'), ToastAndroid.SHORT)
    return state
  }

  if (group.length > 3) {
    ToastAndroid.show(i18n.t('lineLimitExceeded'), ToastAndroid.SHORT)
    return state
  }

  addTheme(lineCode)
  return {
    lineGroups: {
      ...state.lineGroups,
      [groupId]: [...group, lineCode],
    },
  }
})

export const deleteLineFromGroup = (groupId: string, lineCode: string) => useLines.setState((state) => {
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

// UPDATER UPDATER UPDATER
//
//
//
//
const updateLines = async () => {
  const keys = Object.keys(useLines.getState().lines)

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]

    if (key) {
      queryClient.invalidateQueries({
        queryKey: ['line', key],
        exact: true,
      })

      console.log('invalidating queries')
    }
  }

  setTimeout(updateLines, 50_000)
}

if (!__DEV__) {
  useLines.persist.onFinishHydration(updateLines)
}
