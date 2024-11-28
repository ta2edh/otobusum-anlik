import { Direction } from '@/types/departure'

interface LinePolyline {
  route_code: string
  direction: Direction
  coordinates: { x: number, y: number }[]
}

export async function getLinePolyline(lineCode: string, direction: Direction) {
  const response = await fetch(`https://otobusum.metkm.win/route/${lineCode}/${direction}`)
  const parsed: LinePolyline = await response.json()

  return parsed
}
