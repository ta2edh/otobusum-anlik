import { memo, useMemo } from 'react'
import { LatLng } from 'react-native-maps'

import { useLineBusStops } from '@/hooks/queries/useLineBusStops'

import { MarkersInView } from '../MarkersInView'

import { LineBusStopMarkersItemMemoized } from './StopMarkersItem'

import { useFiltersStore, getSelectedRouteCode } from '@/stores/filters'
import { extractRouteCodeDirection } from '@/utils/extractRouteCodeDirection'

interface Props {
  code: string
}

export const LineBusStopMarkers = (props: Props) => {
  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.code))
  const { query } = useLineBusStops(props.code)

  const stops = useMemo(
    () => {
      const direction = extractRouteCodeDirection(routeCode)
      const busStops = direction ? query.data?.filter(stop => stop.direction === direction) : query.data

      return busStops?.map(stop => ({
        ...stop,
        coordinates: {
          longitude: stop.x_coord,
          latitude: stop.y_coord,
        } as LatLng,
      })) || []
    },
    [query.data, routeCode],
  )

  return (
    <MarkersInView
      zoomLimit={13}
      data={stops}
      renderItem={item => (
        <LineBusStopMarkersItemMemoized
          type="point"
          key={`${item.x_coord}-${item.y_coord}-${item.direction}-${item.stop_code}`}
          stop={item}
          code={props.code}
        />
      )}
    />
  )
}

export const LineBusStopMarkersMemoized = memo(LineBusStopMarkers)
