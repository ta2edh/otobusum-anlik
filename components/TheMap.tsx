import { getMapStyle } from '@/constants/mapStyles'
import { useSettings } from '@/stores/settings'
import { SplashScreen } from 'expo-router'
import { forwardRef } from 'react'
import { StyleSheet, useColorScheme } from 'react-native'
import MapView, { Details, MapViewProps, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

type Props = MapViewProps

export const TheMap = forwardRef<MapView, Props>(function TheMap(props, ref) {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const showMyLocation = useSettings(useShallow(state => state.showMyLocation))
  const showTraffic = useSettings(useShallow(state => state.showTraffic))

  const handleRegionChangeComplete = (region: Region, details: Details) => {
    if (!details.isGesture) return
    useSettings.setState(() => ({ initialMapLocation: { ...region } }))
  }

  const handleMapLoaded = () => {
    SplashScreen.hideAsync()
  }

  return (
    <MapView
      ref={ref}
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
      showsIndoors={false}
      toolbarEnabled={false}
      showsTraffic={showTraffic}
      showsUserLocation={showMyLocation}
    >
      {props.children}
    </MapView>
  )
})

const styles = StyleSheet.create({
  map: {
    height: '100%',
  },
})
