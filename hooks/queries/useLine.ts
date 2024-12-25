import { useQuery } from '@tanstack/react-query'
import { useWindowDimensions } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { extraPadding } from '../usePaddings'

import { getLineBusLocations } from '@/api/getLineBusLocations'
import { useFiltersStore } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'

export function useLine(lineCode: string) {
  const { width } = useWindowDimensions()
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))

  const lineCount = useLinesStore(useShallow(state => Object.keys(state.lines[selectedCity]).length))
  const lineWidth = width - extraPadding - extraPadding - (lineCount > 1 ? 24 : 0)

  const query = useQuery({
    queryKey: ['line', lineCode],
    queryFn: () => getLineBusLocations(lineCode),
    staleTime: 60_000 * 30,
  })

  return {
    query,
    lineWidth,
  }
}
