export async function getBussesInStop(stopId: string | number) {
  const response = await fetch(`https://otobusum.metkm.win/busses-in-stop/${stopId}`)
  const parsed: string[] = await response.json()

  return parsed
}
