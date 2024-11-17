import { create } from 'zustand'
import { subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware'
import { getLineBusLocations, Location } from '@/api/getLineBusLocations'
import { createTheme } from '@/utils/createTheme'
import { ToastAndroid } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFilters } from './filters'
import { SearchResult } from '@/api/getSearchResults'
import { Theme } from '@material/material-color-utilities'

export interface LinesStore {
  lines: Record<string, Location[]>
  lineTheme: Record<string, Theme>
  addLine: (code: SearchResult) => Promise<void>
  deleteLine: (code: string) => void
  updateLine: (code: string, newLine: Location[]) => void
}

export const useLines = create(
  subscribeWithSelector(
    persist<LinesStore>(
      (set, get) => ({
        lines: {},
        lineTheme: {},
        addLine: async (searchResult) => {
          if (Object.keys(get().lines).length > 3) {
            ToastAndroid.show('Only 4 selections are allowed', ToastAndroid.SHORT)
            return
          }

          const response = await getLineBusLocations(searchResult.Code)
          if (!response) return

          // Route codes that ends with D0 It's the default. Find if there is a bus with route code ends with D0
          useFilters.setState(state => ({
            selectedRoutes: {
              ...state.selectedRoutes,
              [searchResult.Code]: `${searchResult.Code}_G_D0`,
            },
          }))

          return set((state) => {
            const newColor = createTheme()

            return {
              lines: {
                ...state.lines,
                [searchResult.Code]: response,
              },
              lineTheme: {
                ...state.lineTheme,
                [searchResult.Code]: newColor,
              },
            }
          })
        },
        deleteLine: code =>
          set((state) => {
            delete state.lines[code]
            delete state.lineTheme[code]

            return {
              lines: {
                ...state.lines,
              },
              lineTheme: {
                ...state.lineTheme,
              },
            }
          }),
        updateLine: (code, newLocations) =>
          set((state) => {
            return {
              lines: {
                ...state.lines,
                [code]: newLocations,
              },
            }
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
  const results = await Promise.all(keys.map(k => getLineBusLocations(k)))

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    const result = results[index]

    if (result && key) {
      useLines.getState().updateLine(key, result)
    }
  }

  setTimeout(updateLines, 50_000)
}

// if (!__DEV__) {
useLines.persist.onFinishHydration(updateLines)
// }
