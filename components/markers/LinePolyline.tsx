import { getLinePolyline } from '@/api/getLinePolyline'
import { useRouteFilter } from '@/hooks/useRouteFilter'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { useQuery } from '@tanstack/react-query'

import { LatLng, Polyline } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

interface Props {
  code: string
}

export function LinePolyline(props: Props) {
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))

  const { getSchemeColorHex } = useTheme(lineTheme)
  const { getRouteDirection, getCurrentOrDefaultRouteCode } = useRouteFilter(props.code)

  const direction = getRouteDirection(getCurrentOrDefaultRouteCode())

  const queryPolyline = useQuery({
    queryKey: ['polyline', props.code],
    queryFn: () => getLinePolyline(props.code, direction || 'G'),
    staleTime: 60_000 * 30,
  })

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
