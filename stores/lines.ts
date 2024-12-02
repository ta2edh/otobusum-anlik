import { Theme } from '@material/material-color-utilities'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { randomUUID } from 'expo-crypto'
import { ToastAndroid } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

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
  lineGroups: Record<string, LineGroup>
  selectedGroup?: string
}

export const useLinesStore = create(
  subscribeWithSelector(
    persist<LinesStore>(
      () => ({
        lines: [],
        lineTheme: {},
        lineGroups: {},
        selectedGroup: undefined,
      }),
      {
        name: 'line-storage',
        storage: createJSONStorage(() => AsyncStorage),
        version: 1,
        migrate: (persistedStore, version) => {
          if (version === 0 || version === undefined) {
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

// Line stuff
export const deleteLine = (lineCode: string) => useLinesStore.setState((state) => {
  const index = state.lines.indexOf(lineCode)

  const selectedGroup = useLinesStore.getState().selectedGroup
  if (selectedGroup) {
    deleteLineFromGroup(selectedGroup, lineCode)
  } else if (index !== -1) {
    state.lines.splice(index, 1)
  }

  deleteTheme(lineCode)

  return {
    lines: [...state.lines],
  }
})

export const addLine = (lineCode: string) => useLinesStore.setState((state) => {
  if (state.lines.length > 3) {
    ToastAndroid.show(i18n.t('lineLimitExceeded'), ToastAndroid.SHORT)
    return state
  }

  if (state.lines.includes(lineCode)) return state

  addTheme(lineCode)
  ToastAndroid.show(i18n.t('added', { lineCode: lineCode }), ToastAndroid.SHORT)

  return {
    lines: [...state.lines, lineCode],
  }
})
// Line stuff end

// Theme stuff
export const addTheme = (lineCode: string) => useLinesStore.setState((state) => {
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

export const deleteTheme = (lineCode: string) => useLinesStore.setState((state) => {
  const groupLinecodes = Object.values(state.lineGroups).map(group => group.lineCodes).flat()
  const shouldDeleteTheme = !groupLinecodes.includes(lineCode) && state.lines.indexOf(lineCode) === -1

  if (shouldDeleteTheme) {
    delete state.lineTheme[lineCode]
  }

  return {
    lineTheme: {
      ...state.lineTheme,
    },
  }
})
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

export const addLineToGroup = (groupId: string, lineCode: string) => useLinesStore.setState((state) => {
  const group = state.lineGroups[groupId]
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
      [groupId]: {
        ...state.lineGroups[groupId]!,
        lineCodes: [
          ...(state.lineGroups[groupId]?.lineCodes || []),
          lineCode,
        ],
      },
    },
  }
})

export const updateGroupTitle = (groupId: string, newTitle: string) => useLinesStore.setState((state) => {
  const group = state.lineGroups[groupId]
  if (!group) return state

  return {
    lineGroups: {
      ...state.lineGroups,
      [groupId]: {
        ...(state.lineGroups[groupId]!),
        title: newTitle,
      },
    },
  }
})

export const deleteGroup = (groupId: string) => useLinesStore.setState((state) => {
  const group = state.lineGroups[groupId]
  if (!group) return state

  group.lineCodes.forEach(lineCode => deleteLineFromGroup(groupId, lineCode))
  delete state.lineGroups[groupId]

  return {
    lineGroups: {
      ...state.lineGroups,
    },
  }

  // // Check if line in the deleted group are in other groups
  // // If they are not in other groups delete their theme
  // // This will probably cause rerenders that are not really needed
  // for (const lineCode of group.lineCodes) {
  //   const inOtherGroup = state.lineGroups.find(group => group.lineCodes.includes(lineCode))
  //   if (state.lines.includes(lineCode) || inOtherGroup) {
  //     continue
  //   }

  //   delete state.lineTheme[lineCode]
  // }
})

export const deleteLineFromGroup = (groupId: string, lineCode: string) => useLinesStore.setState((state) => {
  const lineIndex = state.lineGroups[groupId]?.lineCodes.indexOf(lineCode)
  if (lineIndex === undefined || lineIndex === -1) return state

  state.lineGroups[groupId]!.lineCodes.splice(lineIndex, 1)
  deleteTheme(lineCode)

  return {
    lineGroups: {
      ...state.lineGroups,
      [groupId]: {
        ...state.lineGroups[groupId]!,
        lineCodes: [...(state.lineGroups[groupId]!.lineCodes || [])],
      },
    },
  }
})

export const selectGroup = (newGroupId?: string) => useLinesStore.setState(() => {
  return {
    selectedGroup: newGroupId,
  }
})

export const unSelectGroup = () => useLinesStore.setState(() => {
  return {
    selectedGroup: undefined,
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
  useLinesStore.subscribe(
    state => state.selectedGroup,
    (selectedGroup) => {
      clearTimeout(listener)

      const loop = () => {
        const groupLines = selectedGroup ? useLinesStore.getState().lineGroups[selectedGroup]?.lineCodes : []

        updateLines(groupLines || useLinesStore.getState().lines)
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
