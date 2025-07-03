import { memo, useMemo } from 'react'
import { StyleProp, ViewStyle, TextStyle, View, StyleSheet } from 'react-native'
import { LatLng, MapMarkerProps, Marker } from 'react-native-maps'

import { UiText } from '@/components/ui/UiText'

import { useTheme } from '@/hooks/useTheme'

import { useMiscStore } from '@/stores/misc'
import { BusStop } from '@/types/bus'

interface LineBusStopMarkersItemPropsBase extends Omit<MapMarkerProps, 'coordinate'> {
  lineCode?: string
  stop?: BusStop
  coordinate?: LatLng
  viewStyle?: ViewStyle
}

interface PointProps extends LineBusStopMarkersItemPropsBase {
  type: 'point'
  stop: BusStop
  label?: string
  coordinate?: LatLng
}

interface ClusterPoints extends LineBusStopMarkersItemPropsBase {
  type: 'cluster'
  stop?: BusStop
  label: string
  coordinate: LatLng
}

type LineBusStopMarkersItemProps = PointProps | ClusterPoints

export const MarkersStopItem = ({
  stop,
  lineCode,
  viewStyle,
  label,
  coordinate,
  type,
  ...props
}: LineBusStopMarkersItemProps) => {
  const { schemeColor } = useTheme(lineCode)

  const stopStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: schemeColor.primary,
      borderColor: schemeColor.primaryContainer,
    }),
    [schemeColor],
  )

  const textStyle: StyleProp<TextStyle> = useMemo(
    () => ({
      color: schemeColor.onPrimary,
      lineHeight: 10,
    }),
    [schemeColor],
  )

  const handleOnPress = () => {
    if (!stop) return

    useMiscStore.setState(() => ({
      selectedStopId: stop.stop_code,
    }))
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
      zIndex={1}
      hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }} // Çok daha büyük hitSlop
      {...props}
    >
      {/* Invisible larger touch area */}
      <View style={styles.touchArea}>
        <View style={[styles.busStop, stopStyle, viewStyle]}>
          {label && (
            <UiText style={textStyle} size="xs">
              {label}
            </UiText>
          )}
        </View>
      </View>
    </Marker>
  )
}

export const MarkersStopItemMemoized = memo(MarkersStopItem)

const styles = StyleSheet.create({
  touchArea: {
    width: 50, // Çok daha büyük tıklama alanı
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busStop: {
    width: 18, // Biraz daha büyük görsel
    height: 18,
    borderWidth: 2,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
