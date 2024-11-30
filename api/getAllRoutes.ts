import { Direction } from '@/types/departure'

export interface LineRoute {
  _id: number
  route_id: string
  agency_id: string
  route_short_name: string
  route_long_name: string
  route_type: string
  route_desc: string
  route_code?: `${string}_${Direction}_${string}`
  rank: number
}

export interface GetAllRoutesResponse {
  result: {
    records: LineRoute[]
  }
}

export async function getAllRoutes(routeShortCode: string) {
  const response = await fetch(`https://data.ibb.gov.tr/api/3/action/datastore_search?q=${routeShortCode}&resource_id=46dbe388-c8c2-45c4-ac72-c06953de56a2`)
  const parsed: GetAllRoutesResponse = await response.json()

  return parsed
}
