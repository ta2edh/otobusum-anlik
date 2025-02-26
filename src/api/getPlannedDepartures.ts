import { api } from './api'

export type Time = `${number}:${number}:${number}`

interface Days {
  sunday: Time[]
  monday: Time[]
  tuesday: Time[]
  wednesday: Time[]
  thursday: Time[]
  friday: Time[]
  saturday: Time[]
}

export interface Timetable extends Days {
  route_short_name?: string
}

export async function getPlannedDepartures(lineCode: string, routeDirection: string): Promise<Timetable> {
  return api(`/timetable/${lineCode}`, {
    searchParams: {
      direction: routeDirection,
    },
  })
}
