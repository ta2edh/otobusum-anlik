import { BottomSheetFlashList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { useFilters } from '@/stores/filters'
import { ListRenderItem } from '@shopify/flash-list'

import { UiButton } from './ui/UiButton'
import { UiLineCode } from './ui/UiLineCode'

import { useShallow } from 'zustand/react/shallow'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useCallback, useRef } from 'react'

interface Props {
  code: string
}

export function LineAddGroup(props: Props) {
  const bottomSheetModal = useRef<BottomSheetModal>(null)

  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))
  const groups = useFilters(useShallow(state => Object.keys(state.lineGroups)))
  const createNewGroup = useFilters(state => state.createNewGroup)
  const addLineToGroup = useFilters(state => state.addLineToGroup)

  const { bottomSheetStyle, getSchemeColorHex } = useTheme(lineTheme)

  const handlePressGroup = () => {
    bottomSheetModal.current?.present()
  }

  const renderItem: ListRenderItem<string> = useCallback(({ item }) => {
    const keys = useFilters.getState().lineGroups[item]

    const addToGroup = () => {
      addLineToGroup(props.code, item)
    }

    return (
      <TouchableOpacity onPress={addToGroup} style={styles.itemContainer}>
        {keys?.map(code =>
          <UiLineCode code={code} />,
        )}
      </TouchableOpacity>
    )
  }, [addLineToGroup, props.code])

  return (
    <>
      <UiButton icon="add-circle-outline" onPress={handlePressGroup} />

      <BottomSheetModal
        ref={bottomSheetModal}
        snapPoints={['50%']}
        enableDynamicSizing={false}
        {...bottomSheetStyle}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.listContainer}>
            <BottomSheetFlashList
              data={groups}
              renderItem={renderItem}
              estimatedItemSize={35}
              fadingEdgeLength={40}
              ItemSeparatorComponent={() => <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: 'red' }} />}
            />
          </View>

          <UiButton
            title="Create new group"
            icon="add"
            style={{ backgroundColor: getSchemeColorHex('primary') }}
            onPress={() => createNewGroup(props.code)}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  listContainer: {
    flex: 1,
  },
  itemContainer: {
    padding: 8,
    gap: 8,
    flexDirection: 'row',
  },
})
