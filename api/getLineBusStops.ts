import { BusStop } from '@/types/bus'

export async function getLineBusStops(routeCode: string) {
  const response = await fetch(`https://otobusum.metkm.win/route-stops/${routeCode}`)
  const parsed: BusStop[] = await response.json()
  return parsed
}
