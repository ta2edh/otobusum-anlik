import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { LatLng } from 'react-native-maps'

// API'den gelen durak data tipi
interface StopData {
  id: number
  stop_code: number
  stop_name: string
  x_coord: number
  y_coord: number
  province?: string
  smart?: string
  physical?: string
  stop_type?: string
  disabled_can_use?: string
  coordinates: LatLng
}

interface StopCacheStore {
  // lineCode -> stops mapping
  stopsCache: Record<string, StopData[]>
  
  // Actions
  cacheStops: (lineCode: string, stops: StopData[]) => void
  clearStopsCache: (lineCode: string) => void
  getStops: (lineCode: string) => StopData[]
  hasStops: (lineCode: string) => boolean
}

export const useStopCacheStore = create(
  subscribeWithSelector<StopCacheStore>((set, get) => ({
    stopsCache: {},
    
    cacheStops: (lineCode: string, stops: StopData[]) => {
      console.log(`🗃️ Caching ${stops.length} stops for line ${lineCode}`)
      set((state) => ({
        stopsCache: {
          ...state.stopsCache,
          [lineCode]: stops,
        },
      }))
    },
    
    clearStopsCache: (lineCode: string) => {
      console.log(`🗑️ Clearing stops cache for line ${lineCode}`)
      set((state) => {
        const newCache = { ...state.stopsCache }
        delete newCache[lineCode]
        return { stopsCache: newCache }
      })
    },
    
    getStops: (lineCode: string) => {
      const stops = get().stopsCache[lineCode] || []
      console.log(`📦 Retrieved ${stops.length} cached stops for line ${lineCode}`)
      return stops
    },
    
    hasStops: (lineCode: string) => {
      const has = !!get().stopsCache[lineCode]
      console.log(`❓ Cache has stops for ${lineCode}: ${has}`)
      return has
    },
  }))
)

export type { StopData }
