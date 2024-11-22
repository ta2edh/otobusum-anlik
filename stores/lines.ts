import { create } from 'zustand'
import { subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware'
import { ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Theme } from '@material/material-color-utilities'
import { createTheme } from '@/utils/createTheme'
import { queryClient } from '@/api/client'
import { deleteLineFromGroup, useFilters } from './filters'

export interface LinesStore {
  lines: Record<string, string>
  lineTheme: Record<string, Theme>
}

export const useLines = create(
  subscribeWithSelector(
    persist<LinesStore>(
      () => ({
        lines: {},
        lineTheme: {},
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

export const addLine = (lineCode: string) => useLines.setState((state) => {
  if (Object.keys(state.lines).length > 3) {
    ToastAndroid.show('Only 4 selections are allowed', ToastAndroid.SHORT)
    return state
  }

  return {
    lineTheme: {
      ...state.lineTheme,
      [lineCode]: createTheme(),
    },
    lines: {
      [lineCode]: lineCode,
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
