import { useLines } from '@/stores/lines'
import { useFilters } from '@/stores/filters'
import { LineBusMarkers } from './LineBusMarkers'
import { LineBusStopMarkers } from './LineBusStopMarkers'
import { useShallow } from 'zustand/react/shallow'
import { View } from 'react-native'

export function LineMarkers() {
  const invisibleRoutes = useFilters(state => state.invisibleRoutes)
  const lineCodes = useLines(useShallow(state => Object.keys(state.lines)))

  const filteredCodes = lineCodes.filter(lineCode => !invisibleRoutes[lineCode])

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
