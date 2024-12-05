import { api } from './api'

import { Direction } from '@/types/departure'

export interface LineRoute {
  id: number
  agency_id: string
  route_short_name: string
  route_long_name: string
  route_type: string
  route_desc: string
  route_code?: `${string}_${Direction}_${string}`
}

export async function getAllRoutes(lineCode: string) {
  return await api<LineRoute[]>(`/routes/${lineCode}`)
}
