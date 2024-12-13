import { router } from 'expo-router'
import { memo, useMemo } from 'react'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native'
import { Clusterer, isPointCluster, supercluster } from 'react-native-clusterer'
import { ClustererProps } from 'react-native-clusterer/lib/typescript/Clusterer'
import { LatLng, MapMarkerProps, Marker, Region } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useLineBusStops } from '@/hooks/queries/useLineBusStops'
import { useTheme } from '@/hooks/useTheme'

import { UiText } from '../ui/UiText'

import { colors } from '@/constants/colors'
import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'
import { useSettingsStore } from '@/stores/settings'
import { BusLineStop } from '@/types/bus'
import { extractRouteCodeDirection } from '@/utils/extractRouteCodeDirection'

interface Props {
  code: string
}

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
      backgroundColor: getSchemeColorHex('primary') || colors.primary,
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
      color: getSchemeColorHex('onPrimary'),
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

export const LineBusStopMarkers = (props: Props) => {
  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.code))
  const initialRegion = useSettingsStore(state => state.initialMapLocation)

  const { query } = useLineBusStops(props.code)

  const zoom = initialRegion ? Math.round(Math.log(360 / initialRegion.longitudeDelta) / Math.LN2) : 0
  const isStopsVisible = zoom > 12

  const stops = useMemo(
    () => {
      const direction = extractRouteCodeDirection(routeCode)
      const busStops = direction ? query.data?.filter(stop => stop.direction === direction) : query.data

      return busStops || []
    },
    [query.data, routeCode],
  )

  if (!isStopsVisible) return null

  return (
    <>
      {stops.map(stop => (
        <LineBusStopMarkersItemMemoized
          type="point"
          key={`${stop.x_coord}-${stop.y_coord}-${stop.direction}-${stop.stop_code}`}
          stop={stop}
          code={props.code}
        />
      ))}
    </>
  )
}

export const LineBusStopMarkersClustered = (props: Props) => {
  const initialLocation = useSettingsStore(state => state.initialMapLocation)
  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.code))
  const { width, height } = useWindowDimensions()

  const { query } = useLineBusStops(props.code)

  const direction = extractRouteCodeDirection(routeCode)
  const busStops
    = (direction ? query.data?.filter(stop => stop.direction === direction) : query.data) || []

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

  const clusterItem: ClustererProps<any, supercluster.AnyProps>['renderItem'] = (point) => {
    return (
      <LineBusStopMarkersItem
        type="cluster"
        key={`cluster-${point.properties.cluster_id}`}
        code={props.code}
        coordinate={{
          latitude: point.geometry.coordinates[1]!,
          longitude: point.geometry.coordinates[0]!,
        }}
        viewStyle={{
          width: 24,
          height: 24,
        }}
        label={point.properties.point_count}
      />
    )
  }

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
      renderItem={(point, ...other) =>
        isPointCluster(point)
          ? (
              clusterItem(point, ...other)
            )
          : (
              <LineBusStopMarkersItem
                code={props.code}
                key={`point-${point.properties.id}`}
                type="point"
                stop={busStops[point.properties.id]!}
              />
            )}
    />
  )
}

export const LineBusStopMarkersItemMemoized = memo(LineBusStopMarkersItem)

export const LineBusStopMarkersMemoized = memo(LineBusStopMarkers)
export const LineBusStopMarkersClusteredMemoized = memo(LineBusStopMarkersClustered)

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
