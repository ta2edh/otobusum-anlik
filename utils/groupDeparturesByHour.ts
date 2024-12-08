import { PlannedDeparture } from '@/api/getPlannedDepartures'

export const groupDeparturesByHour = (obj: PlannedDeparture[]) => {
  const res: Record<string, PlannedDeparture[]> = {}

  for (let index = 0; index < obj.length; index++) {
    const element = obj[index]
    const hour = element?.['DT'].split(':').at(0)

    if (!hour || !element) continue

    if (!res[hour]) {
      res[hour] = [element]
    } else {
      res[hour].push(element)
    }
  }

  return res
}
