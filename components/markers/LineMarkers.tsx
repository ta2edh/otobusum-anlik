import { View } from 'react-native'

import { LineBusMarkers } from './LineBusMarkers'
import { LineBusStopMarkers } from './LineBusStopMarkers'

import { useLines } from '@/stores/lines'
import { useMisc } from '@/stores/misc'

export function LineMarkers() {
  const invisibleLines = useMisc(state => state.invisibleLines)
  const lineCodes = useLines(state => state.lines)

  const selectedGroup = useLines(state => state.selectedGroup)
  const selectedGroupLines = useLines(state => selectedGroup ? state.lineGroups[selectedGroup]?.lineCodes : undefined)

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
