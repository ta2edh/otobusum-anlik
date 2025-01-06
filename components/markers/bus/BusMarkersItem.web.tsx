import { AdvancedMarker, AdvancedMarkerAnchorPoint } from '@vis.gl/react-google-maps'
import Ionicons from '@react-native-vector-icons/ionicons'
import { memo } from 'react'

import { BusLocation } from '@/api/getLineBusLocations'
import { StyleSheet, View } from 'react-native'
import { colors } from '@/constants/colors'
import { useTheme } from '@/hooks/useTheme'
import { useLinesStore, getTheme } from '@/stores/lines'
import { useShallow } from 'zustand/react/shallow'

interface LineBusMarkersItemProps {
  location: BusLocation
  lineCode: string
}

export const LineBusMarkersItem = ({ location, lineCode }: LineBusMarkersItemProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const { getSchemeColorHex } = useTheme(lineTheme)

  const textColor = getSchemeColorHex('onPrimaryContainer')
  const backgroundColor = getSchemeColorHex('primaryContainer')

  return (
    <AdvancedMarker
      position={{
        lng: location.lng,
        lat: location.lat,
      }}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
    >
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name="bus" color={textColor} />
      </View>
    </AdvancedMarker>
  )
}

export const LineBusMarkersItemMemoized = memo(LineBusMarkersItem)

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  icon: {
    width: 10,
    height: 10,
  },
  calloutContainer: {
    backgroundColor: colors.dark.surfaceContainer,
    padding: 8,
    width: 250,
    borderRadius: 8,
  },
})
