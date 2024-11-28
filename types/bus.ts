import { Direction } from './departure'

export interface BusStop {
  stop_code: string
  stop_name: string
  x_coord: number
  y_coord: number
  province: string
  direction: Direction
  smart: string
  physical: string
  stop_type: string
  disabled_can_use: string
}

export interface BusLine {
  code: string
  title: string
}

export type BusLineStop = Omit<
  BusStop, 'disabled_can_use' | 'physical' | 'smart'
>
