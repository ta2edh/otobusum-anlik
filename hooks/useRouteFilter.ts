import { getAllRoutes } from '@/api/getAllRoutes'
import { useFilters } from '@/stores/filters'
import { useQuery } from '@tanstack/react-query'

export const getSelectedRouteCodeOrDefault = (lineCode: string) => {
  return useFilters.getState().selectedRoutes[lineCode] || `${lineCode}_G_D0`
}

export function useRouteFilter(lineCode: string) {
  const query = useQuery({
    queryKey: ['line-routes', lineCode],
    queryFn: () => getAllRoutes(lineCode),
    staleTime: 60_000 * 30,
  })

  const getCurrentOrDefaultRoute = () => {
    const routeCode = getSelectedRouteCodeOrDefault(lineCode)
    return query.data?.result.records.find(item => item.route_code === routeCode)
  }

  return {
    query,
    getCurrentOrDefaultRoute,
  }
}
