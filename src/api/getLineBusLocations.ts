import { api } from './api'

export interface BusLocation {
  bus_id: string
  lng: number
  lat: number
  route_code: string
  closest_stop_code?: number
}

export async function getLineBusLocations(lineCode: string): Promise<BusLocation[]> {
  return api(`/bus-locations/${lineCode}`)
}
