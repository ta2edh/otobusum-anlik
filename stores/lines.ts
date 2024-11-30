import { Theme } from '@material/material-color-utilities'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { randomUUID } from 'expo-crypto'
import { ToastAndroid } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

import { useFilters } from './filters'

import { queryClient } from '@/api/client'
import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/lineGroup'
import { createTheme } from '@/utils/createTheme'

interface StoreV0 {
  lines: Record<string, {}[]>
}

export interface LinesStore {
  lines: string[]
  lineTheme: Record<string, Theme>
  lineGroups: LineGroup[]
}

export const useLines = create(
  subscribeWithSelector(
    persist<LinesStore>(
      () => ({
        lines: [],
        lineTheme: {},
        lineGroups: [],
      }),
      {
        name: 'line-storage',
        storage: createJSONStorage(() => AsyncStorage),
        version: 1,
        migrate: (persistedStore, version) => {
          if (version === 0) {
            const st = persistedStore as StoreV0
            const keys = Object.keys(st.lines);

            (persistedStore as LinesStore).lines = keys
          }

          return persistedStore as LinesStore
        },
      },
    ),
  ),
)

export const deleteLine = (lineCode: string) => useLines.setState((state) => {
  const index = state.lines.indexOf(lineCode)
  if (index !== -1) {
    state.lines.splice(index, 1)
  }

  delete state.lineTheme[lineCode]

  const selectedGroup = useFilters.getState().selectedGroup
  if (selectedGroup) {
    deleteLineFromGroup(selectedGroup.id, lineCode)
  }

  return {
    lines: [...state.lines],
    lineTheme: {
      ...state.lineTheme,
    },
  }
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
  if (state.lines.length > 3) {
    ToastAndroid.show(i18n.t('lineLimitExceeded'), ToastAndroid.SHORT)
    return state
  }

  if (state.lines.includes(lineCode)) return state

  addTheme(lineCode)
  state.lines.push(lineCode)

  return {
    lines: [...state.lines],
  }
})

export const createNewGroup = () => useLines.setState((state) => {
  const id = randomUUID()
  return {
    lineGroups: [
      ...state.lineGroups,
      {
        id,
        title: id,
        lineCodes: [],
      },
    ],
  }
})

export const findGroupFromId = (groupId: string) => {
  return useLines.getState().lineGroups.find(gr => gr.id === groupId)
}

export const addLineToGroup = (groupId: string, lineCode: string) => useLines.setState((state) => {
  const group = findGroupFromId(groupId)
  if (!group) return state

  if (group.lineCodes.includes(lineCode)) {
    ToastAndroid.show(i18n.t('lineAlreadyInGroup'), ToastAndroid.SHORT)
    return state
  }

  if (group.lineCodes.length > 3) {
    ToastAndroid.show(i18n.t('lineLimitExceeded'), ToastAndroid.SHORT)
    return state
  }

  addTheme(lineCode)
  group.lineCodes.push(lineCode)

  return {
    lineGroups: [...state.lineGroups],
  }
})

export const updateGroupTitle = (groupId: string, newTitle: string) => useLines.setState((state) => {
  const group = findGroupFromId(groupId)
  if (!group) return state

  group.title = newTitle

  return {
    lineGroups: [...state.lineGroups],
  }
})

export const deleteGroup = (groupId: string) => useLines.setState((state) => {
  const index = state.lineGroups.findIndex(group => group.id === groupId)
  if (index === -1) return state

  const group = state.lineGroups[index]
  if (!group) return state

  state.lineGroups.splice(index, 1)

  // Check if line in the deleted group are in other groups
  // If they are not in other groups delete their theme
  // This will probably cause rerenders that are not really needed
  for (const lineCode of group.lineCodes) {
    const inOtherGroup = state.lineGroups.find(group => group.lineCodes.includes(lineCode))
    if (state.lines.includes(lineCode) || inOtherGroup) {
      continue
    }

    delete state.lineTheme[lineCode]
  }

  return {
    lineGroups: [...state.lineGroups],
    lineTheme: {
      ...state.lineTheme,
    },
  }
})

export const deleteLineFromGroup = (groupId: string, lineCode: string) => useLines.setState((state) => {
  const group = findGroupFromId(groupId)
  if (!group) return state

  const codeIndex = group.lineCodes.findIndex(code => code === lineCode)
  if (codeIndex === -1) return state

  group.lineCodes.splice(codeIndex, 1)
  return {
    lineGroups: [
      ...state.lineGroups,
    ],
  }
})

// UPDATER UPDATER UPDATER
//
//
//
//
const updateLines = (keys: string[]) => {
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    if (!key) continue

    queryClient.invalidateQueries({
      queryKey: ['line', key],
      exact: true,
    })
  }
}

let listener: NodeJS.Timeout
const startUpdateLoop = () => {
  useFilters.subscribe(
    state => state.selectedGroup,
    (newGroup) => {
      clearTimeout(listener)

      const loop = () => {
        updateLines(newGroup?.lineCodes || useLines.getState().lines)
        return setTimeout(loop, 50_000)
      }

      listener = loop()
    },
    {
      fireImmediately: true,
    },
  )
}

if (!__DEV__) {
  useLines.persist.onFinishHydration(startUpdateLoop)
}
