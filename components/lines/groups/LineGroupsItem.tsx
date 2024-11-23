import { UiLineCode } from '@/components/ui/UiLineCode'
import { UiText } from '@/components/ui/UiText'
import { FlashList, ListRenderItem } from '@shopify/flash-list'

import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { useCallback } from 'react'
import { useLines } from '@/stores/lines'
import { router } from 'expo-router'

interface Props extends TouchableOpacityProps {
  groupId: string
}

export function LineGroupsItem({ groupId, ...props }: Props) {
  const groupLines = useLines(useShallow(state => state.lineGroups[groupId]))

  const handleLongPress = useCallback(
    () => {
      router.navigate({ pathname: '/group/[groupId]/edit', params: { groupId } })
    },
    [groupId],
  )

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: lineCode }) => (
      <View style={styles.itemContainer}>
        <UiLineCode code={lineCode} />
      </View>
    ),
    [],
  )

  const emptyItem = useCallback(
    () => <UiText info>This group is empty</UiText>,
    [],
  )

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={handleLongPress}
      {...props}
    >
      <UiText info>{groupId}</UiText>

      <View>
        <FlashList
          data={groupLines}
          renderItem={renderItem}
          estimatedItemSize={70}
          ListEmptyComponent={emptyItem}
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
})
