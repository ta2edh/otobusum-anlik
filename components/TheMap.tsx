import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { RefObject } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import MapView, { MapViewProps, PROVIDER_GOOGLE } from 'react-native-maps'
import Animated, { clamp, Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import { useSheetModal } from '@/hooks/contexts/useSheetModal'
import { useTheme } from '@/hooks/useTheme'

import { getMapStyle } from '@/constants/mapStyles'
import { useSettingsStore } from '@/stores/settings'

interface TheMapProps extends MapViewProps {
  cRef?: RefObject<MapView>
}

const screen = Dimensions.get('screen')

export const TheMap = ({ style, cRef, ...props }: TheMapProps) => {
  const { mode } = useTheme()
  const bottomHeight = useBottomTabBarHeight()
  const sheetContext = useSheetModal()

  const insets = useSafeAreaInsets()
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))
  const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))

  const animatedStyle = useAnimatedStyle(() => {
    let heightFrombottom = screen.height - ((sheetContext?.height.value || 0) + bottomHeight) - bottomHeight
    heightFrombottom = clamp(heightFrombottom, 0, screen.height)

    if (!sheetContext) {
      return {
        flex: 1,
      }
    }

    return {
      flex: 1,
      transform: [
        {
          translateY: interpolate(
            sheetContext?.index.value!,
            [-1, 0],
            [0, -heightFrombottom / 1.5],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }
  }, [])

  return (
    <Animated.View style={animatedStyle}>
      <MapView
        ref={cRef}
        style={[styles.map, style]}
        provider={PROVIDER_GOOGLE}
        customMapStyle={getMapStyle(mode)}
        mapPadding={{ top: insets.top, bottom: 10, left: 10, right: 10 }}
        showsIndoors={false}
        toolbarEnabled={false}
        showsTraffic={showTraffic}
        showsUserLocation={showMyLocation}
        {...props}
      >
        {props.children}
      </MapView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  map: {
    flexGrow: 1,
    flexShrink: 0,
  },
})
