import { StyleSheet, ListRenderItem, FlatList, View, ViewProps } from 'react-native'
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import Animated, { FlatListPropsWithLayout } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { findGroupFromId, useLines } from '@/stores/lines'
import { useFilters } from '@/stores/filters'

import { LineGroupsSelect } from './groups/LineGroupsSelect'
import { SelectedLine } from './SelectedLine'

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

  const defaultLines = useLines(useShallow(state => Object.keys(state.lines)))
  const selectedGroup = useFilters(useShallow(state => state.selectedGroup ? findGroupFromId(state.selectedGroup.id) : undefined))
  const lineGroups = useLines(state => state.lineGroups)

  const items = useMemo(
    () => selectedGroup ? selectedGroup.lineCodes : defaultLines,
    [defaultLines, selectedGroup],
  )

  const groupCount = Object.keys(lineGroups).length

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: code }) => {
      return <SelectedLine code={code} />
    },
    [],
  )

  return (
    <View style={[props.viewProps?.style]}>
      {groupCount > 0 && <LineGroupsSelect />}

      <Animated.FlatList
        {...props.listProps}
        ref={innerRef}
        data={items}
        renderItem={renderItem}
        contentContainerStyle={styles.codes}
        keyExtractor={item => item}
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
  },
})
