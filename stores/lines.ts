import { Theme } from '@material/material-color-utilities'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { randomUUID } from 'expo-crypto'
import { ToastAndroid } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

import { useFiltersStore } from './filters'

import { queryClient } from '@/api/client'
import { i18n } from '@/translations/i18n'
import { Cities } from '@/types/cities'
import { LineGroup } from '@/types/lineGroup'
import { createTheme } from '@/utils/createTheme'

interface StoreV0 {
  lines: Record<string, object[]>
}

interface StoreV1 {
  lines: string[]
  lineTheme: Record<string, Theme>
  lineGroups: Record<string, LineGroup>
}

export interface LinesStore {
  lines: Record<Cities, string[]>
  lineTheme: Record<Cities, Record<string, Theme>>
  lineGroups: Record<Cities, Record<string, LineGroup>>
}

export const useLinesStore = create(
  subscribeWithSelector(
    persist<LinesStore>(
      () => ({
        lines: {
          istanbul: [],
          izmir: [],
        },
        lineTheme: {
          istanbul: {},
          izmir: {},
        },
        lineGroups: {
          istanbul: {},
          izmir: {},
        },
      }),
      {
        name: 'line-storage',
        storage: createJSONStorage(() => AsyncStorage),
        version: 2,
        migrate: (persistedStore, version) => {
          const store = persistedStore as LinesStore

          if (version === 0 || version === undefined) {
            const oldStore = persistedStore as unknown as StoreV0
            const keys = Object.keys(oldStore.lines)

            store.lines.istanbul = keys
          }

          if (version === 1) {
            const oldStore = persistedStore as unknown as StoreV1
            store.lines.istanbul = oldStore.lines
          }

          return persistedStore as LinesStore
        },
      },
    ),
  ),
)

export const getLines = () => {
  const linesStore = useLinesStore.getState()
  const filtersStore = useFiltersStore.getState()

  if (!filtersStore.selectedGroup) {
    return linesStore.lines[filtersStore.selectedCity]
  }

  return linesStore.lineGroups[filtersStore.selectedCity][filtersStore.selectedGroup]?.lineCodes || []
}

// Line stuff
export const deleteLine = (lineCode: string) => useLinesStore.setState((state) => {
  const filtersStore = useFiltersStore.getState()
  const index = state.lines[filtersStore.selectedCity].indexOf(lineCode)

  const selectedGroup = useFiltersStore.getState().selectedGroup
  if (selectedGroup) {
    deleteLineFromGroup(selectedGroup, filtersStore.selectedCity, lineCode)
  } else if (index !== -1) {
    state.lines[filtersStore.selectedCity].splice(index, 1)
  }

  deleteTheme(lineCode)

  return {
    lines: {
      ...state.lines,
      [filtersStore.selectedCity]: [...state.lines[filtersStore.selectedCity]],
    },
  }
})

export const addLine = (lineCode: string) => useLinesStore.setState((state) => {
  const filtersStore = useFiltersStore.getState()

  if (state.lines[filtersStore.selectedCity].length > 3) {
    ToastAndroid.show(i18n.t('lineLimitExceeded'), ToastAndroid.SHORT)
    return state
  }

  if (state.lines[filtersStore.selectedCity].includes(lineCode)) return state

  addTheme(lineCode)
  ToastAndroid.show(i18n.t('added', { lineCode: lineCode }), ToastAndroid.SHORT)

  return {
    lines: {
      ...state.lines,
      [filtersStore.selectedCity]: [...state.lines[filtersStore.selectedCity], lineCode],
    },
  }
})

// Line stuff end

// Theme stuff
export const addTheme = (lineCode: string) => useLinesStore.setState((state) => {
  const filtersStore = useFiltersStore.getState()

  if (state.lineTheme[filtersStore.selectedCity][lineCode]) {
    return state
  }

  return {
    lineTheme: {
      ...state.lineTheme,
      [lineCode]: createTheme(),
    },
  }
})

