import { useQuery } from '@tanstack/react-query'

import { useRoutes } from './useRoutes'

import { getPlannedDepartures } from '@/api/getPlannedDepartures'

export const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const

export const useTimetable = (lineCode: string) => {
  const { getRouteDirection } = useRoutes(lineCode)
  const direction = getRouteDirection()

  const query = useQuery({
    queryKey: [`timetable-${lineCode}`, direction],
    queryFn: () => getPlannedDepartures(lineCode, direction),
    staleTime: 60_000 * 30,
    meta: { persist: true },
  })

  return {
    query,
  }
}
