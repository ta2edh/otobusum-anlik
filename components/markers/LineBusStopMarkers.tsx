import { router } from 'expo-router'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native'
import { Clusterer, isPointCluster, supercluster } from 'react-native-clusterer'
import { LatLng, Region } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useLineBusStops } from '@/hooks/useLineBusStops'
import { useMap } from '@/hooks/useMap'
import { useTheme } from '@/hooks/useTheme'

import { UiText } from '../ui/UiText'

import { MarkerLazyCallout } from './MarkerLazyCallout'

import { colors } from '@/constants/colors'
import { getRoute, useFilters } from '@/stores/filters'
import { useLines } from '@/stores/lines'
import { useSettings } from '@/stores/settings'
import { BusLineStop } from '@/types/bus'
import { extractRouteCodeDirection } from '@/utils/extractRouteCodeDirection'

interface Props {
  code: string
}

interface LineBusStopMarkersItemProps {
  code?: string
  stop: BusLineStop
  coordinate?: {
    latitude: number
    longitude: number
  }
}

export function LineBusStopMarkersItem({ stop, code, coordinate }: LineBusStopMarkersItemProps) {
  const lineTheme = useLines(useShallow(state => code ? state.lineTheme[code] : undefined))
  const { colorsTheme, getSchemeColorHex } = useTheme(lineTheme)

  const handleOnCalloutPress = useCallback(() => {
    router.navigate({
      pathname: '/(tabs)/(home)/stop/[stopId]',
      params: {
        stopId: stop.stop_code,
      },
    })
  }, [stop?.stop_code])

  const backgroundColor = useMemo(() => getSchemeColorHex('primary') || colors.primary, [getSchemeColorHex])

  const busStopStyle: StyleProp<ViewStyle> = useMemo(() => ({
    borderColor: getSchemeColorHex('outlineVariant'),
  }), [getSchemeColorHex])

  const calloutContainerBackground: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainerLow,
  }

  const coordinateDefault = useMemo(() => ({
    latitude: stop.y_coord,
    longitude: stop.x_coord,
  }), [stop.x_coord, stop.y_coord])

  return (
    <MarkerLazyCallout
      coordinate={coordinate || coordinateDefault}
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
  const initialLocation = useSettings(state => state.initialMapLocation)
  const clusterStops = useSettings(state => state.clusterStops)

  const map = useMap()
  const { width, height } = useWindowDimensions()
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

  const direction = extractRouteCodeDirection(routeCode)
  const busStops = (direction ? query.data?.filter(stop => stop.direction === direction) : query.data) || []

  if (!query.data) {
    return null
  }

  if (clusterStops) {
    const filteredParsed: supercluster.PointFeature<any>[] = busStops.map((item, index) => ({
      geometry: {
        coordinates: [item.x_coord, item.y_coord],
        type: 'Point',
      },
      properties: {
        id: index,
      },
      type: 'Feature',
    }))

    return (
      <Clusterer
        data={filteredParsed}
        region={initialLocation as Region}
        mapDimensions={{
          width, height,
        }}
        options={{
          minPoints: 6,
          radius: 32,
        }}
        renderItem={(point, index) => (
          <LineBusStopMarkersItem
            key={
              isPointCluster(point)
                ? `cluster-${point.properties.cluster_id}`
                : `point-${point.properties.id}`
            }
            stop={busStops[index]!}
            code={props.code}
            coordinate={{
              latitude: point.geometry.coordinates[1]!,
              longitude: point.geometry.coordinates[0]!,
            }}
          />
        )}
      />
    )
  }

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
