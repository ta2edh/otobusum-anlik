import { useMemo } from 'react'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { LineBusMarkersMemoized } from './bus/BusMarkers'
import { RouteLine } from './RouteLine'
import { LineBusStopMarkersMemoized } from './stop/StopMarkers'
import { LineBusStopMarkersClusteredMemoized } from './stop/StopMarkersClustered'

import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { useSettingsStore } from '@/stores/settings'

export const LineMarkers = () => {
  const invisibleLines = useMiscStore(state => state.invisibleLines)
  const clusterStops = useSettingsStore(state => state.clusterStops)
  const lines = useLinesStore(useShallow(() => getLines()))

  const filteredCodes = useMemo(() => {
    return lines.filter(lineCode => !invisibleLines.includes(lineCode))
  }, [invisibleLines, lines])

  return (
    <>
      {filteredCodes.map(lineCode => (
        <View key={lineCode}>
          <LineBusMarkersMemoized code={lineCode} />

          {
            clusterStops
              ? <LineBusStopMarkersClusteredMemoized lineCode={lineCode} />
              : <LineBusStopMarkersMemoized lineCode={lineCode} />
          }

          <RouteLine lineCode={lineCode} />
        </View>
      ))}
    </>
  )
}
