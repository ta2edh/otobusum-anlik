import { useFilters } from '@/stores/filters'
import { memo } from 'react'

import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native'
import { Callout, MapMarker, Marker } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'
import { useRef } from 'react'

import { i18n } from '@/translations/i18n'
import { UiText } from '@/components/ui/UiText'
import { useLines } from '@/stores/lines'
import { BusLocation } from '@/api/getLineBusLocations'
import { useTheme } from '@/hooks/useTheme'
import { useLine } from '@/hooks/useLine'
import { Ionicons } from '@expo/vector-icons'

interface Props {
  code: string
}

export const LineBusMarkersItem = memo(function LineBusMarkersItem({
  location,
  lineCode,
}: {
  lineCode: string
  location: BusLocation
}) {
  const markerRef = useRef<MapMarker>(null)
  const lineTheme = useLines(useShallow(state => state.lineTheme[lineCode]))
  const { getSchemeColorHex, colorsTheme } = useTheme(lineTheme)

  const textColor = getSchemeColorHex('onPrimaryContainer')
  const backgroundColor = getSchemeColorHex('primaryContainer')

  const calloutStyle: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainer,
    padding: 8,
    width: 250,
    borderRadius: 8,
  }

  return (
    <Marker
      ref={markerRef}
      key={location.kapino}
      coordinate={{
        latitude: parseFloat(location.enlem),
        longitude: parseFloat(location.boylam),
      }}
      tracksInfoWindowChanges={false}
      tracksViewChanges={false}
    >
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name="bus" color={textColor} />
      </View>

      <Callout alphaHitTest tooltip>
        <View style={calloutStyle}>
          <View>
            <UiText>
              {location.hatkodu}
              {' '}
              -
              {location.hatad}
            </UiText>
            <UiText>
              {i18n.t('doorNo')}
              :
              {location.kapino}
            </UiText>
            <UiText>
              {i18n.t('direction')}
              :
              {location.yon}
            </UiText>
            <UiText>
              {i18n.t('lastUpdate')}
              :
              {location.son_konum_zamani}
            </UiText>
          </View>
        </View>
      </Callout>
    </Marker>
  )
})

export const LineBusMarkers = memo(function LineBusMarkers(props: Props) {
  const { query: { data: line } } = useLine(props.code)

  // const line = useLines(useShallow(state => state.lines[props.code]))
  const selectedRoute = useFilters(useShallow(state => state.selectedRoutes[props.code]))

  const route = selectedRoute ?? `${props.code}_G_d0`
  const filtered = line?.filter(loc => loc.guzergahkodu === route)

  return (
    <>
      {filtered?.map(loc => (
        <LineBusMarkersItem key={loc.kapino} lineCode={props.code} location={loc} />
      ))}
    </>
  )
})

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 999,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  icon: {
    width: 10,
    height: 10,
  },
})
