import { RefObject, createContext, useContext } from 'react'
import MapView from 'react-native-maps'

export const MapContext = createContext<RefObject<MapView> | null>(null)

export const useMap = () => {
  const context = useContext(MapContext)

  return context
}
