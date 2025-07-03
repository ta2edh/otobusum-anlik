import { useQuery } from '@tanstack/react-query'
import { useWindowDimensions } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { DEFAULT_PAGE_PADDING } from '../usePaddings'

import { getLineBusLocations } from '@/api/getLineBusLocations'
import { getLines, useLinesStore } from '@/stores/lines'

export function useLine(lineCode: string, enabled: boolean = true) {
  const { width } = useWindowDimensions()
  const lineCount = useLinesStore(useShallow(() => getLines().length))
  const lineWidth = width - (DEFAULT_PAGE_PADDING * 2) - (lineCount > 1 ? 8 : 0)

  const query = useQuery({
    queryKey: ['line', lineCode],
    queryFn: () => getLineBusLocations(lineCode),
    enabled: enabled && !!lineCode,
    staleTime: 30_000, // 30 seconds
    refetchInterval: enabled ? 30_000 : false, // Refetch every 30 seconds if enabled
    retry: 2,
    retryDelay: 1000,
    // Don't return cached data when disabled
    notifyOnChangeProps: ['data', 'error', 'isLoading', 'isError'],
  })

  return {
    query: {
      ...query,
      // Force data to be undefined when disabled
      data: enabled ? query.data : undefined,
    },
    lineWidth,
  }
}
