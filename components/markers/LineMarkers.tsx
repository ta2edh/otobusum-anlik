import { View } from 'react-native'

import { LineBusMarkers } from './BusMarkers'
import { LineBusStopMarkers } from './BusStopMarkers'

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
          <LineBusMarkers code={code} />
          <LineBusStopMarkers code={code} />
        </View>
      ))}
    </>
  )
}
