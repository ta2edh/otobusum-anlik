import { UiLineCode } from '@/components/ui/UiLineCode'
import { UiText } from '@/components/ui/UiText'
import { FlashList, ListRenderItem } from '@shopify/flash-list'

import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { useCallback } from 'react'
import { useLines } from '@/stores/lines'

interface Props extends TouchableOpacityProps {
  groupId: string
}

export function LineGroupsItem({ groupId, ...props }: Props) {
  const groupLines = useLines(useShallow(state => state.lineGroups[groupId]))

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: lineCode }) => (
      <View style={styles.itemContainer}>
        <UiLineCode code={lineCode} />
      </View>
    ),
    [],
  )

  return (
    <TouchableOpacity
      style={styles.container}
      {...props}
    >
      <UiText info>{groupId}</UiText>

      <View style={styles.listContainer}>
        <FlashList
          data={groupLines}
          renderItem={renderItem}
          estimatedItemSize={70}
          horizontal
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 8,
    flex: 1,
  },
  itemContainer: {
    marginHorizontal: 4,
  },
  listContainer: {
    minHeight: 37,
  },
})
