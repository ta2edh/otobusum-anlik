import { useCallback } from 'react'
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
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
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import { SelectedLines } from '@/components/lines/SelectedLines'
import { LineTimetable } from '@/components/LineTimetable'
import { UiText } from '@/components/ui/UiText'

import { selectedLineWidth } from '@/constants/width'
import { useFilters } from '@/stores/filters'
import { useLines } from '@/stores/lines'
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

  const containerStyle: StyleProp<ViewStyle> = {
    paddingTop: insets.top + 8,
    flex: 1,
  }

  const handleOnScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    scrollTo(linesRef, contentOffset.x, 0, false)
    scrollTo(timetablesRef, contentOffset.x, 0, false)
  })

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item }) => {
      return (
        <Animated.View style={styles.childrenContainer}>
          <LineTimetable code={item} />
        </Animated.View>
      )
    },
    [],
  )

  const keyExtractor = useCallback(
    (item: string) => item,
    [],
  )

  if (items.length < 1) {
    return (
      <UiText style={styles.center} info>
        {i18n.t('timetableEmpty')}
      </UiText>
    )
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
        renderItem={renderItem}
        style={styles.list}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
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
  list: {
    flexGrow: 1,
    flexShrink: 1,
    maxHeight: '100%',
  },
  listContent: {
    padding: 8,
    gap: 8,
  },
  childrenContainer: {
    flexShrink: 1,
    width: selectedLineWidth,
  },
})
