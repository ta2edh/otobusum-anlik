import { SplashScreen } from 'expo-router'
import { ForwardedRef, forwardRef } from 'react'
import { StyleSheet } from 'react-native'
import MapView, { Details, MapViewProps, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import { useTheme } from '@/hooks/useTheme'

import { getMapStyle } from '@/constants/mapStyles'
import { useSettingsStore } from '@/stores/settings'

export const TheMap = ({ style, ...props }: MapViewProps, ref: ForwardedRef<MapView>) => {
  const { mode } = useTheme()
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

  return (
    <MapView
      ref={ref}
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
    </MapView>
  )
}

export const TheMapFr = forwardRef<MapView, MapViewProps>(TheMap)

const styles = StyleSheet.create({
  map: {
    flexGrow: 1,
    flexShrink: 0,
  },
})
