import { BusStop } from '@/types/bus'
import { api } from './api'

export interface BusStopWithBusLines extends BusStop {
  buses: string[]
}

export async function getBussesInStop(stopId: string | number): Promise<BusStopWithBusLines> {
  return api(`/stop/${stopId}`)
}
