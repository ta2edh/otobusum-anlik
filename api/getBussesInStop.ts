export interface BusStopWithBusLines {
  // hatkodu: string
  // siraNo: string
  durakkodu: string
  durakadi: string
  xkoordinati: number
  ykoordinati: number
  duraktipi: string
  isletmebolge: string
  isletmealtbolge: string
  ilceadi: string
  buses: string[]
}

export async function getBussesInStop(stopId: string | number) {
  const response = await fetch(`https://otobusum.metkm.win/stop/${stopId}`)
  const parsed: BusStopWithBusLines = await response.json()

  return parsed
}
