import { useCallback, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import MapView from 'react-native-maps'
import { useSharedValue } from 'react-native-reanimated'

import { LinesMomoizedFr } from '@/components/lines/Lines'
import { LineMarkers } from '@/components/markers/LineMarkers'
import { TheMap } from '@/components/TheMap'
import { TheMapButtons } from '@/components/TheMapButtons'
import { TheStopInfo } from '@/components/TheStopInfo'

import { MapContext } from '@/hooks/contexts/useMap'
import { SheetContext, sheetContextValues } from '@/hooks/contexts/useSheetModal'

import { useSettingsStore } from '@/stores/settings'

export const HomeScreen = () => {
  const map = useRef<MapView>(null)

  const sheetContext: sheetContextValues = {
    height: useSharedValue(0),
    index: useSharedValue(-1),
  }

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
        <SheetContext.Provider value={sheetContext}>
          <TheMap
            cRef={map}
            onMapReady={handleReady}
          >
            <LineMarkers />
          </TheMap>

          <TheMapButtons />

          <View style={styles.linesContainer}>
            <LinesMomoizedFr />
          </View>

          <TheStopInfo cRef={map} />
        </SheetContext.Provider>
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