export const deleteTheme = (lineCode: string) => useLinesStore.setState((state) => {
  const filtersStore = useFiltersStore.getState()

  const groupAllLineCodes = Object.values(state.lineGroups)
    .map(group => Object.values(group))
    .flat()
    .map(group => group.lineCodes)
    .flat()
  // const groupLinecodes = Object.values(state.lineGroups).map(group => group.lineCodes).flat()

  const shouldDeleteTheme
    = !groupAllLineCodes.includes(lineCode)
    && state.lines[filtersStore.selectedCity].indexOf(lineCode) === -1

  if (shouldDeleteTheme) {
    delete state.lineTheme[filtersStore.selectedCity][lineCode]
  }

  return {
    lineTheme: {
      ...state.lineTheme,
    },
  }
})

export const getTheme = (lineCode: string) => {
  const linesStore = useLinesStore.getState()
  const filtersStore = useFiltersStore.getState()

  return linesStore.lineTheme[filtersStore.selectedCity][lineCode]
}

// Theme stuff end

// Group stuff
export const createNewGroup = () => useLinesStore.setState((state) => {
  const id = randomUUID()

  return {
    lineGroups: {
      ...state.lineGroups,
      [id]: {
        id,
        title: `new group ${Object.keys(state.lineGroups).length + 1}`,
        lineCodes: [],
      },
    },
  }
})

export const addLineToGroup = (groupId: string, city: Cities, lineCode: string) => useLinesStore.setState((state) => {
  const group = state.lineGroups[city][groupId]
  if (!group) return state

  if (group.lineCodes.includes(lineCode)) {
    ToastAndroid.show(i18n.t('lineAlreadyInGroup'), ToastAndroid.SHORT)
    return state
  }

  if (group.lineCodes.length > 3) {
    ToastAndroid.show(i18n.t('lineLimitExceeded'), ToastAndroid.SHORT)
    return state
  }

  ToastAndroid.show(i18n.t('addedToGroup', { lineCode: lineCode }), ToastAndroid.SHORT)
  addTheme(lineCode)

  return {
    lineGroups: {
      ...state.lineGroups,
      [city]: {
        ...state.lineGroups[city],
        [groupId]: {
          ...state.lineGroups[city][groupId],
          lineCodes: [
            ...state.lineGroups[city][groupId]!.lineCodes,
            lineCode,
          ],
        },
      },
    },
  }
})

export const updateGroupTitle = (groupId: string, city: Cities, newTitle: string) => useLinesStore.setState((state) => {
  const group = state.lineGroups[city][groupId]
  if (!group) return state

  return {
    lineGroups: {
      ...state.lineGroups,
      [city]: {
        ...state.lineGroups[city],
        [groupId]: {
          ...state.lineGroups[city][groupId],
          title: newTitle,
        },
      },
    },
  }
})

export const deleteGroup = (groupId: string, city: Cities) => useLinesStore.setState((state) => {
  const group = state.lineGroups[city][groupId]
  if (!group) return state

  group.lineCodes.forEach(lineCode => deleteLineFromGroup(groupId, city, lineCode))
  delete state.lineGroups[city][groupId]

  return {
    lineGroups: {
      ...state.lineGroups,
    },
  }
})

export const deleteLineFromGroup = (groupId: string, city: Cities, lineCode: string) => useLinesStore.setState((state) => {
  const lineIndex = state.lineGroups[city][groupId]?.lineCodes.indexOf(lineCode)
  if (lineIndex === undefined || lineIndex === -1) return state

  state.lineGroups[city][groupId]!.lineCodes.splice(lineIndex, 1)
  deleteTheme(lineCode)

  return {
    lineGroups: {
      ...state.lineGroups,
      [city]: {
        ...state.lineGroups[city],
        [groupId]: {
          ...state.lineGroups[city][groupId],
          lineCodes: {
            ...state.lineGroups[city][groupId]?.lineCodes,
          },
          // lineCodes: [...(state.lineGroups[groupId]!.lineCodes || [])],
        },
      },
    },
  }
})

// Group stuff end

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
  useFiltersStore.subscribe(
    state => state.selectedGroup,
    (selectedGroup) => {
      clearTimeout(listener)

      const loop = () => {
        const linesStore = useLinesStore.getState()
        const filtersStore = useFiltersStore.getState()

        const lines = selectedGroup
          ? linesStore.lineGroups[filtersStore.selectedCity][selectedGroup]?.lineCodes
          : linesStore.lines[filtersStore.selectedCity]

        updateLines(lines || [])
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
  useLinesStore.persist.onFinishHydration(startUpdateLoop)
}
