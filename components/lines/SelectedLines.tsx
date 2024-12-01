import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import { FlatList, ListRenderItem, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View, ViewProps } from 'react-native'
import Animated, { FlatListPropsWithLayout } from 'react-native-reanimated'

import { SelectedLine } from './SelectedLine'

import { selectedLineWidth } from '@/constants/width'
import { useFilters } from '@/stores/filters'
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
  const selectedGroup = useFilters(state => state.selectedGroup)

  const items = useMemo(
    () => selectedGroup ? selectedGroup.lineCodes : defaultLines,
    [defaultLines, selectedGroup],
  )

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: code }) => {
      return <SelectedLine code={code} />
    },
    [],
  )

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.ceil(event.nativeEvent.contentOffset.x / selectedLineWidth)
    useMisc.setState(() => ({ selectedLineScrollIndex: index }))
  }, [])

  const keyExtractor = useCallback((item: string) => item, [])

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
