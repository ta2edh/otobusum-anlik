import { LineTimetable } from '@/components/LineTimetable'
import { SelectedLines } from '@/components/lines/SelectedLines'
import { TheFocusAwareStatusBar } from '@/components/TheFocusAwareStatusbar'
import { UiText } from '@/components/ui/UiText'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { useCallback } from 'react'
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

export default function TimetableScreen() {
  const { colorsTheme } = useTheme()
  const insets = useSafeAreaInsets()
  const linesHeight = useSharedValue(0)

  const keys = useLines(useShallow(state => Object.keys(state.lines)))

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    linesHeight.value = withTiming(nativeEvent.layout.height, { easing: Easing.out(Easing.quad) })
  }, [linesHeight])

  const childrenStyle = useAnimatedStyle(() => ({
    paddingTop: linesHeight.value,
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  }))

  const timetableLineStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    paddingTop: insets.top - 4,
    zIndex: 10,
    left: 0,
    right: 0,
    backgroundColor: colorsTheme.surfaceContainerLow,
  }

  if (keys.length < 1) {
    return (
      <View style={{ flex: 1 }}>
        <TheFocusAwareStatusBar />

        <UiText info style={{ textAlign: 'center', textAlignVertical: 'center', flex: 1 }}>
          {i18n.t('timetableEmpty')}
        </UiText>
      </View>
    )
  }

  return (
    <View>
      <SelectedLines
        style={timetableLineStyle}
        onLayout={onLayout}
      />

      <Animated.ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={childrenStyle}>
          {keys.map(cd => (
            <LineTimetable key={cd} code={cd} />
          ))}
        </Animated.View>
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
  },
})
