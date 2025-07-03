import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { getAllRoutes } from '@/api/getAllRoutes'
import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'

export function useRoutes(lineCode: string) {
  const routeCode = useFiltersStore(useShallow(() => getSelectedRouteCode(lineCode)))

  const query = useQuery({
    queryKey: ['line-routes', lineCode],
    queryFn: () => getAllRoutes(lineCode),
    staleTime: 60_000 * 30,
    meta: { persist: true },
    enabled: !!lineCode, // lineCode varsa çalışsın
  })

  const getRouteFromCode = useCallback(() => {
    if (!query.data || !Array.isArray(query.data)) {
      console.warn('🚨 query.data is not an array:', query.data)
      return null
    }
    return query.data.find(item => item.route_code === routeCode) || null
  }, [query.data, routeCode])

  const getRouteDirection = useCallback(() => {
    return routeCode.split('_').at(1) || 'G'
  }, [routeCode])

  return {
    query,
    routeCode,
    getRouteFromCode,
    getRouteDirection,
  }
}
