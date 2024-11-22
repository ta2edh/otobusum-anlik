import { StyleSheet, ListRenderItem, FlatList } from 'react-native'
import Animated, {
  FlatListPropsWithLayout,
} from 'react-native-reanimated'
import { forwardRef, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { SelectedLine } from './SelectedLine'
import { useLines } from '@/stores/lines'

type LinesProps = Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>

export const SelectedLines = forwardRef<FlatList, LinesProps>(function SelectedLines(
  { style, ...props },
  ref,
) {
  const lineCodes = useLines(useShallow(state => Object.keys(state.lines))) || []

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
    <Animated.FlatList
      {...props}
      ref={ref}
      contentContainerStyle={styles.codes}
      data={lineCodes}
      renderItem={renderItem}
      keyExtractor={item => item}
      snapToAlignment="center"
      pagingEnabled
      horizontal
      style={style}
    />
  )
})

const styles = StyleSheet.create({
  codes: {
    padding: 8,
    gap: 8,
  },
})
