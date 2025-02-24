import { api } from './api'

import { BusStop } from '@/types/bus'

export interface BusStopDetails {
  buses: string[]
  stop: BusStop
}

export async function getStop(stopId: string | number): Promise<BusStopDetails> {
  return api(`/stop/${stopId}`)
}
