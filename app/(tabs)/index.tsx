import { useCallback, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import MapView from 'react-native-maps'

import { LinesMomoizedFr } from '@/components/lines/Lines'
import { LineMarkers } from '@/components/markers/LineMarkers'
import { TheMapFr } from '@/components/TheMap'
import { TheMapButtons } from '@/components/TheMapButtons'
import { TheStopInfo } from '@/components/TheStopInfo'

import { MapContext } from '@/hooks/useMap'

import { useSettingsStore } from '@/stores/settings'

export const HomeScreen = () => {
  const map = useRef<MapView>(null)

  const handleReady = useCallback(() => {
    map.current?.animateCamera({
      center: useSettingsStore.getState().initialMapLocation,
      zoom: 13,
      heading: 0,
      pitch: 0,
    })
  }, [])

  return (
    <View style={styles.container}>
      <MapContext.Provider value={map}>
        <TheMapFr ref={map} onMapReady={handleReady}>
          <LineMarkers />
        </TheMapFr>

        <TheMapButtons />

        <View style={styles.linesContainer}>
          <LinesMomoizedFr />
        </View>

        {/* {stopId && ( */}
        <TheStopInfo />
        {/* )} */}
      </MapContext.Provider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linesContainer: {
    position: 'absolute',
    bottom: 0,
  },
})

export default HomeScreen
