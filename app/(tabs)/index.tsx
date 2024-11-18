import { View, StyleSheet, useColorScheme } from 'react-native'
import { mapDarkStyle } from '@/constants/mapStyles'
import { colors } from '@/constants/colors'

import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import MapView, { Details, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { TheFocusAwareStatusBar } from '@/components/TheFocusAwareStatusbar'
import { TheSearchSheet } from '@/components/TheSearchSheet'
import { LineMarkers } from '@/components/markers/LineMarkers'
import { TheFilters } from '@/components/TheFilters'

import { SplashScreen } from 'expo-router'
import { useCallback, useRef } from 'react'
import { useSettings } from '@/stores/settings'
import { MapContext } from '@/hooks/useMap'

export default function HomeScreen() {
  const map = useRef<MapView>(null)
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const animatedIndex = useSharedValue(0)

  const handleReady = useCallback(() => {
    map.current?.animateCamera({
      center: useSettings.getState().initialMapLocation,
      zoom: 13,
      heading: 0,
      pitch: 0,
    })
  }, [])

  const handleRegionChangeComplete = (region: Region, details: Details) => {
    if (!details.isGesture) return
    useSettings.setState(() => ({ initialMapLocation: { ...region } }))
  }

  const handleMapLoaded = () => {
    SplashScreen.hideAsync()
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(animatedIndex.value, [0, 1], [0, -300], 'clamp'),
        },
      ],
    }
  })

  return (
    <View style={styles.container}>
      <TheFocusAwareStatusBar />

      <Animated.View style={animatedStyle}>
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
          customMapStyle={colorScheme === 'dark' ? mapDarkStyle : undefined}
          showsTraffic={true}
          mapPadding={{ top: insets.top, bottom: 0, left: 0, right: 0 }}
          onRegionChangeComplete={handleRegionChangeComplete}
          onMapLoaded={handleMapLoaded}
          onMapReady={handleReady}
          showsIndoors={false}
        >
          <MapContext.Provider value={map}>
            <LineMarkers />
          </MapContext.Provider>
        </MapView>
      </Animated.View>

      <TheSearchSheet animatedIndex={animatedIndex}>
        <TheFilters animatedIndex={animatedIndex} />
      </TheSearchSheet>
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
  handle: {
    backgroundColor: colors.dark.surfaceContainerLow,
  },
  sheetBackground: {
    backgroundColor: colors.dark.surfaceContainerLow,
  },
})
