import { LineTimetable } from '@/components/LineTimetable'
import { SelectedLines } from '@/components/lines/SelectedLines'
import { useLines } from '@/stores/lines'
import { useCallback } from 'react'
import {
  FlatList,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  Easing,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'
import { useFilters } from '@/stores/filters'
import { SelectedLineWidth } from '@/constants/width'
import { UiText } from '@/components/ui/UiText'
import { i18n } from '@/translations/i18n'

export default function TimetableScreen() {
  const insets = useSafeAreaInsets()
  const linesHeight = useSharedValue(0)
  const linesRef = useAnimatedRef<FlatList>()
  const timetablesRef = useAnimatedRef<FlatList>()

  const lines = useLines(state => state.lines)
  const selectedGroup = useFilters(useShallow(state => state.selectedGroup))

  const items = selectedGroup?.lineCodes || lines

  const onLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      linesHeight.value = withTiming(nativeEvent.layout.height, {
        easing: Easing.out(Easing.quad),
      })
    },
    [linesHeight],
  )

  const childrenContainerStyle = useAnimatedStyle(() => ({
    width: SelectedLineWidth,
    flexShrink: 1,
  }))

  const containerStyle: StyleProp<ViewStyle> = {
    paddingTop: insets.top + 8,
  }

  const handleOnScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    scrollTo(linesRef, contentOffset.x, 0, false)
    scrollTo(timetablesRef, contentOffset.x, 0, false)
  })

  if (items.length < 1) {
    return <UiText style={styles.center} info>{i18n.t('timetableEmpty')}</UiText>
  }

  return (
    <View style={containerStyle}>
      <SelectedLines
        ref={linesRef}
        listProps={{
          onLayout,
          onScroll: handleOnScroll,
        }}
        viewProps={{
          style: { flexShrink: 0 },
        }}
      />

      <Animated.FlatList
        ref={timetablesRef}
        data={items}
        renderItem={({ item }) => (
          <Animated.View style={childrenContainerStyle}>
            <LineTimetable code={item} />
          </Animated.View>
        )}
        style={{ flexGrow: 1, flexShrink: 1 }}
        keyExtractor={item => item}
        contentContainerStyle={{ padding: 8, gap: 8 }}
        onScroll={handleOnScroll}
        pagingEnabled
        snapToAlignment="center"
        horizontal
      />
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})
