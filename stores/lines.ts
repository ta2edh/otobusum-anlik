import { create } from 'zustand'
import { subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware'
import { ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Theme } from '@material/material-color-utilities'

import { createTheme } from '@/utils/createTheme'
import { queryClient } from '@/api/client'

export interface LinesStore {
  lines: Record<string, string>
  lineTheme: Record<string, Theme>
  addLine: (lineCode: string) => void
  deleteLine: (lineCode: string) => void
}

export const useLines = create(
  subscribeWithSelector(
    persist<LinesStore>(
      (set, get) => ({
        lines: {},
        lineTheme: {},
        addLine: (lineCode) => {
          if (Object.keys(get().lines).length > 3) {
            ToastAndroid.show('Only 4 selections are allowed', ToastAndroid.SHORT)
            return
          }

          return set((state) => {
            const newColor = createTheme()
            return {
              lines: {
                ...state.lines,
                [lineCode]: lineCode,
              },
              lineTheme: {
                ...state.lineTheme,
                [lineCode]: newColor,
              },
            }
          })
        },
        deleteLine: lineCode =>
          set((state) => {
            delete state.lines[lineCode]
            delete state.lineTheme[lineCode]
            return { ...state }
          }),
      }),
      {
        name: 'line-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)

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
