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

export const useLines = create(
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

// Line stuff
export const deleteLine = (lineCode: string) => useLines.setState((state) => {
  // delete state.lineTheme[lineCode]

  const selectedGroup = useLines.getState().selectedGroup
  if (selectedGroup) {
    deleteLineFromGroup(selectedGroup, lineCode)

    const groupLinecodes = Object.values(state.lineGroups).map(group => group.lineCodes).flat()
    if (!groupLinecodes.includes(lineCode)) {
      delete state.lineTheme[lineCode]
    }

    return state
  }

  const index = state.lines.indexOf(lineCode)
  if (index !== -1) {
    state.lines.splice(index, 1)
  }

  const groupLinecodes = Object.values(state.lineGroups).map(group => group.lineCodes).flat()
  if (!groupLinecodes.includes(lineCode)) {
    delete state.lineTheme[lineCode]
  }

  return {
    lines: [...state.lines],
    lineTheme: {
      ...state.lineTheme,
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
// Line stuff end

// Theme stuff
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
// Theme stuff end

// Group stuff
export const createNewGroup = () => useLines.setState((state) => {
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

export const addLineToGroup = (groupId: string, lineCode: string) => useLines.setState((state) => {
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

export const updateGroupTitle = (groupId: string, newTitle: string) => useLines.setState((state) => {
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

export const deleteGroup = (groupId: string) => useLines.setState((state) => {
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

export const deleteLineFromGroup = (groupId: string, lineCode: string) => useLines.setState((state) => {
  const lineIndex = state.lineGroups[groupId]?.lineCodes.indexOf(lineCode)
  if (lineIndex === undefined || lineIndex === -1) return state

  return {
    lineGroups: {
      ...state.lineGroups,
      [groupId]: {
        ...state.lineGroups[groupId]!,
        lineCodes: state.lineGroups[groupId]!.lineCodes.splice(lineIndex, 1),
      },
    },
  }
})

export const selectGroup = (newGroupId?: string) => useLines.setState(() => {
  return {
    selectedGroup: newGroupId,
  }
})

export const unSelectGroup = () => useLines.setState(() => {
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
  useLines.subscribe(
    state => state.selectedGroup,
    (selectedGroup) => {
      clearTimeout(listener)

      const loop = () => {
        const groupLines = selectedGroup ? useLines.getState().lineGroups[selectedGroup]?.lineCodes : []

        updateLines(groupLines || useLines.getState().lines)
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
