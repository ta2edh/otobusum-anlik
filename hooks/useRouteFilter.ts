import { getAllRoutes } from '@/api/getAllRoutes'
import { useFilters } from '@/stores/filters'
import { Direction } from '@/types/departure'
import { useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

export function useRouteFilter(code: string) {
  const selectedRouteCode = useFilters(useShallow(state => state.selectedRoutes[code]))

  const query = useQuery({
    queryKey: ['line-routes', code],
    queryFn: () => getAllRoutes(code),
    staleTime: 60_000 * 30,
  })

  const getCurrentOrDefaultRoute = () => {
    const routeCode = getCurrentOrDefaultRouteCode()
    return query.data?.result.records.find(item => item.route_code === routeCode)
  }

  const getCurrentOrDefaultRouteCode = () => {
    return selectedRouteCode || `${code}_G_D0`
  }

  const getRouteDirection = (routeCode?: string) => {
    return routeCode?.split('_').at(1) as Direction | undefined
  }

  const findOtherRouteDirection = (routeCode: string) => {
    const [left, dir, right] = routeCode.split('_')
    if (!right || !dir) return

    const dCode = parseInt(right.substring(1))

    const direction = dir as Direction
    const otherDirection = direction === 'D' ? 'G' : 'D'

    const oneLess = `${left}_${otherDirection}_D${dCode - 1}`
    const equal = `${left}_${otherDirection}_D${dCode}`
    const oneMore = `${left}_${otherDirection}_D${dCode + 1}`

    return query.data?.result.records.find(
      route => route.route_code === oneLess || route.route_code === oneMore || route.route_code === equal,
    )
  }

  return {
    query,
    getCurrentOrDefaultRoute,
    getRouteDirection,
    getCurrentOrDefaultRouteCode,
    findOtherRouteDirection,
  }
}
