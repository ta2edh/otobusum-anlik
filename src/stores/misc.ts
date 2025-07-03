import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

export interface MiscStore {
  scrolledLineIndex: number
  invisibleLines: string[]
  selectedStopId?: number
  minimizedLines: string[]
  expandedLines: string[]
  _hasHydrated: boolean
}

export const useMiscStore = create(
  subscribeWithSelector(
    persist<MiscStore>(
      () => ({
        scrolledLineIndex: 0,
        invisibleLines: [],
        selectedStopId: undefined,
        minimizedLines: [],
        expandedLines: [], // This will always start empty
        _hasHydrated: false,
      }),
      {
        name: 'misc-storage',
        storage: createJSONStorage(() => AsyncStorage),        partialize: (state) => ({
          // Don't persist expandedLines - always start collapsed
          scrolledLineIndex: state.scrolledLineIndex,
          invisibleLines: state.invisibleLines,
          selectedStopId: state.selectedStopId,
          minimizedLines: state.minimizedLines,
          expandedLines: [], // Always reset to empty
          _hasHydrated: state._hasHydrated,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state._hasHydrated = true
            // Always start with no expanded lines
            state.expandedLines = []
          }
        },
      },
    ),
  ),
)

export const toggleLineVisibility = (lineCode: string) => {
  useMiscStore.setState((state) => {
    const invisibleLines = [...state.invisibleLines]
    const index = invisibleLines.indexOf(lineCode)

    if (index === -1) {
      invisibleLines.push(lineCode)
    } else {
      invisibleLines.splice(index, 1)
    }

    return { invisibleLines }
  })
}

export const toggleLineMinimization = (lineCode: string) => {
  useMiscStore.setState((state) => {
    const minimizedLines = [...state.minimizedLines]
    const index = minimizedLines.indexOf(lineCode)

    if (index === -1) {
      minimizedLines.push(lineCode)
    } else {
      minimizedLines.splice(index, 1)
    }

    return { minimizedLines }
  })
}

export const setLineExpanded = (lineCode: string, expanded: boolean) => {
  useMiscStore.setState((state) => {
    const expandedLines = [...state.expandedLines]
    const index = expandedLines.indexOf(lineCode)

    if (expanded && index === -1) {
      expandedLines.push(lineCode)
    } else if (!expanded && index !== -1) {
      expandedLines.splice(index, 1)
    }

    return { expandedLines }
  })
}

export const collapseAllLines = () => {
  useMiscStore.setState(() => ({
    expandedLines: []
  }))
}
