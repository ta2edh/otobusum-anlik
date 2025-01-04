import { Polyline } from '@react-google-maps/api'
import { useShallow } from 'zustand/react/shallow'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

import { useLinesStore, getTheme } from '@/stores/lines'

interface PolylineProps {
  lineCode: string
}

export const RoutePolyline = ({ lineCode }: PolylineProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const { getSchemeColorHex } = useTheme(lineTheme)

  const { getRouteFromCode } = useRoutes(lineCode)
  const route = getRouteFromCode()

  return (
    <Polyline
      path={route?.route_path || []}
      options={{
        strokeColor: getSchemeColorHex('primary'),
        strokeWeight: 6,
      }}
    />
  )
}
