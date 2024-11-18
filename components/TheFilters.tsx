import Animated, { AnimatedProps, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { StyleSheet, ViewProps } from 'react-native'
import { SelectedLines } from './lines/SelectedLines'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props extends AnimatedProps<ViewProps> {
  animatedIndex: SharedValue<number>
}

export function TheFilters(props: Props) {
  const insets = useSafeAreaInsets()

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: insets.top,
        },
      ],
      opacity: 1 - props.animatedIndex.value,
      pointerEvents: props.animatedIndex.value >= 0.5 ? 'none' : 'auto',
    }
  })

  return (
    <Animated.View style={[animatedStyle, styles.filters]}>
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
