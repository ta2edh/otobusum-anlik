import { StyleSheet, ListRenderItem, FlatList, View } from 'react-native'
import Animated, {
  FlatListPropsWithLayout,
} from 'react-native-reanimated'
import { forwardRef, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { SelectedLine } from './SelectedLine'
import { useLines } from '@/stores/lines'
import { LineGroupsSelect } from './groups/LineGroupsSelect'
import { useFilters } from '@/stores/filters'

type LinesProps = Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>

export const SelectedLines = forwardRef<FlatList, LinesProps>(function SelectedLines(
  { style, ...props },
  ref,
) {
  const lineCodes = useLines(useShallow(state => Object.keys(state.lines))) || []
  const selectedGroup = useFilters(useShallow(state => state.selectedGroup))
  const selectedGroupLines = useLines(useShallow(state => selectedGroup ? state.lineGroups[selectedGroup] : undefined))

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

  if (lineCodes.length < 1) {
    return null
  }

  return (
    <View>
      <LineGroupsSelect />

      <Animated.FlatList
        {...props}
        ref={ref}
        contentContainerStyle={styles.codes}
        data={selectedGroupLines || lineCodes}
        renderItem={renderItem}
        keyExtractor={item => item}
        snapToAlignment="center"
        pagingEnabled
        horizontal
        style={style}
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
