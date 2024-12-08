import { BottomSheetFlashList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { ListRenderItem } from '@shopify/flash-list'
import { forwardRef, useCallback } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiSheetModal } from '@/components/ui/sheet/UiSheetModal'
import { UiButton } from '@/components/ui/UiButton'

import { LineGroupsItem } from './LineGroupsItem'

import { createNewGroup, useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/lineGroup'

interface LineGroupsProps extends ViewProps {
  onPressGroup?: (group: LineGroup) => void
}

export const LineGroups = forwardRef<BottomSheetModal, LineGroupsProps>(function LineGroups(
  { onPressGroup, ...props },
  ref,
) {
  const groups = useLinesStore(useShallow(state => Object.values(state.lineGroups)))

  const handlePressNewGroup = useCallback(() => {
    createNewGroup()
  }, [])

  const renderItem: ListRenderItem<LineGroup> = useCallback(
    ({ item }) => (
      <LineGroupsItem group={item} onPress={() => onPressGroup?.(item)} />
    ),
    [onPressGroup],
  )

  return (
    <>
      {props.children}

      <UiSheetModal
        ref={ref}
        snapPoints={['50%']}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.listContainer}>
            <BottomSheetFlashList
              data={groups}
              renderItem={renderItem}
              estimatedItemSize={80}
              fadingEdgeLength={40}
            />
          </View>

          <UiButton
            icon="add"
            title={i18n.t('createNewGroup')}
            onPress={handlePressNewGroup}
          />
        </BottomSheetView>
      </UiSheetModal>
    </>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
})
