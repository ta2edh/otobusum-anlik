import { router } from 'expo-router'
import { memo, useMemo } from 'react'
import { StyleProp, ViewStyle, TextStyle, View, StyleSheet } from 'react-native'
import { LatLng, MapMarkerProps, Marker } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { UiText } from '@/components/ui/UiText'

import { useTheme } from '@/hooks/useTheme'

import { colors } from '@/constants/colors'
import { useLinesStore } from '@/stores/lines'
import { BusLineStop } from '@/types/bus'

interface LineBusStopMarkersItemPropsBase extends Omit<MapMarkerProps, 'coordinate'> {
  code?: string
  stop?: BusLineStop
  coordinate?: LatLng
  viewStyle?: ViewStyle
}

interface PointProps extends LineBusStopMarkersItemPropsBase {
  type: 'point'
  stop: BusLineStop
  label?: string
  coordinate?: LatLng
}

interface ClusterPoints extends LineBusStopMarkersItemPropsBase {
  type: 'cluster'
  stop?: BusLineStop
  label: string
  coordinate: LatLng
}

type LineBusStopMarkersItemProps = PointProps | ClusterPoints

export const LineBusStopMarkersItem = ({
  stop,
  code,
  viewStyle,
  label,
  coordinate,
  type,
  ...props
}: LineBusStopMarkersItemProps) => {
  const lineTheme = useLinesStore(
    useShallow(state => (code ? state.lineTheme[code] : undefined)),
  )
  const { getSchemeColorHex } = useTheme(lineTheme)

  const backgroundStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: getSchemeColorHex('onPrimary') || colors.primary,
    }),
    [getSchemeColorHex],
  )

  const borderStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      borderColor: getSchemeColorHex('outlineVariant'),
    }),
    [getSchemeColorHex],
  )

  const textStyle: StyleProp<TextStyle> = useMemo(
    () => ({
      color: getSchemeColorHex('primary'),
    }),
    [getSchemeColorHex],
  )

  const handleOnPress = () => {
    if (!stop) return

    router.navigate({
      pathname: '/(tabs)',
      params: {
        stopId: stop.stop_code,
      },
    })
  }

  const coords: LatLng
    = type === 'cluster'
      ? coordinate
      : {
          latitude: stop?.y_coord,
          longitude: stop?.x_coord,
        }

  return (
    <Marker
      coordinate={coords}
      tracksInfoWindowChanges={false}
      tracksViewChanges={false}
      onPress={handleOnPress}
      anchor={{ x: 0.5, y: 0.5 }}
      {...props}
    >
      <View style={[styles.busStop, borderStyle, backgroundStyle, viewStyle]}>
        {label && (
          <UiText style={textStyle} size="sm" info>
            {label}
          </UiText>
        )}
      </View>
    </Marker>
  )
}

export const LineBusStopMarkersItemMemoized = memo(LineBusStopMarkersItem)

const styles = StyleSheet.create({
  busStop: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
