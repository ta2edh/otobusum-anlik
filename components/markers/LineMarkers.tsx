import { View } from 'react-native'

import { LineBusMarkersMemoized } from './BusMarkers'
import { LineBusStopMarkersClusteredMemoized, LineBusStopMarkersMemoized } from './BusStopMarkers'

import { useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { useSettingsStore } from '@/stores/settings'

export const LineMarkers = () => {
  const invisibleLines = useMiscStore(state => state.invisibleLines)
  const lineCodes = useLinesStore(state => state.lines)
  const clusterStops = useSettingsStore(state => state.clusterStops)

  const selectedGroup = useLinesStore(state => state.selectedGroup)
  const selectedGroupLines = useLinesStore(state => selectedGroup ? state.lineGroups[selectedGroup]?.lineCodes : undefined)

  const codes = selectedGroupLines || lineCodes
  const filteredCodes = codes.filter(lineCode => !invisibleLines.includes(lineCode))

  return (
    <>
      {filteredCodes.map(code => (
        <View key={code}>
          <LineBusMarkersMemoized code={code} />
          {clusterStops
            ? <LineBusStopMarkersClusteredMemoized code={code} />
            : <LineBusStopMarkersMemoized code={code} />}
        </View>
      ))}
    </>
  )
}
