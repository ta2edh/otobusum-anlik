import { ForwardedRef, forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native'
import Animated, { FlatListPropsWithLayout } from 'react-native-reanimated'

import { LineMemoized } from './Line'

import { useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'

interface LinesProps {
  viewProps?: ViewProps
  listProps?: Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>
}

// TODO: Some rerender issues are here.
const Lines = (props: LinesProps, outerRef: ForwardedRef<FlatList>) => {
  const innerRef = useRef<FlatList>(null)
  useImperativeHandle(outerRef, () => innerRef.current!, [])

  const defaultLines = useLinesStore(state => state.lines)
  const selectedGroup = useLinesStore(state => state.selectedGroup)
  const selectedGroupLines = useLinesStore(state =>
    selectedGroup ? state.lineGroups[selectedGroup]?.lineCodes : undefined,
  )

  const items = useMemo(
    () => selectedGroupLines || defaultLines,
    [defaultLines, selectedGroupLines],
  )

  const previousItems = useRef<string[]>(items)

  useEffect(() => {
    const scrolledToIndex = useMiscStore.getState().selectedLineScrollIndex
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
    return <LineMemoized code={code} />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, selectedGroup])

  type ViewableItems = FlatListProps<string>['onViewableItemsChanged']
  const handleOnViewChanged: ViewableItems = ({ viewableItems }) => {
    if (viewableItems.length < 1) return
    useMiscStore.setState(() => ({ selectedLineScrollIndex: viewableItems.at(0)?.index || 0 }))
  }

  const keyExtractor = useCallback((item: string) => `${item}-${selectedGroup}`, [selectedGroup])

  return (
    <View style={[props.viewProps?.style]}>
      <Animated.FlatList
        {...props.listProps}
        ref={innerRef}
        data={items}
        renderItem={renderItem}
        // onMomentumScrollEnd={handleMomentumScrollEnd}
        onViewableItemsChanged={handleOnViewChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
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
}

export const LinesMomoizedFr = memo(forwardRef<FlatList, LinesProps>(Lines))

const styles = StyleSheet.create({
  codes: {
    padding: 8,
    gap: 8,
    alignItems: 'flex-end',
  },
})
