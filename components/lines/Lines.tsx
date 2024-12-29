import { ForwardedRef, forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import Animated, { FlatListPropsWithLayout } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { usePaddings } from '@/hooks/usePaddings'

import { LineMemoized } from './Line'

import { useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'

interface LinesProps {
  containerStyle?: ViewStyle
  contentContainerStyle?: ViewStyle
  listProps?: Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>
}

// TODO: Some rerender issues are here.
const Lines = (props: LinesProps, outerRef: ForwardedRef<FlatList>) => {
  const innerRef = useRef<FlatList>(null)
  useImperativeHandle(outerRef, () => innerRef.current!, [])
  const paddings = usePaddings(true)

  const selectedGroup = useFiltersStore(useShallow(state => state.selectedGroup))
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))
  const lines = useLinesStore(() => getLines())

  const previouslines = useRef<string[]>(lines)

  useEffect(() => {
    const scrolledToIndex = useMiscStore.getState().selectedLineScrollIndex
    if (lines.length === 0 || scrolledToIndex !== lines.length) return

    innerRef.current?.scrollToIndex({
      index: lines.length - 1,
      animated: true,
    })

    if (lines.length !== previouslines.current.length) {
      previouslines.current = lines
    }
  }, [lines])

  const renderItem: ListRenderItem<string> = useCallback(({ item: code }) => {
    return <LineMemoized lineCode={code} />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, selectedGroup, selectedCity])

  type ViewableItems = FlatListProps<string>['onViewableItemsChanged']
  const handleOnViewChanged: ViewableItems = ({ viewableItems }) => {
    if (viewableItems.length < 1) return
    useMiscStore.setState(() => ({ selectedLineScrollIndex: viewableItems.at(0)?.index || 0 }))
  }

  const keyExtractor = useCallback((item: string) => `${item}-${selectedGroup}`, [selectedGroup])

  return (
    <View style={props.containerStyle}>
      <Animated.FlatList
        {...props.listProps}
        ref={innerRef}
        data={lines}
        renderItem={renderItem}
        onViewableItemsChanged={handleOnViewChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        contentContainerStyle={[paddings, styles.codes, props.contentContainerStyle]}
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
    gap: 8,
    alignItems: 'flex-end',
  },
})
