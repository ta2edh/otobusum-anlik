import { BusStop } from '@/types/bus'
import { api } from './api'

export interface BusStopDetails {
  buses: string[]
  stop: BusStop
}

export async function getStop(stopId: string | number): Promise<BusStopDetails> {
  return api(`/stop/${stopId}`)
}
