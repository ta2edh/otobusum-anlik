import { RefObject } from 'react'
import MapView, { MapViewProps, PROVIDER_GOOGLE } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@/hooks/useTheme'

import { getMapStyle } from '@/constants/mapStyles'
import { useSettingsStore } from '@/stores/settings'

interface TheMapProps extends MapViewProps {
  cRef?: RefObject<MapView>
}

export const TheMap = ({ style, cRef, ...props }: TheMapProps) => {
  const { mode } = useTheme()

  const insets = useSafeAreaInsets()

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      customMapStyle={getMapStyle(mode)}
      mapPadding={{ top: insets.top, bottom: 10, left: 10, right: 10 }}
      initialRegion={useSettingsStore.getState().initialMapLocation || {
        latitude: 39.66770141070046,
        latitudeDelta: 4.746350767346861,
        longitude: 28.17840663716197,
        longitudeDelta: 2.978521026670929,
      }}
      showsIndoors={false}
      toolbarEnabled={false}
      {...props}
    >
      {props.children}
    </MapView>
  )
}
