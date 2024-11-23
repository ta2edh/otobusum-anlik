import { UiButton } from '@/components/ui/UiButton'
import { selectGroup, unSelectGroup, useFilters } from '@/stores/filters'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { LineGroups } from './LineGroups'

import { StyleSheet, View } from 'react-native'
import { useCallback, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'

export function LineGroupsSelect() {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const selectedGroup = useFilters(useShallow(state => state.selectedGroup))

  const handleButtonPress = useCallback(
    () => bottomSheetModal.current?.present(),
    [],
  )

  const handleSelectGroup = useCallback(
    (groupId: string) => {
      selectGroup(groupId)
      bottomSheetModal.current?.close()
    },
    [],
  )

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <UiButton
          onPress={handleButtonPress}
          title={selectedGroup || 'Select a group'}
          style={styles.button}
        />
        {selectedGroup && (
          <UiButton
            onPress={unSelectGroup}
            icon="close"
            style={styles.button}
          />
        )}
      </View>

      <LineGroups
        ref={bottomSheetModal}
        onPressGroup={handleSelectGroup}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttons: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})
