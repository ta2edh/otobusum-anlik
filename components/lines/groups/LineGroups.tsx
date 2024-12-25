import { BottomSheetFlashList, BottomSheetModal, BottomSheetSectionList, BottomSheetView } from '@gorhom/bottom-sheet'
// import { ListRenderItem } from '@shopify/flash-list'
import { RefObject, useCallback } from 'react'
import { ListRenderItem, StyleSheet, ViewProps } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiSheetModal } from '@/components/ui/sheet/UiSheetModal'
import { UiButton } from '@/components/ui/UiButton'
import { UiText } from '@/components/ui/UiText'

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
  const groups = useLinesStore(useShallow(state => state.lineGroups))

  const data = Object.entries(groups)
    .map(([key, value]) => ({
      title: key,
      data: Object.values(value),
    }))

  const handlePressNewGroup = useCallback(() => {
    createNewGroup()
  }, [])

  const handlePressGroup = useCallback((group: LineGroup) => {
    if (!lineCodeToAdd) return

    // addLineToGroup(group.id, lineCodeToAdd)
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
          {/* <BottomSheetFlashList
            data={groups}
            renderItem={renderItem}
            estimatedItemSize={80}
            fadingEdgeLength={40}
          /> */}

          <BottomSheetSectionList
            sections={data}
            renderItem={renderItem}
            renderSectionHeader={() => (
              <UiText>aslkdhj</UiText>
            )}
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
