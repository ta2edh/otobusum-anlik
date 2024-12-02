import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native'
import Animated, { FlatListPropsWithLayout } from 'react-native-reanimated'

import { SelectedLine } from './SelectedLine'

import { selectedLineWidth } from '@/constants/width'
import { useLines } from '@/stores/lines'
import { useMisc } from '@/stores/misc'

interface SelectedLinesProps {
  viewProps?: ViewProps
  listProps?: Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>
}

// TODO: Some rerender issues are here.
export const SelectedLines = forwardRef<FlatList, SelectedLinesProps>(function SelectedLines(
  props,
  outerRef,
) {
  const innerRef = useRef<FlatList>(null)
  useImperativeHandle(outerRef, () => innerRef.current!, [])

  const defaultLines = useLines(state => state.lines)
  const selectedGroup = useLines(state => state.selectedGroup)
  const selectedGroupLines = useLines(state =>
    selectedGroup ? state.lineGroups[selectedGroup]?.lineCodes : undefined,
  )

  const items = useMemo(
    () => selectedGroupLines || defaultLines,
    [defaultLines, selectedGroupLines],
  )

  const previousItems = useRef<string[]>(items)

  useEffect(() => {
    const scrolledToIndex = useMisc.getState().selectedLineScrollIndex
    if (items.length === 0 || scrolledToIndex !== items.length) return

    innerRef.current?.scrollToIndex({
      index: items.length - 1,
      animated: true,
    })

    if (items.length !== previousItems.current.length) {
      previousItems.current = items
    }
  }, [items])

  const renderItem: ListRenderItem<string> = useCallback(({ item: code }) => {
    return <SelectedLine code={code} />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, selectedGroup])

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.ceil(event.nativeEvent.contentOffset.x / selectedLineWidth)
    useMisc.setState(() => ({ selectedLineScrollIndex: index }))
  }, [])

  const keyExtractor = useCallback((item: string) => `${item}-${selectedGroup}`, [selectedGroup])

  return (
    <View style={[props.viewProps?.style]}>
      <Animated.FlatList
        {...props.listProps}
        ref={innerRef}
        data={items}
        renderItem={renderItem}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={styles.codes}
        keyExtractor={keyExtractor}
        onScrollToIndexFailed={() => {}}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        snapToAlignment="center"
        pagingEnabled
        horizontal
      />
    </View>
  )
})

const styles = StyleSheet.create({
  codes: {
    padding: 8,
    gap: 8,
    alignItems: 'flex-end',
  },
})
