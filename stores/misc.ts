import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

export interface MiscStore {
  selectedLineScrollIndex: number
  invisibleLines: string[]
}

export const useMisc = create(
  subscribeWithSelector(
    persist<MiscStore>(
      () => ({
        selectedLineScrollIndex: 0,
        invisibleLines: [],
      }),
      {
        name: 'misc-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)

export const toggleLineVisibility = (lineCode: string) => useMisc.setState((state) => {
  const index = state.invisibleLines.indexOf(lineCode)

  if (index === -1) {
    return {
      invisibleLines: [...state.invisibleLines, lineCode],
    }
  }

  state.invisibleLines.splice(index, 1)
  return {
    invisibleLines: [...state.invisibleLines],
  }
})
