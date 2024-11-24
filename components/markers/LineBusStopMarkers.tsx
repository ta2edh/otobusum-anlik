import { useFilters } from '@/stores/filters'
import { useMap } from '@/hooks/useMap'

import { useShallow } from 'zustand/react/shallow'
import { LatLng } from 'react-native-maps'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { memo, useEffect, useMemo } from 'react'

import { UiText } from '../ui/UiText'
import { getRouteDirection } from '@/utils/getRouteDirection'
import { useLineBusStops } from '@/hooks/useLineBusStops'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { BusStopLocation } from '@/api/getLineBusStopLocations'
import { MarkerLazyCallout } from './MarkerLazyCallout'
import { router } from 'expo-router'

interface Props {
  code: string
}

interface LineBusStopMarkersItemProps {
  stop: BusStopLocation
  code: string
}

export function LineBusStopMarkersItem({ stop, code }: LineBusStopMarkersItemProps) {
  const lineTheme = useLines(useShallow(state => state.lineTheme[code]))
  const { colorsTheme, getSchemeColorHex } = useTheme(lineTheme)

  const backgroundColor = getSchemeColorHex('primary')

  const handleOnCalloutPress = () => {
    router.navigate({
      pathname: '/(tabs)/(home)/stop/[stopId]',
      params: {
        stopId: 1,
      },
    })
  }

  const busStopStyle: StyleProp<ViewStyle> = {
    borderColor: getSchemeColorHex('outlineVariant'),
  }

  const calloutContainerBackground: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainerLow,
  }

  const coordinate = useMemo(() => ({
    latitude: parseFloat(stop.yKoordinati),
    longitude: parseFloat(stop.xKoordinati),
  }), [stop.xKoordinati, stop.yKoordinati])
  return (
    <MarkerLazyCallout
      coordinate={coordinate}
      tracksInfoWindowChanges={false}
      tracksViewChanges={false}
      calloutProps={{
        onPress: handleOnCalloutPress,
        children: (
          <View style={[styles.calloutContainer, calloutContainerBackground]}>
            <UiText style={{ textAlign: 'center' }}>
              {stop.durakKodu}
              {' '}
              -
              {stop.durakAdi}
            </UiText>
          </View>
        ),
      }}
    >
      <View style={[styles.busStop, busStopStyle, { backgroundColor }]} />
    </MarkerLazyCallout>
  )
}

export const LineBusStopMarkers = memo(function LineBusStopMarkers(props: Props) {
  const selectedRoute = useFilters(useShallow(state => state.selectedRoutes[props.code]))

  const map = useMap()
  const { query } = useLineBusStops(props.code)

  useEffect(() => {
    if (!query.data || query.data.length < 1) {
      return
    }

    const locs: LatLng[] = query.data?.map(stop => ({
      latitude: parseFloat(stop.yKoordinati),
      longitude: parseFloat(stop.xKoordinati),
    }))

    map?.current?.fitToCoordinates(locs, {
      edgePadding: {
        top: 20,
        bottom: 200,
        left: 20,
        right: 20,
      },
    })
  }, [query.data, map])

  if (!query.data) {
    return null
  }

  const route = selectedRoute || `${props.code}_G_D0`
  const direction = route ? getRouteDirection(route) : undefined
  const busStops = direction ? query.data.filter(stop => stop.yon === direction) : query.data

  return (
    <>
      {busStops.map(stop => (
        <LineBusStopMarkersItem
          key={`${stop.xKoordinati}-${stop.yKoordinati}-${stop.yon}-${stop.siraNo}`}
          stop={stop}
          code={props.code}
        />
      ))}
    </>
  )
})

const styles = StyleSheet.create({
  calloutContainer: {
    width: 250,
    padding: 8,
    borderRadius: 8,
  },
  busStop: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderRadius: 1000,
  },
})
