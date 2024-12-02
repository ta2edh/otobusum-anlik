import { BusLine, BusStop } from '@/types/bus'

export const isStop = (item: BusStop | BusLine): item is BusStop => {
  return (item as BusStop).stop_code !== undefined
}
