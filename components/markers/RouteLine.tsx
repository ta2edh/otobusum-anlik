import Ionicons from '@react-native-vector-icons/ionicons'
import { useMemo } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { LatLng, Marker, Polyline } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

import { MarkersInView } from './MarkersInView'

import { getTheme, useLinesStore } from '@/stores/lines'
import { angleFromCoordinate } from '@/utils/angleFromCoordinate'

interface RouteLineProps {
  lineCode: string
}

export const RouteLine = ({ lineCode }: RouteLineProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))

  const { query, getRouteFromCode } = useRoutes(lineCode)
  const { getSchemeColorHex } = useTheme(lineTheme)

  const route = getRouteFromCode()

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
    const arrows: { coordinates: LatLng, angle: number }[] = []

    for (let index = 0; index < transformed.length; index += chunkSize) {
      const chunk = transformed.slice(index, index + chunkSize)
      const centerIndex = chunk.length / 2

      const center = chunk.at(centerIndex)
      const next = chunk.at(centerIndex + 2)

      if (!center || !next) continue

      arrows.push({
        coordinates: center,
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

      <MarkersInView
        zoomLimit={14}
        data={arrows}
        renderItem={item => (
          <Marker
            key={`${item.coordinates.latitude}-${item.coordinates.longitude}-${route.route_code}`}
            coordinate={item.coordinates}
            tracksViewChanges={false}
            tracksInfoWindowChanges={false}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={arrowBackground}>
              <Ionicons
                name="arrow-up"
                size={10}
                style={{
                  transform: [
                    {
                      rotate: `${item.angle}deg`,
                    },
                  ],
                }}
              />
            </View>
          </Marker>
        )}
      />
    </>
  )
}
