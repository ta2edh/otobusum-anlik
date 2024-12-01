import { View } from 'react-native'

import { LineBusMarkers } from './LineBusMarkers'
import { LineBusStopMarkers } from './LineBusStopMarkers'

import { useFilters } from '@/stores/filters'
import { useLines } from '@/stores/lines'

export function LineMarkers() {
  const invisibleLines = useFilters(state => state.invisibleLines)
  const selectedGroup = useFilters(state => state.selectedGroup)
  const lineCodes = useLines(state => state.lines)

  const codes = selectedGroup?.lineCodes || lineCodes
  const filteredCodes = codes.filter(lineCode => !invisibleLines[lineCode])

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
