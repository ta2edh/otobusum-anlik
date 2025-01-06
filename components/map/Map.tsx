import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@/hooks/useTheme'

import { getMapStyle } from '@/constants/mapStyles'

export interface TheMapProps {
  children?: React.ReactNode
  onMapReady?: () => void
  onMapRegionUpdate?: (region: Region) => void
  initialRegion?: Region
}

export const TheMap = ({ onMapReady, onMapRegionUpdate, initialRegion, ...props }: TheMapProps) => {
  const { mode } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <MapView
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
  )
}
