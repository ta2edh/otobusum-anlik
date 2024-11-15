import { useLines } from '@/stores/lines'
import { LineBusMarkers } from './LineBusMarkers'
import { useShallow } from 'zustand/react/shallow'
import { View } from 'react-native'
import { LineBusStopMarkers } from './LineBusStopMarkers'

export function LineMarkers() {
  const lineCodes = useLines(useShallow(state => Object.keys(state.lines)))

  return (
    <>
      {lineCodes.map(code => (
        <View key={code}>
          <LineBusMarkers code={code} />
          <LineBusStopMarkers code={code} />
        </View>
      ))}
    </>
  )
}
