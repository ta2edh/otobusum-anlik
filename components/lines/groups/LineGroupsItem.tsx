import { UiLineCode } from '@/components/ui/UiLineCode'
import { UiText } from '@/components/ui/UiText'
import { FlashList, ListRenderItem } from '@shopify/flash-list'

import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { useCallback } from 'react'
import { router } from 'expo-router'
import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import { LineGroup } from '@/types/lineGroup'
import { i18n } from '@/translations/i18n'

interface Props extends TouchableOpacityProps {
  group: LineGroup
}

export function LineGroupsItem({ group, ...props }: Props) {
  const { dismiss } = useBottomSheetModal()

  const handleLongPress = useCallback(
    () => {
      router.navigate({ pathname: '/group/[groupId]/edit', params: { groupId: group.id } })
      dismiss()
    },
    [dismiss, group.id],
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
    () => <UiText info>{i18n.t('emptyGroup')}</UiText>,
    [],
  )

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={handleLongPress}
      {...props}
    >
      <UiText info>{group?.title}</UiText>

      <View>
        <FlashList
          data={group?.lineCodes}
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
