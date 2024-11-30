import { Direction } from '@/types/departure'

export const extractRouteCodeDirection = (routeCode: string) => {
  return routeCode?.split('_').at(1) as Direction | undefined
}
