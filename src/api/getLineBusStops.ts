import { api } from './api'

import { BusStop } from '@/types/bus'

export async function getLineBusStops(routeCode: string): Promise<BusStop[]> {
  const [lineCode, direction] = routeCode.split('_')
  return api(`/route-stops/${lineCode}`, {
    searchParams: {
      direction: direction || 'G',
    },
  })
}
