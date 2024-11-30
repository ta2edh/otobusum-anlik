import { View } from 'react-native'

import { LineBusMarkers } from './LineBusMarkers'
import { LineBusStopMarkers } from './LineBusStopMarkers'

import { useFilters } from '@/stores/filters'
import { useLines } from '@/stores/lines'

export function LineMarkers() {
  const invisibleLines = useFilters(state => state.invisibleLines)
  const lineCodes = useLines(state => state.lines)

  const filteredCodes = lineCodes.filter(lineCode => !invisibleLines[lineCode])

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
