import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

import { queryClient } from '@/api/client'
import { GetAllRoutesResponse } from '@/api/getAllRoutes'
import { Direction } from '@/types/departure'

export interface FiltersStore {
  selectedRoutes: Record<string, string>
}

export const useFilters = create(
  subscribeWithSelector(
    persist<FiltersStore>(
      () => ({
        selectedRoutes: {},
      }),
      {
        name: 'filter-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)

export const selectRoute = (lineCode: string, routeCode: string) => useFilters.setState((state) => {
  return {
    selectedRoutes: {
      ...state.selectedRoutes,
      [lineCode]: routeCode,
    },
  }
})

export const getRoute = (lineCode: string) => useFilters.getState().selectedRoutes[lineCode] || `${lineCode}_G_D0`

export const changeRouteDirection = (lineCode: string) => useFilters.setState((state) => {
  const routeCode = getRoute(lineCode)

  const [left, dir, right] = routeCode.split('_')
  if (!right || !dir) return state

  const allRoutes = queryClient.getQueryData<GetAllRoutesResponse>(['line-routes', lineCode])
  if (!allRoutes) return state

  const dCode = parseInt(right.substring(1))

  const direction = dir as Direction
  const otherDirection = direction === 'D' ? 'G' : 'D'

  const oneLess = `${left}_${otherDirection}_D${dCode - 1}`
  const equal = `${left}_${otherDirection}_D${dCode}`
  const oneMore = `${left}_${otherDirection}_D${dCode + 1}`

  const otherRoute = allRoutes.result.records.find(
    route => route.route_code === oneLess || route.route_code === oneMore || route.route_code === equal,
  )

  if (!otherRoute) return state

  return {
    selectedRoutes: {
      ...state.selectedRoutes,
      [lineCode]: otherRoute.route_code || `${lineCode}_G_D0`,
    },
  }
})

// export const selectGroup = (newGroupId?: string) => useFilters.setState(() => {
//   return {
//     selectedGroup: newGroupId,
//   }
// })

// export const unSelectGroup = () => useFilters.setState(() => {
//   return {
//     selectedGroup: undefined,
//   }
// })
