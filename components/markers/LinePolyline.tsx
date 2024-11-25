import { getLinePolyline } from '@/api/getLinePolyline'
import { useTheme } from '@/hooks/useTheme'
import { useFilters } from '@/stores/filters'
import { useLines } from '@/stores/lines'
import { getRouteDirection } from '@/utils/getRouteDirection'
import { useQuery } from '@tanstack/react-query'

import { LatLng, Polyline } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

interface Props {
  code: string
}

export function LinePolyline(props: Props) {
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))
  const selectedRoute = useFilters(useShallow(state => state.selectedRoutes[props.code]))

  const { getSchemeColorHex } = useTheme(lineTheme)

  const route = selectedRoute || `${props.code}_G_D0`
  const direction = route ? getRouteDirection(route) : undefined

  console.log(props.code)

  const queryPolyline = useQuery({
    queryKey: ['polyline', props.code],
    queryFn: () => getLinePolyline(props.code, direction || 'G'),
    staleTime: 60_000 * 30,
  })

  console.log(queryPolyline.data)

  if (!queryPolyline.data) return null

  const parsedPolyline: LatLng[] = queryPolyline.data.coordinates.map(pol => ({
    latitude: pol.y,
    longitude: pol.x,
  }))

  return (
    <Polyline
      coordinates={parsedPolyline}
      strokeColor={getSchemeColorHex('primary')}
      strokeWidth={6}
    />
  )
}
