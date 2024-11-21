import { View, StyleSheet, useColorScheme, StyleProp, ViewStyle } from 'react-native'
import { getMapStyle } from '@/constants/mapStyles'

import MapView, { Details, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCallback, useMemo, useRef } from 'react'
import { SplashScreen } from 'expo-router'

import { TheFocusAwareStatusBar } from '@/components/TheFocusAwareStatusbar'
import { SelectedLines } from '@/components/lines/SelectedLines'
import { LineMarkers } from '@/components/markers/LineMarkers'

import { useSettings } from '@/stores/settings'
import { MapContext } from '@/hooks/useMap'
import { useShallow } from 'zustand/react/shallow'

export default function HomeScreen() {
  const map = useRef<MapView>(null)
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const showMyLocation = useSettings(useShallow(state => state.showMyLocation))
  const showTraffic = useSettings(useShallow(state => state.showTraffic))

  const handleReady = useCallback(() => {
    map.current?.animateCamera({
      center: useSettings.getState().initialMapLocation,
      zoom: 13,
      heading: 0,
      pitch: 0,
    })
  }, [])

  const selectedLineContainer: StyleProp<ViewStyle> = useMemo(
    () => ({
      position: 'absolute',
      bottom: 0,
    }),
    [],
  )

  const handleRegionChangeComplete = (region: Region, details: Details) => {
    if (!details.isGesture) return
    useSettings.setState(() => ({ initialMapLocation: { ...region } }))
  }

  const handleMapLoaded = () => {
    SplashScreen.hideAsync()
  }

  return (
    <View style={styles.container}>
      <TheFocusAwareStatusBar />

      <MapContext.Provider value={map}>
        <MapView
          ref={map}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialCamera={{
            center: { latitude: 41.0082, longitude: 28.9784 },
            heading: 0,
            pitch: 0,
            zoom: 13,
          }}
          customMapStyle={getMapStyle(colorScheme)}
          mapPadding={{ top: insets.top, bottom: 4, left: 4, right: 4 }}
          onRegionChangeComplete={handleRegionChangeComplete}
          onMapLoaded={handleMapLoaded}
          onMapReady={handleReady}
          showsIndoors={false}
          toolbarEnabled={false}
          showsTraffic={showTraffic}
          showsUserLocation={showMyLocation}
        >
          <LineMarkers />
        </MapView>

        <View style={selectedLineContainer}>
          <SelectedLines />
        </View>
      </MapContext.Provider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white',
  },
  map: {
    height: '100%',
  },
})
