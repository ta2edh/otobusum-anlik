import { memo, useMemo } from 'react'
import { LatLng } from 'react-native-maps'

import { useLineBusStops } from '@/hooks/queries/useLineBusStops'

import { MarkersInView } from '../MarkersInView'

import { LineBusStopMarkersItemMemoized } from './StopMarkersItem'

import { useFiltersStore, getSelectedRouteCode } from '@/stores/filters'

interface Props {
  lineCode: string
}

export const LineBusStopMarkers = (props: Props) => {
  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.lineCode))
  const { query } = useLineBusStops(routeCode)

  const stops = useMemo(
    () => {
      const results = query.data?.map(stop => ({
        ...stop,
        coordinates: {
          longitude: stop.x_coord,
          latitude: stop.y_coord,
        } as LatLng,
      }))

      return results || []
    },
    [query.data],
  )

  return (
    <MarkersInView
      zoomLimit={13}
      data={stops}
      renderItem={item => (
        <LineBusStopMarkersItemMemoized
          type="point"
          key={`${item.x_coord}-${item.y_coord}-${routeCode}-${item.stop_code}`}
          stop={item}
          code={routeCode}
        />
      )}
    />
  )
}

export const LineBusStopMarkersMemoized = memo(LineBusStopMarkers)
