import { TheMapRef } from '@/components/map/Map'
import { RefObject, createContext, useContext } from 'react'

export const MapContext = createContext<RefObject<TheMapRef> | null>(null)

export const useMap = () => {
  const context = useContext(MapContext)

  return context
}
