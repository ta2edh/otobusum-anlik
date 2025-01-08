import Ionicons from '@react-native-vector-icons/ionicons'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { MapMarkerProps } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useTheme } from '@/hooks/useTheme'

import { MarkerWithCallout } from '../callout/MarkerWithCallout'

import { BusMarkersCallout } from './BusMarkersCallout'

import { BusLocation } from '@/api/getLineBusLocations'
import { getTheme, useLinesStore } from '@/stores/lines'

interface LineBusMarkersItemProps extends Omit<MapMarkerProps, 'coordinate'> {
  location: BusLocation
  lineCode: string
}

export const LineBusMarkersItem = ({ location, lineCode }: LineBusMarkersItemProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const { getSchemeColorHex } = useTheme(lineTheme)

  const textColor = getSchemeColorHex('onPrimaryContainer')
  const backgroundColor = getSchemeColorHex('primaryContainer')

  return (
    <MarkerWithCallout
      calloutProps={{
        children: <BusMarkersCallout busLocation={location} lineCode={lineCode} />,
      }}
      markerProps={{
        coordinate: {
          latitude: location.lat,
          longitude: location.lng,
        },
        tracksInfoWindowChanges: false,
        tracksViewChanges: false,
        anchor: { x: 0.5, y: 0.5 },
        zIndex: 2,
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name="bus" color={textColor} />
      </View>
    </MarkerWithCallout>
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
})
