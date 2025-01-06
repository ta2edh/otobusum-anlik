import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react'
import { View } from 'react-native'
import MapView, { LatLng, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@/hooks/useTheme'

import { getMapStyle } from '@/constants/mapStyles'

export interface TheMapProps {
  children?: React.ReactNode
  onMapReady?: () => void
  onMapRegionUpdate?: (region: Region) => void
  initialRegion?: Region
}

export interface TheMapRef {
  animateCamera: (region: Region) => void
  moveTo: (latlng: LatLng) => void
  fitInsideCoordinates: (coordinates: LatLng[]) => void
}

export const _TheMap = ({ onMapReady, onMapRegionUpdate, initialRegion, ...props }: TheMapProps, ref: ForwardedRef<TheMapRef>) => {
  const map = useRef<MapView>(null)

  const { mode } = useTheme()
  const insets = useSafeAreaInsets()

  useImperativeHandle(ref, () => {
    return {
      animateCamera: (region) => {
        map.current?.animateToRegion(region)
      },
      moveTo: (latlng) => {
        map.current?.animateCamera({
          center: latlng,
        })
      },
      fitInsideCoordinates: (coordinates) => {
        map.current?.fitToCoordinates(coordinates)
      },
    }
  })

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={map}
        provider={PROVIDER_GOOGLE}
        onMapReady={onMapReady}
        onRegionChangeComplete={onMapRegionUpdate}
        toolbarEnabled={false}
        showsIndoors={false}
        mapPadding={{ top: insets.top, bottom: 10, left: 10, right: 10 }}
        initialRegion={initialRegion}
        customMapStyle={getMapStyle(mode)}
      >
        {props.children}
      </MapView>
    </View>
  )
}

export const TheMap = forwardRef<TheMapRef, TheMapProps>(_TheMap)
