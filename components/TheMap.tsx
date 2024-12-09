import { SplashScreen } from 'expo-router'
import { RefObject } from 'react'
import { StyleSheet } from 'react-native'
import MapView, { Details, MapViewProps, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { AnimatedMapView } from 'react-native-maps/lib/MapView'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import { useSheetModal } from '@/hooks/contexts/useSheetModal'
import { useTheme } from '@/hooks/useTheme'

import { getMapStyle } from '@/constants/mapStyles'
import { useSettingsStore } from '@/stores/settings'

interface TheMapProps extends MapViewProps {
  cRef?: RefObject<MapView>
}

export const TheMap = ({ style, cRef, ...props }: TheMapProps) => {
  const { mode } = useTheme()
  const sheetContext = useSheetModal()

  const insets = useSafeAreaInsets()
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))
  const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))

  const handleRegionChangeComplete = (region: Region, details: Details) => {
    if (!details.isGesture) return
    useSettingsStore.setState(() => ({ initialMapLocation: { ...region } }))
  }

  const handleMapLoaded = () => {
    SplashScreen.hideAsync()
  }

  const animatedStyle = useAnimatedStyle(() => {
    if (!sheetContext) {
      return {
        flex: 1,
      }
    }

    return {
      flex: 1,
      transform: [
        {
          translateY: interpolate(
            sheetContext?.index.value!,
            [-1, 0],
            [0, -150],
            'clamp',
          ),
        },
      ],
    }
  })

  return (
    <Animated.View style={animatedStyle}>
      <AnimatedMapView
        ref={cRef}
        style={[styles.map, style]}
        provider={PROVIDER_GOOGLE}
        initialCamera={{
          center: { latitude: 41.0082, longitude: 28.9784 },
          heading: 0,
          pitch: 0,
          zoom: 13,
        }}
        customMapStyle={getMapStyle(mode)}
        mapPadding={{ top: insets.top, bottom: 10, left: 10, right: 10 }}
        onRegionChangeComplete={handleRegionChangeComplete}
        onMapLoaded={handleMapLoaded}
        showsIndoors={false}
        toolbarEnabled={false}
        showsTraffic={showTraffic}
        showsUserLocation={showMyLocation}
        {...props}
      >
        {props.children}
      </AnimatedMapView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  map: {
    flexGrow: 1,
    flexShrink: 0,
  },
})
