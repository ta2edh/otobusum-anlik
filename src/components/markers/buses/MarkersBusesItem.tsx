import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { MapMarkerProps } from 'react-native-maps'

import { useTheme } from '@/hooks/useTheme'

import { MarkersCallout } from '../callout/MarkersCallout'

import { MarkersBusesItemCallout } from './MarkersBusesItemCallout'

import { BusLocation } from '@/api/getLineBusLocations'

interface MarkersBusesItemProps extends Omit<MapMarkerProps, 'coordinate'> {
  location: BusLocation
  lineCode: string
}

export const MarkersBusesItem = ({ location, lineCode }: MarkersBusesItemProps) => {
  const { schemeColor } = useTheme(lineCode)

  return (
    <MarkersCallout
      calloutProps={{
        children: <MarkersBusesItemCallout busLocation={location} lineCode={lineCode} />,
      }}
      markerProps={{
        coordinate: {
          latitude: location.lat,
          longitude: location.lng,
        },
        tracksInfoWindowChanges: false,
        tracksViewChanges: false, // Changed to false for better performance
        anchor: { x: 0.5, y: 0.5 },
        zIndex: 2,
        hitSlop: { top: 20, bottom: 20, left: 20, right: 20 }, // Makul hitSlop
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: schemeColor.primaryContainer }]}>
        <Ionicons name="bus" color={schemeColor.onPrimaryContainer} />
      </View>
    </MarkersCallout>
  )
}

export const MarkersBusesItemMemoized = memo(MarkersBusesItem)

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8, // Eski padding
  },
})
