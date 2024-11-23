import { StyleSheet, ListRenderItem, FlatList, View, Platform } from 'react-native'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import Animated, { FlatListPropsWithLayout } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useLines } from '@/stores/lines'
import { useFilters } from '@/stores/filters'

import { LineGroupsSelect } from './groups/LineGroupsSelect'
import { SelectedLine } from './SelectedLine'

type LinesProps = Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>

export const SelectedLines = forwardRef<FlatList, LinesProps>(function SelectedLines(
  { style, ...props },
  outerRef,
) {
  const innerRef = useRef<FlatList>(null)
  useImperativeHandle(outerRef, () => innerRef.current!, [])

  const defaultLines = useLines(useShallow(state => Object.keys(state.lines)))
  const lineGroups = useLines(useShallow(state => state.lineGroups))
  const selectedGroup = useFilters(useShallow(state => state.selectedGroup))

  const items = selectedGroup ? lineGroups[selectedGroup] : defaultLines
  const groupCount = Object.keys(lineGroups).length

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: code }) => {
      return (
        <SelectedLine key={code} code={code}>
          {props?.children}
        </SelectedLine>
      )
    },
    [props.children],
  )

  const handleOnEndReached = useCallback(() => {
    if (Platform.OS === 'android') {
      innerRef.current?.scrollToEnd()
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {groupCount > 0 && <LineGroupsSelect />}

      <Animated.FlatList
        {...props}
        ref={innerRef}
        data={items}
        renderItem={renderItem}
        contentContainerStyle={styles.codes}
        keyExtractor={item => item}
        snapToAlignment="center"
        pagingEnabled
        horizontal
        style={style}
        onEndReached={handleOnEndReached}
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
