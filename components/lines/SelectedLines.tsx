import {
  StyleSheet,
  ListRenderItem,
  FlatList,
} from 'react-native'
import Animated, {
  FlatListPropsWithLayout,
} from 'react-native-reanimated'
import { useCallback, forwardRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { SelectedLine } from './SelectedLine'
import { useLines } from '@/stores/lines'

type LinesProps = Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>

export const SelectedLines = forwardRef<FlatList, LinesProps>(function SelectedLines(
  { style, ...props },
  ref,
) {
  const keys = useLines(useShallow(state => Object.keys(state.lines))) || []

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

  if (keys.length < 1) {
    return null
  }

  return (
    <Animated.FlatList
      {...props}
      ref={ref}
      contentContainerStyle={styles.codes}
      data={keys}
      renderItem={renderItem}
      keyExtractor={item => item}
      snapToAlignment="center"
      pagingEnabled
      style={style}
      horizontal
    />
  )
})

const styles = StyleSheet.create({
  codes: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 8,
  },
})
