import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { LayoutChangeEvent, StyleSheet } from 'react-native'
import { SelectedLines } from './lines/SelectedLines'
import { useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function TheFilters({
  animatedPosition,
  animatedIndex,
}: {
  animatedPosition: SharedValue<number>
  animatedIndex: SharedValue<number>
}) {
  const height = useSharedValue(0)
  const insets = useSafeAreaInsets()

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: insets.top,
          // translateY: animatedPosition.value - height.value - 0,
        },
      ],
      opacity: 1 - animatedIndex.value,
      pointerEvents: animatedIndex.value >= 0.5 ? 'none' : 'auto',
    }
  })

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      height.value = withTiming(event.nativeEvent.layout.height)
    },
    [height],
  )

  return (
    <Animated.View
      onLayout={onLayout}
      style={[animatedStyle, styles.filters]}
    >
      <SelectedLines />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  filters: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 50,
    marginTop: 0,
  },
})
