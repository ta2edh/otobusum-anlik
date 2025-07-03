import { type Theme } from '@material/material-color-utilities'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { randomUUID } from 'expo-crypto'
import { AppState, AppStateStatus } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

import { useFiltersStore } from './filters'
import { useMiscStore } from './misc'

import { queryClient } from '@/api/client'
import { lineUpdateInterval } from '@/constants/app'
import { ColorSchemes } from '@/constants/colors'
import { i18n } from '@/translations/i18n'
import { Cities } from '@/types/cities'
import { LineGroup } from '@/types/lineGroup'
import { createTheme, materialThemeToLocalSchemes } from '@/utils/createTheme'
import { notify } from '@/utils/notify'

interface StoreV0 {
  lines: Record<string, object[]>
}

export interface StoreV2 {
  lines: Record<Cities, string>
  lineTheme: Record<Cities, Record<string, Theme>>
  lineGroups: Record<Cities, Record<string, LineGroup>>
}

export interface LinesStore {
  lines: Record<Cities, string[]>
  lineTheme: Record<Cities, Record<string, ColorSchemes>>
  lineGroups: Record<Cities, Record<string, LineGroup>>
  _hasHydrated: boolean
  clearAllLines: () => void
  clearAllGroups: () => void
}

export const useLinesStore = create(
  subscribeWithSelector(
    persist<LinesStore>(
      (set, get) => ({
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
        _hasHydrated: false,
        clearAllLines: () => {
          const { lines, lineTheme } = get()
          const filtersStore = useFiltersStore.getState()
          const currentCity = filtersStore.selectedCity
          const linesToClear = lines[currentCity]
          
          if (linesToClear.length === 0) return
          
          // Batch query removal for better performance
          const queriesToRemove = linesToClear.flatMap(lineCode => [
            ['line', lineCode],
            ['stop-locations', lineCode],
            ['line-routes', lineCode]
          ])
          
          queriesToRemove.forEach(queryKey => {
            queryClient.removeQueries({ queryKey })
          })
          
          // Clear invisible lines for current city lines in one operation
          const miscStore = useMiscStore.getState()
          const newInvisibleLines = miscStore.invisibleLines.filter(
            lineCode => !linesToClear.includes(lineCode)
          )
          useMiscStore.setState({ invisibleLines: newInvisibleLines })
          
          set((state) => ({
            lines: {
              ...state.lines,
              [currentCity]: [],
            },
            lineTheme: {
              ...state.lineTheme,
              [currentCity]: {},
            },
          }))
        },
        clearAllGroups: () => {
          const { lineGroups } = get()
          const filtersStore = useFiltersStore.getState()
          const currentCity = filtersStore.selectedCity
          const groupsToRemove = lineGroups[currentCity]
          
          if (Object.keys(groupsToRemove).length === 0) return
          
          // Batch query removal for better performance
          const allGroupLineCodes = Object.values(groupsToRemove)
            .flatMap(group => group.lineCodes)
          
          const queriesToRemove = allGroupLineCodes.flatMap(lineCode => [
            ['line', lineCode],
            ['stop-locations', lineCode],
            ['line-routes', lineCode]
          ])
          
          queriesToRemove.forEach(queryKey => {
            queryClient.removeQueries({ queryKey })
          })
          
          // Clear invisible lines for group lines in one operation
          const miscStore = useMiscStore.getState()
          const newInvisibleLines = miscStore.invisibleLines.filter(
            lineCode => !allGroupLineCodes.includes(lineCode)
          )
          useMiscStore.setState({ invisibleLines: newInvisibleLines })
          
          // Reset selected group if it exists
          if (filtersStore.selectedGroup) {
            useFiltersStore.setState({ selectedGroup: null })
          }
          
          set((state) => ({
            lineGroups: {
              ...state.lineGroups,
              [currentCity]: {},
            },
          }))
        },
      }),
      {
        name: 'line-storage',
        storage: createJSONStorage(() => AsyncStorage),
        version: 3,
        onRehydrateStorage: () => (state) => {
          console.log('Lines store rehydration complete', state)
          if (state) {
            state._hasHydrated = true
          }
        },
        migrate: (persistedStore, version) => {
          const store = persistedStore as LinesStore

          if (version === 0 || version === undefined) {
            const oldStore = persistedStore as unknown as StoreV0
            const keys = Object.keys(oldStore.lines)

            store.lines.istanbul = keys
          }

          if (version === 2) {
            const oldStore = persistedStore as unknown as StoreV2

            for (const [city, lineThemes] of Object.entries(oldStore.lineTheme)) {
              for (const [lineCode, lineTheme] of Object.entries(lineThemes)) {
                store.lineTheme[city as Cities][lineCode] = materialThemeToLocalSchemes(lineTheme)
              }
            }
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

  return (
    linesStore.lineGroups[filtersStore.selectedCity][filtersStore.selectedGroup]?.lineCodes || []
  )
}

// Line stuff
export const deleteLine = (lineCode: string) => {
  useLinesStore.setState((state) => {
    const filtersStore = useFiltersStore.getState()
    const defaultLinesIndex = state.lines[filtersStore.selectedCity].indexOf(lineCode)

    const selectedGroup = useFiltersStore.getState().selectedGroup
    if (selectedGroup) {
      deleteLineFromGroup(selectedGroup, filtersStore.selectedCity, lineCode)
    } else if (defaultLinesIndex !== -1) {
      state.lines[filtersStore.selectedCity].splice(defaultLinesIndex, 1)
    }

    deleteTheme(lineCode)

    return {
      lines: {
        ...state.lines,
        [filtersStore.selectedCity]: [...state.lines[filtersStore.selectedCity]],
      },
    }
  })

  // Also remove from invisible lines if present
  const miscStore = useMiscStore.getState()
  const invisibleIndex = miscStore.invisibleLines.indexOf(lineCode)
  if (invisibleIndex !== -1) {
    useMiscStore.setState((miscState) => {
      const newInvisibleLines = [...miscState.invisibleLines]
      newInvisibleLines.splice(invisibleIndex, 1)
      return {
        invisibleLines: newInvisibleLines,
      }
    })
  }

  // Clear specific queries for this line to remove markers from map
  console.log(`🗑️ Removing queries for line: ${lineCode}`)
  queryClient.removeQueries({ queryKey: ['line', lineCode] })
  queryClient.removeQueries({ queryKey: ['stop-locations', lineCode] })
  queryClient.removeQueries({ queryKey: ['line-routes', lineCode] })
  
  // Don't invalidate other queries to prevent flickering
  console.log(`✅ Line ${lineCode} removed without invalidating other queries`)
}

export const addLine = (lineCode: string) =>
  useLinesStore.setState((state) => {
    const filtersStore = useFiltersStore.getState()

    if (state.lines[filtersStore.selectedCity].includes(lineCode)) {
      return state
    }

    addTheme(lineCode)
    notify(i18n.t('added', { lineCode: lineCode }), 'success')

    // Ensure the line is visible when added
    const miscStore = useMiscStore.getState()
    const invisibleIndex = miscStore.invisibleLines.indexOf(lineCode)
    if (invisibleIndex !== -1) {
      useMiscStore.setState((miscState) => {
        const newInvisibleLines = [...miscState.invisibleLines]
        newInvisibleLines.splice(invisibleIndex, 1)
        return {
          invisibleLines: newInvisibleLines,
        }
      })
    }

    // Invalidate bus locations query to refresh data
    queryClient.invalidateQueries({ queryKey: ['line', lineCode] })

    return {
      lines: {
        ...state.lines,
        [filtersStore.selectedCity]: [...state.lines[filtersStore.selectedCity], lineCode],
      },
    }
  })

// Line stuff end

// Theme stuff
export const addTheme = (lineCode: string) =>
  useLinesStore.setState((state) => {
    const filtersStore = useFiltersStore.getState()

    if (state.lineTheme[filtersStore.selectedCity][lineCode]) {
      return state
    }

    return {
      lineTheme: {
        ...state.lineTheme,
        [filtersStore.selectedCity]: {
          ...state.lineTheme[filtersStore.selectedCity],
          [lineCode]: createTheme(undefined, lineCode), // Pass lineCode for deterministic colors
        },
      },
    }
  })

export const deleteTheme = (lineCode: string) =>
  useLinesStore.setState((state) => {
    const filtersStore = useFiltersStore.getState()

    const groupAllLineCodes = Object.values(state.lineGroups)
      .map(group => Object.values(group))
      .flat()
      .map(group => group.lineCodes)
      .flat()

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
export const createNewGroup = () =>
  useLinesStore.setState((state) => {
    const filtersStore = useFiltersStore.getState()
    const id = randomUUID()

    return {
      lineGroups: {
        ...state.lineGroups,
        [filtersStore.selectedCity]: {
          ...state.lineGroups[filtersStore.selectedCity],
          [id]: {
            id,
            title: `new group ${Object.keys(state.lineGroups).length + 1}`,
            lineCodes: [],
          },
        },
      },
    }
  })

export const addLineToGroup = (groupId: string, lineCode: string) =>
  useLinesStore.setState((state) => {
    const filtersStore = useFiltersStore.getState()
    const group = state.lineGroups[filtersStore.selectedCity][groupId]
    if (!group) return state

    if (group.lineCodes.includes(lineCode)) {
      notify(i18n.t('lineAlreadyInGroup'), 'warning')
      return state
    }

    notify(i18n.t('addedToGroup', { lineCode: lineCode }), 'success')
    addTheme(lineCode)

    // Ensure the line is visible when added to group
    const miscStore = useMiscStore.getState()
    const invisibleIndex = miscStore.invisibleLines.indexOf(lineCode)
    if (invisibleIndex !== -1) {
      useMiscStore.setState((miscState) => {
        const newInvisibleLines = [...miscState.invisibleLines]
        newInvisibleLines.splice(invisibleIndex, 1)
        return {
          invisibleLines: newInvisibleLines,
        }
      })
    }

    // Invalidate bus locations query to refresh data
    queryClient.invalidateQueries({ queryKey: ['line', lineCode] })

    return {
      lineGroups: {
        ...state.lineGroups,
        [filtersStore.selectedCity]: {
          ...state.lineGroups[filtersStore.selectedCity],
          [groupId]: {
            ...state.lineGroups[filtersStore.selectedCity][groupId],
            lineCodes: [
              ...state.lineGroups[filtersStore.selectedCity][groupId]!.lineCodes,
              lineCode,
            ],
          },
        },
      },
    }
  })

export const updateGroupTitle = (groupId: string, newTitle: string) =>
  useLinesStore.setState((state) => {
    const filtersStore = useFiltersStore.getState()
    const group = state.lineGroups[filtersStore.selectedCity][groupId]
    if (!group) return state

    return {
      lineGroups: {
        ...state.lineGroups,
        [filtersStore.selectedCity]: {
          ...state.lineGroups[filtersStore.selectedCity],
          [groupId]: {
            ...state.lineGroups[filtersStore.selectedCity][groupId],
            title: newTitle,
          },
        },
      },
    }
  })

export const deleteGroup = (groupId: string) =>
  useLinesStore.setState((state) => {
    const filtersStore = useFiltersStore.getState()
    const group = state.lineGroups[filtersStore.selectedCity][groupId]
    if (!group) return state

    group.lineCodes.forEach(lineCode =>
      deleteLineFromGroup(groupId, filtersStore.selectedCity, lineCode),
    )
    delete state.lineGroups[filtersStore.selectedCity][groupId]

    return {
      lineGroups: {
        ...state.lineGroups,
      },
    }
  })

export const deleteLineFromGroup = (groupId: string, city: Cities, lineCode: string) =>
  useLinesStore.setState((state) => {
    const lineIndex = state.lineGroups[city][groupId]?.lineCodes.indexOf(lineCode)
    const filtersStore = useFiltersStore.getState()
    if (lineIndex === undefined || lineIndex === -1) return state

    state.lineGroups[city][groupId]!.lineCodes.splice(lineIndex, 1)
    deleteTheme(lineCode)

    // Also remove from invisible lines if present
    const miscStore = useMiscStore.getState()
    const invisibleIndex = miscStore.invisibleLines.indexOf(lineCode)
    if (invisibleIndex !== -1) {
      useMiscStore.setState((miscState) => {
        const newInvisibleLines = [...miscState.invisibleLines]
        newInvisibleLines.splice(invisibleIndex, 1)
        return {
          invisibleLines: newInvisibleLines,
        }
      })
    }

    // Clear queries for this line - no invalidation to prevent flickering
    console.log(`🗑️ Removing group line queries for: ${lineCode}`)
    queryClient.removeQueries({ queryKey: ['line', lineCode] })
    queryClient.removeQueries({ queryKey: ['stop-locations', lineCode] })
    queryClient.removeQueries({ queryKey: ['line-routes', lineCode] })

    return {
      lineGroups: {
        ...state.lineGroups,
        [filtersStore.selectedCity]: {
          ...state.lineGroups[filtersStore.selectedCity],
          [groupId]: {
            ...state.lineGroups[filtersStore.selectedCity][groupId],
            lineCodes: [...(state.lineGroups[filtersStore.selectedCity][groupId]?.lineCodes || [])],
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
const updateLines = () => {
  const linesStore = useLinesStore.getState()
  const filtersStore = useFiltersStore.getState()

  const lines = filtersStore.selectedGroup
    ? linesStore.lineGroups[filtersStore.selectedCity][filtersStore.selectedGroup]?.lineCodes
    : linesStore.lines[filtersStore.selectedCity]

  const lineCodes = lines || []
  for (let index = 0; index < lineCodes.length; index++) {
    const key = lineCodes[index]
    if (!key) continue

    queryClient.invalidateQueries({
      queryKey: ['line', key],
      exact: true,
    })
  }
}

let listener: number | undefined
let appState: AppStateStatus = AppState.currentState
let expectedUpdateTime = Date.now() + lineUpdateInterval

const updateLoop = () => {
  updateLines()
  expectedUpdateTime = Date.now() + lineUpdateInterval

  return setTimeout(updateLoop, lineUpdateInterval)
}

const startUpdateLoop = () => {
  AppState.addEventListener('change', (newAppState) => {
    if (appState.match(/inactive|background/) && newAppState === 'active') {
      const drift = Date.now() - expectedUpdateTime

      if (drift > lineUpdateInterval) {
        clearTimeout(listener)
        listener = updateLoop()
      }
    } else if (newAppState.match(/background|inactive/) && appState === 'active') {
      clearTimeout(listener)
    }

    appState = newAppState
  })

  listener = updateLoop()
}

if (!__DEV__) {
  useLinesStore.persist.onFinishHydration(startUpdateLoop)
}

// Regenerate all line themes with new distinct colors
export const regenerateAllLineColors = () => {
  useLinesStore.setState((state) => {
    const filtersStore = useFiltersStore.getState()
    const currentLineThemes = state.lineTheme[filtersStore.selectedCity]
    const newLineThemes: Record<string, ColorSchemes> = {}
    
    // Regenerate themes for all existing lines
    Object.keys(currentLineThemes).forEach((lineCode) => {
      newLineThemes[lineCode] = createTheme(undefined, lineCode)
    })
    
    return {
      lineTheme: {
        ...state.lineTheme,
        [filtersStore.selectedCity]: newLineThemes,
      },
    }
  })
}

// Clear all lines and groups
export const clearAllLines = () => {
  useLinesStore.setState((state) => {
    const filtersStore = useFiltersStore.getState()

    // Clear lines
    const newLines = {
      ...state.lines,
      [filtersStore.selectedCity]: [],
    }

    // Clear line themes
    const newLineTheme = {
      ...state.lineTheme,
      [filtersStore.selectedCity]: {},
    }

    // Clear line groups
    const newLineGroups = {
      ...state.lineGroups,
      [filtersStore.selectedCity]: {},
    }

    return {
      lines: newLines,
      lineTheme: newLineTheme,
      lineGroups: newLineGroups,
    }
  })
}

export const clearAllGroups = () => {
  useLinesStore.setState((state) => {
    const filtersStore = useFiltersStore.getState()

    // Clear line groups
    const newLineGroups = {
      ...state.lineGroups,
      [filtersStore.selectedCity]: {},
    }

    return {
      lineGroups: newLineGroups,
    }
  })
}
