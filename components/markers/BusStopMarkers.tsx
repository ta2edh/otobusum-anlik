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
import { ClustererProps } from 'react-native-clusterer/lib/typescript/Clusterer'
import { LatLng, MapMarkerProps, Marker, Region } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useMap } from '@/hooks/contexts/useMap'
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

export const LineBusStopMarkers = (props: Props) => {
  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.code))
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

    const clusterItem: ClustererProps<any, supercluster.AnyProps>['renderItem'] = (point) => {
      return (
        <LineBusStopMarkersItemMemoized
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
                <LineBusStopMarkersItemMemoized
                  code={props.code}
                  key={`point-${point.properties.id}`}
                  type="point"
                  stop={busStops[point.properties.id]!}
                  onPress={() => handleOnPress(busStops[point.properties.id]!)}
                />
              )}
      />
    )
  }

  return (
    <>
      {busStops.map(stop => (
        <LineBusStopMarkersItemMemoized
          type="point"
          key={`${stop.x_coord}-${stop.y_coord}-${stop.direction}-${stop.stop_code}`}
          stop={stop}
          code={props.code}
          onPress={() => handleOnPress(stop)}
        />
      ))}
    </>
  )
}

export const LineBusStopMarkersMemoized = memo(LineBusStopMarkers)

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
