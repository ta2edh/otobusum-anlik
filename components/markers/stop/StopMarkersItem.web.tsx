import { colors } from "@/constants/colors"
import { useTheme } from "@/hooks/useTheme"
import { useLinesStore, getTheme } from "@/stores/lines"
import { BusStop } from "@/types/bus"
import { AdvancedMarker, AdvancedMarkerAnchorPoint } from "@vis.gl/react-google-maps"
import { memo, useMemo } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { useShallow } from "zustand/react/shallow"

interface StopMarkersItemProps {
  lineCode: string
  stop: BusStop
}

export const LineBusStopMarkersItem = ({ lineCode, stop }: StopMarkersItemProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
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

  return (
    <AdvancedMarker
      position={{
        lng: stop.x_coord,
        lat: stop.y_coord,
      }}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
    >
      <View style={[styles.busStop, borderStyle, backgroundStyle]} />
    </AdvancedMarker>
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
