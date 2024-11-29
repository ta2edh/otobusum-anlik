import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import MapView from 'react-native-maps'
import { useCallback, useRef } from 'react'

import { SelectedLines } from '@/components/lines/SelectedLines'
import { LineMarkers } from '@/components/markers/LineMarkers'
import { TheMap } from '@/components/TheMap'

import { useSettings } from '@/stores/settings'
import { MapContext } from '@/hooks/useMap'

export default function HomeScreen() {
  const map = useRef<MapView>(null)

  const handleReady = useCallback(() => {
    map.current?.animateCamera({
      center: useSettings.getState().initialMapLocation,
      zoom: 13,
      heading: 0,
      pitch: 0,
    })
  }, [])

  const selectedLineContainer: StyleProp<ViewStyle> = {
    position: 'absolute',
    bottom: 0,
  }

  return (
    <View style={styles.container}>
      <MapContext.Provider value={map}>
        <TheMap ref={map} onMapReady={handleReady}>
          <LineMarkers />
        </TheMap>

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
  },
})
