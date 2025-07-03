import { SplashScreen } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Region } from 'react-native-maps'
import { useSharedValue } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'
import * as Location from 'expo-location'

import { Lines } from '@/components/lines/Lines'
import { TheMap, TheMapRef } from '@/components/map/Map'
import { MarkersRenderer } from '@/components/markers/MarkersRenderer'
import { TheSearchBar } from '@/components/TheSearchBar'
import { TheStopInfo } from '@/components/TheStopInfo'

import { MapContext } from '@/hooks/contexts/useMap'
import { SheetContext, sheetContextValues } from '@/hooks/contexts/useSheetModal'

import { queryClient } from '@/api/client'
import { getLineBusStops } from '@/api/getLineBusStops'
import { getCityRegion, isUserInCity } from '@/constants/cities'
import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'
import { debugLog } from '@/utils/debugLogger'
import { useMiscStore } from '@/stores/misc'
import { useSettingsStore } from '@/stores/settings'

export const HomeScreen = () => {
  const map = useRef<TheMapRef | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [initialRegion, setInitialRegion] = useState<Region | null>(null)

  const settingsStoreState = useSettingsStore.getState()
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))
  const lines = useLinesStore(useShallow(state => state.lines[selectedCity]))
  const linesHydrated = useLinesStore(state => state._hasHydrated)
  const miscHydrated = useMiscStore((state: any) => state._hasHydrated)
  
  // Ready to render when map is ready and both stores are hydrated
  const readyToRender = isMapReady && linesHydrated && miscHydrated

  // Akıllı başlangıç konumu belirleme
  useEffect(() => {
    const determineInitialRegion = async () => {
      console.log('🗺️ Determining initial region...')
      console.log('🏙️ Selected city:', selectedCity)
      console.log('📍 Show my location:', showMyLocation)
      
      // Kullanıcının gerçek konumunu kontrol et
      if (showMyLocation) {
        try {
          console.log('📍 Requesting location permission...')
          const { status } = await Location.requestForegroundPermissionsAsync()
          
          if (status === 'granted') {
            console.log('✅ Location permission granted, getting current position...')
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            })
            
            const userLat = location.coords.latitude
            const userLng = location.coords.longitude
            
            console.log('📍 User location received:', { lat: userLat, lng: userLng })
            
            // Kullanıcı seçili şehrin içinde mi kontrol et
            const isInSelectedCity = isUserInCity(userLat, userLng, selectedCity)
            console.log(`🏙️ Is user in ${selectedCity}?`, isInSelectedCity)
            
            if (isInSelectedCity) {
              console.log(`✅ User is in ${selectedCity}, starting at user location`)
              setInitialRegion({
                latitude: userLat,
                longitude: userLng,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
              })
              return
            } else {
              console.log(`❌ User is not in ${selectedCity}, will use city center`)
            }
          } else {
            console.log('❌ Location permission denied')
          }
        } catch (error) {
          console.log('🚨 Could not get user location:', error)
        }
      } else {
        console.log('📍 Location disabled by user')
      }
      
      // Varsayılan olarak şehir merkezini kullan
      const cityRegion = getCityRegion(selectedCity)
      console.log(`🏙️ Using ${selectedCity} city center:`, cityRegion)
      setInitialRegion(cityRegion)
    }

    // Sadece initialRegion henüz belirlenmemişse çalıştır
    if (!initialRegion) {
      determineInitialRegion()
    }
  }, [])

  // Handle map ready event
  const handleMapReady = useCallback(() => {
    debugLog('🗺️ Map is ready!')
    setIsMapReady(true)
    // Ana layout splash screen'i kontrol ediyor, burada çağırmıyoruz
  }, [])

  // Handle line addition and auto-fit map
  useEffect(() => {
    const unsub = useLinesStore.subscribe(
      state => state.lines,
      async (state, prevState) => {
        const city = useFiltersStore.getState().selectedCity
        const newStateCity = state[city]
        const oldStateCity = prevState[city]
        if (newStateCity.length < oldStateCity.length) return

        const newCode = newStateCity.at(-1)
        if (!newCode) return

        const routeCode = getSelectedRouteCode(newCode)
        const queryKey = [`stop-locations`, routeCode]

        const busStops = await queryClient.ensureQueryData<
          Awaited<ReturnType<typeof getLineBusStops>>
        >({
          queryKey,
          queryFn: () => getLineBusStops(routeCode),
        })

        map.current?.fitInsideCoordinates(
          busStops?.map(stop => ({
            longitude: stop.x_coord,
            latitude: stop.y_coord,
          })),
        )
      },
    )

    return unsub
  }, [])

  // Şehir değiştiğinde haritayı o şehre ışınla
  useEffect(() => {
    if (isMapReady && map.current) {
      console.log(`🏙️ City changed to ${selectedCity}, animating to city center`)
      const cityRegion = getCityRegion(selectedCity)
      map.current.animateCamera(cityRegion)
    }
  }, [selectedCity, isMapReady])

  const sheetContext: sheetContextValues = {
    height: useSharedValue(0),
    index: useSharedValue(-1),
  }

  const handleRegionChangeComplete = (region: Region) => {
    useSettingsStore.setState(() => ({ initialMapLocation: region }))
  }

  // Initial region belirleme fonksiyonu - artık kullanılmıyor
  const getInitialRegion = (): Region => {
    // initialRegion state'i kullanılıyor
    return initialRegion || getCityRegion(selectedCity)
  }

  return (
    <MapContext value={map}>
      <SheetContext.Provider value={sheetContext}>
        {/* Sadece initialRegion hazır olduğunda haritayı render et */}
        {initialRegion && (
          <TheMap
            ref={map}
            onMapReady={handleMapReady}
            onMapRegionUpdate={handleRegionChangeComplete}
            initialRegion={initialRegion}
          >
            {/* Render markers when ready */}
            <MarkersRenderer readyToRender={readyToRender} />
          </TheMap>
        )}

        <TheSearchBar />

        <View style={styles.linesContainer}>
          <Lines />
        </View>

        <TheStopInfo ref={map} />
      </SheetContext.Provider>
    </MapContext>
  )
}

const styles = StyleSheet.create({
  linesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
})

export default HomeScreen
