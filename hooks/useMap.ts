import { createContext, RefObject, useContext } from 'react'
import MapView from 'react-native-maps'

export const MapContext = createContext<RefObject<MapView> | null>(null)

export const useMap = () => {
  const context = useContext(MapContext)

  if (context === null || context.current === null) {
    throw 'Error getting map reference'
  }

  return context
}
