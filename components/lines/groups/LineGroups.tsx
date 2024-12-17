import { BottomSheetFlashList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { ListRenderItem } from '@shopify/flash-list'
import { RefObject, useCallback } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiSheetModal } from '@/components/ui/sheet/UiSheetModal'
import { UiButton } from '@/components/ui/UiButton'

import { LineGroupsItem } from './LineGroupsItem'

import { addLineToGroup, createNewGroup, useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/lineGroup'

interface LineGroupsProps extends ViewProps {
  onPressGroup?: (group: LineGroup) => void
  cRef?: RefObject<BottomSheetModal>
  lineCodeToAdd?: string
}

export const LineGroups = ({ onPressGroup, lineCodeToAdd, ...props }: LineGroupsProps) => {
  const groups = useLinesStore(useShallow(state => Object.values(state.lineGroups)))

  const handlePressNewGroup = useCallback(() => {
    createNewGroup()
  }, [])

  const handlePressGroup = useCallback((group: LineGroup) => {
    if (!lineCodeToAdd) return

    addLineToGroup(group.id, lineCodeToAdd)
    props.cRef?.current?.dismiss()
  }, [lineCodeToAdd, props.cRef])

  const renderItem: ListRenderItem<LineGroup> = useCallback(
    ({ item }) => (
      <LineGroupsItem group={item} onPress={() => handlePressGroup(item)} />
    ),
    [handlePressGroup],
  )

  return (
    <>
      {props.children}

      <UiSheetModal
        cRef={props.cRef}
        snapPoints={['50%']}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.container}>
          <BottomSheetFlashList
            data={groups}
            renderItem={renderItem}
            estimatedItemSize={80}
            fadingEdgeLength={40}
          />

          <UiButton
            icon="add"
            title={i18n.t('createNewGroup')}
            onPress={handlePressNewGroup}
          />
        </BottomSheetView>
      </UiSheetModal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    paddingTop: 0,
  },
  listContainer: {
    flex: 1,
  },
})
