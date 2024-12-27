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
  route_long_name?: string
  route_code: string
  city: string
}

export async function getPlannedDepartures(routeCode: string): Promise<Timetable> {
  return api(`/timetable/${routeCode}`)
}
