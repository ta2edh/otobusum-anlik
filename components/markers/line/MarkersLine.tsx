import { Platform, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { MarkersBusesMemoized } from '../buses/MarkersBuses'
import { LineBusStopMarkersMemoized } from '../stop/MarkersStop'
import { LineBusStopMarkersClusteredMemoized } from '../stop/MarkersStopClustered'

import { MarkersLinePolyline } from './polyline/MarkersLinePolyline'

import { useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { useSettingsStore } from '@/stores/settings'

export const MarkersLine = () => {
  const invisibleLines = useMiscStore(state => state.invisibleLines)
  const clusterStops = useSettingsStore(useShallow(state => state.clusterStops))

  useFiltersStore(useShallow(state => state.selectedCity))
  useFiltersStore(useShallow(state => state.selectedGroup))

  const lines = useLinesStore(() => getLines())
  const filteredCodes = lines.filter(lineCode => !invisibleLines.includes(lineCode))

  return (
    <>
      {filteredCodes.map(lineCode => (
        <View key={lineCode}>
          <MarkersLinePolyline lineCode={lineCode} />

          {
            clusterStops && Platform.OS !== 'web'
              ? <LineBusStopMarkersClusteredMemoized lineCode={lineCode} />
              : <LineBusStopMarkersMemoized lineCode={lineCode} />
          }

          <MarkersBusesMemoized code={lineCode} />
        </View>
      ))}
    </>
  )
}
