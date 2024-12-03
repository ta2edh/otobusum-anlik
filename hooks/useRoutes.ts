import { useQuery } from '@tanstack/react-query'

import { getAllRoutes } from '@/api/getAllRoutes'
import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'

export function useRoutes(lineCode: string) {
  const routeCode = useFiltersStore(() => getSelectedRouteCode(lineCode))

  const query = useQuery({
    queryKey: ['line-routes', lineCode],
    queryFn: () => getAllRoutes(lineCode),
    staleTime: 60_000 * 30,
  })

  const getRouteFromCode = () => {
    return query.data?.result.records.find(item => item.route_code === routeCode)
  }

  return {
    query,
    routeCode,
    getRouteFromCode,
  }
}
