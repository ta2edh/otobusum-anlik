import { useMemo } from 'react'
import { View } from 'react-native'

import { LineBusMarkersMemoized } from './bus/BusMarkers'
import { RouteLine } from './RouteLine'
import { LineBusStopMarkersMemoized } from './stop/StopMarkers'
import { LineBusStopMarkersClusteredMemoized } from './stop/StopMarkersClustered'

import { useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { useSettingsStore } from '@/stores/settings'

export const LineMarkers = () => {
  const invisibleLines = useMiscStore(state => state.invisibleLines)
  const lineCodes = useLinesStore(state => state.lines)
  const clusterStops = useSettingsStore(state => state.clusterStops)

  const selectedGroup = useLinesStore(state => state.selectedGroup)
  const selectedGroupLines = useLinesStore(state => selectedGroup ? state.lineGroups[selectedGroup]?.lineCodes : undefined)

  const filteredCodes = useMemo(() => {
    const codes = selectedGroupLines || lineCodes
    return codes.filter(lineCode => !invisibleLines.includes(lineCode))
  }, [invisibleLines, lineCodes, selectedGroupLines])

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
