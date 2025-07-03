import { memo } from 'react'
import { useWindowDimensions } from 'react-native'
import { supercluster, Clusterer, isPointCluster } from 'react-native-clusterer'
import { ClustererProps } from 'react-native-clusterer/lib/typescript/Clusterer'
import { Region } from 'react-native-maps'

import { useLineBusStops } from '@/hooks/queries/useLineBusStops'

import { MarkersStopItemMemoized } from './MarkersStopItem'

import { useFiltersStore, getSelectedRouteCode } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'
import { useSettingsStore } from '@/stores/settings'
import { useMiscStore } from '@/stores/misc'

interface Props {
  lineCode: string
}

export const MarkersStopClustered = (props: Props) => {
  const initialLocation = useSettingsStore(state => state.initialMapLocation)
  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.lineCode))
  const selectedCity = useFiltersStore(state => state.selectedCity)
  const selectedGroup = useFiltersStore(state => state.selectedGroup)
  const { width, height } = useWindowDimensions()
  const invisibleLines = useMiscStore(state => state.invisibleLines)
  const linesStore = useLinesStore()
  
  // Check if line still exists in store
  const lineStillExists = selectedGroup
    ? linesStore.lineGroups[selectedCity][selectedGroup]?.lineCodes.includes(props.lineCode)
    : linesStore.lines[selectedCity].includes(props.lineCode)
  
  // ALWAYS call useLineBusStops hook - hooks must be called in the same order
  const { query } = useLineBusStops(routeCode)
  
  // Don't render if line no longer exists or is invisible
  if (!lineStillExists || invisibleLines.includes(props.lineCode)) {
    return null
  }
  const data = query.data || []

  const filteredParsed: supercluster.PointFeature<any>[] = data.map((item, index) => ({
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
      <MarkersStopItemMemoized
        type="cluster"
        key={`cluster-${point.properties.cluster_id}`}
        lineCode={props.lineCode}
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
              <MarkersStopItemMemoized
                lineCode={props.lineCode}
                key={`point-${point.properties.id}`}
                type="point"
                stop={data[point.properties.id]!}
              />
            )}
    />
  )
}

export const MarkersStopClusteredMemoized = memo(MarkersStopClustered)
