import { useLines } from '@/stores/lines'
import { useFilters } from '@/stores/filters'
import { LineBusMarkers } from './LineBusMarkers'
import { LineBusStopMarkers } from './LineBusStopMarkers'
import { useShallow } from 'zustand/react/shallow'
import { View } from 'react-native'
import { LinePolyline } from './LinePolyline'

export function LineMarkers() {
  const invisibleLines = useFilters(state => state.invisibleLines)
  const lineCodes = useLines(useShallow(state => Object.keys(state.lines)))

  const filteredCodes = lineCodes.filter(lineCode => !invisibleLines[lineCode])

  return (
    <>
      {filteredCodes.map(code => (
        <View key={code}>
          <LineBusMarkers code={code} />
          <LineBusStopMarkers code={code} />
          <LinePolyline code={code} />
        </View>
      ))}
    </>
  )
}
