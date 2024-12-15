import { useMemo } from 'react'
import { View } from 'react-native'

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
  const lines = useLinesStore(() => getLines())

  const filteredCodes = useMemo(() => {
    return lines.filter(lineCode => !invisibleLines.includes(lineCode))
  }, [invisibleLines, lines])

  return (
    <>
      {filteredCodes.map(code => (
        <View key={code}>
          <LineBusMarkersMemoized code={code} />

          {
            clusterStops
              ? <LineBusStopMarkersClusteredMemoized code={code} />
              : <LineBusStopMarkersMemoized code={code} />
          }

          <RouteLine code={code} />
        </View>
      ))}
    </>
  )
}
