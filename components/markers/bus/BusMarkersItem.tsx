import Ionicons from '@react-native-vector-icons/ionicons'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { MapMarkerProps } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { UiText } from '@/components/ui/UiText'

import { useTheme } from '@/hooks/useTheme'

import { MarkerLazyCallout } from '../MarkerLazyCallout'

import { BusLocation } from '@/api/getLineBusLocations'
import { colors } from '@/constants/colors'
import { getTheme, useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'

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
    <MarkerLazyCallout
      calloutProps={{
        children: (
          <View style={styles.calloutContainer}>
            <View>
              {location.route_code && (
                <UiText>
                  {location.route_code}
                  {/* {' '}
                  -
                  {location.line_name} */}
                </UiText>
              )}

              <UiText>
                {i18n.t('doorNo')}
                :
                {location.bus_id}
              </UiText>
              {/* <UiText>
                {i18n.t('lastUpdate')}
                :
                {location.last_location_update}
              </UiText> */}
            </View>
          </View>
        ),
      }}
      markerProps={{
        coordinate: {
          latitude: location.lat,
          longitude: location.lng,
        },
        tracksInfoWindowChanges: false,
        tracksViewChanges: false,
        anchor: { x: 0.5, y: 0.5 },
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name="bus" color={textColor} />
      </View>
    </MarkerLazyCallout>
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
