import { memo } from 'react'
import { useWindowDimensions } from 'react-native'
import { supercluster, Clusterer, isPointCluster } from 'react-native-clusterer'
import { ClustererProps } from 'react-native-clusterer/lib/typescript/Clusterer'
import { Region } from 'react-native-maps'

import { useLineBusStops } from '@/hooks/queries/useLineBusStops'

import { LineBusStopMarkersItemMemoized } from './StopMarkersItem'

import { useFiltersStore, getSelectedRouteCode } from '@/stores/filters'
import { useSettingsStore } from '@/stores/settings'
import { extractRouteCodeDirection } from '@/utils/extractRouteCodeDirection'

interface Props {
  code: string
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
              />
            )}
    />
  )
}

export const LineBusStopMarkersClusteredMemoized = memo(LineBusStopMarkersClustered)
