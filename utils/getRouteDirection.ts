import { Direction } from '@/types/departure'

export const getRouteDirection = (routeCode: string) => {
  return routeCode.split('_').at(1) as Direction | undefined
}
