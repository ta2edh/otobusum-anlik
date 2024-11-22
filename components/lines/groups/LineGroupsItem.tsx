import { UiLineCode } from '@/components/ui/UiLineCode'
import { UiText } from '@/components/ui/UiText'
import { useFilters } from '@/stores/filters'
import { FlashList, ListRenderItem } from '@shopify/flash-list'

import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { useCallback } from 'react'

interface Props extends TouchableOpacityProps {
  groupId: string
}

export function LineGroupsItem({ groupId, ...props }: Props) {
  const groupLines = useFilters(useShallow(state => state.lineGroups[groupId]))

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
      <FlashList
        data={groupLines}
        renderItem={renderItem}
        estimatedItemSize={78}
        horizontal
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 8,
  },
  itemContainer: {
    marginHorizontal: 4,
  },
})
