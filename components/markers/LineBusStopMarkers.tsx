import { router } from 'expo-router'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { LatLng } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useLineBusStops } from '@/hooks/useLineBusStops'
import { useMap } from '@/hooks/useMap'
import { useTheme } from '@/hooks/useTheme'

import { UiText } from '../ui/UiText'

import { MarkerLazyCallout } from './MarkerLazyCallout'

import { colors } from '@/constants/colors'
import { getRoute, useFilters } from '@/stores/filters'
import { useLines } from '@/stores/lines'
import { BusLineStop } from '@/types/bus'
import { extractRouteCodeDirection } from '@/utils/extractRouteCodeDirection'

interface Props {
  code: string
}

interface LineBusStopMarkersItemProps {
  stop: BusLineStop
  code?: string
}

export function LineBusStopMarkersItem({ stop, code }: LineBusStopMarkersItemProps) {
  const lineTheme = useLines(useShallow(state => code ? state.lineTheme[code] : undefined))
  const { colorsTheme, getSchemeColorHex } = useTheme(lineTheme)

  const handleOnCalloutPress = useCallback(() => {
    router.navigate({
      pathname: '/(tabs)/(home)/stop/[stopId]',
      params: {
        stopId: stop.stop_code,
      },
    })
  }, [stop.stop_code])

  const backgroundColor = useMemo(() => getSchemeColorHex('primary') || colors.primary, [getSchemeColorHex])

  const busStopStyle: StyleProp<ViewStyle> = useMemo(() => ({
    borderColor: getSchemeColorHex('outlineVariant'),
  }), [getSchemeColorHex])

  const calloutContainerBackground: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainerLow,
  }

  const coordinate = useMemo(() => ({
    latitude: stop.y_coord,
    longitude: stop.x_coord,
  }), [stop.x_coord, stop.y_coord])

  return (
    <MarkerLazyCallout
      coordinate={coordinate}
      tracksInfoWindowChanges={false}
      tracksViewChanges={false}
      calloutProps={{
        onPress: handleOnCalloutPress,
        children: (
          <View style={[styles.calloutContainer, calloutContainerBackground]}>
            <UiText style={styles.calloutText}>
              {stop.stop_code}
              {' '}
              -
              {stop.stop_name}
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
  const routeCode = useFilters(() => getRoute(props.code))
  // const { getCurrentOrDefaultRouteCode, getRouteDirection } = useRouteFilter(props.code)

  const map = useMap()
  const { query } = useLineBusStops(props.code)

  useEffect(() => {
    if (!query.data || query.data.length < 1) {
      return
    }

    const locs: LatLng[] = query.data?.map(stop => ({
      latitude: stop.y_coord,
      longitude: stop.x_coord,
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

  const direction = extractRouteCodeDirection(routeCode)
  const busStops = direction ? query.data.filter(stop => stop.direction === direction) : query.data

  return (
    <>
      {busStops.map(stop => (
        <LineBusStopMarkersItem
          key={`${stop.x_coord}-${stop.y_coord}-${stop.direction}`}
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
  calloutText: {
    textAlign: 'center',
  },
})
