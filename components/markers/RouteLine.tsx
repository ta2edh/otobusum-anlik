import Ionicons from '@react-native-vector-icons/ionicons'
import { useMemo } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { LatLng, Marker, Polyline } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

import { useLinesStore } from '@/stores/lines'
import { useSettingsStore } from '@/stores/settings'
import { angleFromCoordinate } from '@/utils/angleFromCoordinate'
import { regionToZoom } from '@/utils/regionToZoom'

interface RouteLineProps {
  code: string
}

export const RouteLine = (props: RouteLineProps) => {
  const lineTheme = useLinesStore(useShallow(state => state.lineTheme[props.code]))
  const initialRegion = useSettingsStore(state => state.initialMapLocation)

  const { query, getRouteFromCode } = useRoutes(props.code)
  const { getSchemeColorHex } = useTheme(lineTheme)

  const route = getRouteFromCode()
  const zoom = initialRegion ? regionToZoom(initialRegion) : 0

  const transformed: LatLng[] = useMemo(
    () =>
      route?.route_path?.map(path => ({
        latitude: path.lat,
        longitude: path.lng,
      })) || [],
    [route],
  )

  const arrows = useMemo(() => {
    const chunkSize = transformed.length / (transformed.length / 14)
    const arrows: { coordinate: LatLng, angle: number }[] = []

    for (let index = 0; index < transformed.length; index += chunkSize) {
      const chunk = transformed.slice(index, index + chunkSize)
      const centerIndex = chunk.length / 2

      const center = chunk.at(centerIndex)
      const next = chunk.at(centerIndex + 2)

      if (!center || !next) continue

      arrows.push({
        coordinate: center,
        angle: angleFromCoordinate(
          center.latitude,
          center.longitude,
          next.latitude,
          next.longitude,
        ),
      })
    }

    return arrows
  }, [transformed])

  if (query.isPending || !route) return

  const arrowBackground: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('primary'),
    borderRadius: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 14,
    height: 14,
  }

  return (
    <>
      <Polyline
        coordinates={transformed}
        strokeWidth={6}
        strokeColor={getSchemeColorHex('primary')}
      />

      {zoom > 13 && arrows.map(arrow => (
        <Marker
          key={`${arrow.coordinate.latitude}-${arrow.coordinate.longitude}-${route.route_code}`}
          coordinate={arrow.coordinate}
          tracksViewChanges={false}
          tracksInfoWindowChanges={false}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View
            style={[
              arrowBackground,
              {
                transform: [
                  {
                    rotate: `${arrow.angle}deg`,
                  },
                ],
              },
            ]}
          >
            <Ionicons name="arrow-up" size={10} />
          </View>
        </Marker>
      ))}
    </>
  )
}
