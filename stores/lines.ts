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
import { LineGroup } from '@/types/lineGroup'

export interface LinesStore {
  lines: Record<string, string>
  lineTheme: Record<string, Theme>
  lineGroups: LineGroup[]
}

export const useLines = create(
  subscribeWithSelector(
    persist<LinesStore>(
      () => ({
        lines: {},
        lineTheme: {},
        lineGroups: [],
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
    deleteLineFromGroup(selectedGroup.id, lineCode)
  }

  return {
    lines: {
      ...state.lines,
    },
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
      console.log('loop start')

      const loop = () => {
        updateLines(newGroup?.lineCodes || Object.keys(useLines.getState().lines))
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
