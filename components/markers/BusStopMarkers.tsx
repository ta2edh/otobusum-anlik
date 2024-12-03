import { router } from 'expo-router'
import { memo, useEffect, useMemo } from 'react'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native'
import { Clusterer, isPointCluster, supercluster } from 'react-native-clusterer'
import { LatLng, MapMarkerProps, Marker, Region } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useLineBusStops } from '@/hooks/useLineBusStops'
import { useMap } from '@/hooks/useMap'
import { useTheme } from '@/hooks/useTheme'

import { UiText } from '../ui/UiText'

import { colors } from '@/constants/colors'
import { getRoute, useFiltersStore } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'
import { useSettingsStore } from '@/stores/settings'
import { BusLineStop } from '@/types/bus'
import { extractRouteCodeDirection } from '@/utils/extractRouteCodeDirection'

interface Props {
  code: string
}

interface LineBusStopMarkersItemProps extends Omit<MapMarkerProps, 'coordinate'> {
  code?: string
  stop: BusLineStop
  coordinate?: LatLng
  viewStyle?: ViewStyle
  label?: string
}

export const LineBusStopMarkersItem = ({
  stop,
  code,
  coordinate,
  viewStyle,
  label,
  ...props
}: LineBusStopMarkersItemProps) => {
  const lineTheme = useLinesStore(useShallow(state => (code ? state.lineTheme[code] : undefined)))
  const { getSchemeColorHex } = useTheme(lineTheme)

  const backgroundColor = useMemo(
    () => getSchemeColorHex('primary') || colors.primary,
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
      color: getSchemeColorHex('onPrimary'),
    }),
    [getSchemeColorHex],
  )

  const coordinateDefault = useMemo(
    () => ({
      latitude: stop.y_coord,
      longitude: stop.x_coord,
    }),
    [stop.x_coord, stop.y_coord],
  )

  return (
    <Marker
      coordinate={coordinate || coordinateDefault}
      tracksInfoWindowChanges={false}
      tracksViewChanges={false}
      {...props}
    >
      <View style={[styles.busStop, borderStyle, { backgroundColor }, viewStyle]}>
        {label && (
          <UiText style={textStyle} size="sm" info>
            {label}
          </UiText>
        )}
      </View>
    </Marker>
  )
}

export const LineBusStopMarkers = memo(function LineBusStopMarkers(props: Props) {
  const routeCode = useFiltersStore(() => getRoute(props.code))
  const initialLocation = useSettingsStore(state => state.initialMapLocation)
  const clusterStops = useSettingsStore(state => state.clusterStops)

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
  const busStops
    = (direction ? query.data?.filter(stop => stop.direction === direction) : query.data) || []

  if (!query.data) {
    return null
  }

  const handleOnPress = (stop: BusLineStop) => {
    router.navigate({
      pathname: '/(tabs)',
      params: {
        stopId: stop.stop_code,
      },
    })
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
          width,
          height,
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
            onPress={() => {
              if (isPointCluster(point)) return
              handleOnPress(busStops[index]!)
            }}
            viewStyle={
              isPointCluster(point)
                ? {
                    width: 24,
                    height: 24,
                  }
                : undefined
            }
            label={point.properties.point_count}
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
          onPress={() => handleOnPress(stop)}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutText: {
    textAlign: 'center',
  },
})
