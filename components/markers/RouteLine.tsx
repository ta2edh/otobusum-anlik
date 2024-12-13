import { LatLng, Polyline } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

import { useLinesStore } from '@/stores/lines'

interface RouteLineProps {
  code: string
}

export const RouteLine = (props: RouteLineProps) => {
  const lineTheme = useLinesStore(useShallow(state => state.lineTheme[props.code]))

  const { query, getRouteFromCode } = useRoutes(props.code)
  const { getSchemeColorHex } = useTheme(lineTheme)

  if (query.isPending) return

  const route = getRouteFromCode()
  if (!route?.route_path) return

  const transformed: LatLng[] = route.route_path.map(path => ({
    latitude: path.lat,
    longitude: path.lng,
  }))

  return (
    <Polyline
      coordinates={transformed}
      strokeWidth={2}
      strokeColor={getSchemeColorHex('primary')}
    />
  )
}
