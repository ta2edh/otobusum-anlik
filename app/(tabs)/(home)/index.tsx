import { useCallback, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import MapView from 'react-native-maps'

import { SelectedLines } from '@/components/lines/SelectedLines'
import { LineMarkers } from '@/components/markers/LineMarkers'
import { TheMap } from '@/components/TheMap'
import { TheMapButtons } from '@/components/TheMapButtons'

import { MapContext } from '@/hooks/useMap'

import { useSettings } from '@/stores/settings'

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

        <TheMapButtons />

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
