import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import { FlashList, ListRenderItem } from '@shopify/flash-list'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'

import { UiButton } from '@/components/ui/UiButton'
import { UiLineCode } from '@/components/ui/UiLineCode'
import { UiText } from '@/components/ui/UiText'

import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/lineGroup'

interface Props extends TouchableOpacityProps {
  group: LineGroup
}

export const LineGroupsItem = ({ group, ...props }: Props) => {
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
      <View style={styles.content}>
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
      </View>

      <UiButton
        icon="pencil"
        onPress={handleLongPress}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 14,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  itemContainer: {
    marginHorizontal: 4,
  },
})
