import * as SplashScreen from 'expo-splash-screen'
import { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { LinesMomoizedFr } from '@/components/lines/Lines'
import { TheMap } from '@/components/map/Map'
import { LineMarkers } from '@/components/markers/LineMarkers'
import { TheMapButtons } from '@/components/TheMapButtons'
import { TheStopInfo } from '@/components/TheStopInfo'

import { MapContext } from '@/hooks/contexts/useMap'
import { SheetContext, sheetContextValues } from '@/hooks/contexts/useSheetModal'

import { useSettingsStore } from '@/stores/settings'

export const HomeScreen = () => {
  const sheetContext: sheetContextValues = {
    height: useSharedValue(0),
    index: useSharedValue(-1),
  }

  const handleOnMapReady = () => {
    SplashScreen.hideAsync()
  }

  const handleRegionChangeComplete = (region: any) => {
    useSettingsStore.setState(() => ({ initialMapLocation: region }))
  }

  return (
    <View style={styles.container}>
      {/* <MapContext.Provider value={map}> */}
      <SheetContext.Provider value={sheetContext}>
        <TheMap
          onMapReady={handleOnMapReady}
          onRegionChangeComplete={handleRegionChangeComplete}
          initialRegion={useSettingsStore.getState().initialMapLocation}
          moveOnMarkerPress={false}
        >
          {/* <LineMarkers /> */}
        </TheMap>

        <TheMapButtons />

        <View style={styles.linesContainer}>
          <LinesMomoizedFr />
        </View>

        {/* <TheStopInfo cRef={map} /> */}
      </SheetContext.Provider>
      {/* </MapContext.Provider> */}
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
