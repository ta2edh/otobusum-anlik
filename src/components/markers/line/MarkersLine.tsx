import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { MarkersBuses } from '../buses/MarkersBuses'
import { MarkersStop } from '../stop/MarkersStop'
import { MarkersStopClusteredMemoized } from '../stop/MarkersStopClustered'

import { MarkersLineRouteLine } from './MarkersLineRouteLine'

import { useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { useSettingsStore } from '@/stores/settings'

export const MarkersLine = () => {
  const invisibleLines = useMiscStore(state => state.invisibleLines)
  const clusterStops = useSettingsStore(useShallow(state => state.clusterStops))

  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))
  const selectedGroup = useFiltersStore(useShallow(state => state.selectedGroup))
  const lineGroups = useLinesStore(useShallow(state => state.lineGroups))

  // Direct subscription to lines - more reliable  
  const allLines = useLinesStore(useShallow(state => state.lines[selectedCity]))
  const lines = selectedGroup 
    ? (lineGroups[selectedCity][selectedGroup]?.lineCodes || [])
    : allLines
  
  const filteredCodes = lines.filter(lineCode => !invisibleLines.includes(lineCode))

  console.log('MarkersLine - selectedCity:', selectedCity)
  console.log('MarkersLine - selectedGroup:', selectedGroup)
  console.log('MarkersLine - allLines:', allLines)
  console.log('MarkersLine - final lines:', lines)
  console.log('MarkersLine - filteredCodes:', filteredCodes)
  console.log('MarkersLine - invisibleLines:', invisibleLines)

  return (
    <>
      {filteredCodes.map(lineCode => {
        console.log('MarkersLine - Rendering components for line:', lineCode)
        return (
          <View key={`${selectedCity}-${selectedGroup || 'no-group'}-${lineCode}`}>
            <MarkersLineRouteLine lineCode={lineCode} />

            {
              clusterStops
                ? <MarkersStopClusteredMemoized lineCode={lineCode} />
                : <MarkersStop lineCode={lineCode} />
            }

            <MarkersBuses code={lineCode} />
          </View>
        )
      })}
    </>
  )
}
