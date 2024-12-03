import { View } from 'react-native'

import { LineBusMarkersMemoized } from './BusMarkers'
import { LineBusStopMarkersMemoized } from './BusStopMarkers'

import { useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'

export const LineMarkers = () => {
  const invisibleLines = useMiscStore(state => state.invisibleLines)
  const lineCodes = useLinesStore(state => state.lines)

  const selectedGroup = useLinesStore(state => state.selectedGroup)
  const selectedGroupLines = useLinesStore(state => selectedGroup ? state.lineGroups[selectedGroup]?.lineCodes : undefined)

  const codes = selectedGroupLines || lineCodes
  const filteredCodes = codes.filter(lineCode => !invisibleLines.includes(lineCode))

  return (
    <>
      {filteredCodes.map(code => (
        <View key={code}>
          <LineBusMarkersMemoized code={code} />
          <LineBusStopMarkersMemoized code={code} />
        </View>
      ))}
    </>
  )
}
