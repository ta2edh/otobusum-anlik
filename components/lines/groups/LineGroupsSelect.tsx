import { UiButton } from '@/components/ui/UiButton'
import { useFilters } from '@/stores/filters'
import { StyleSheet, View } from 'react-native'

import { useShallow } from 'zustand/react/shallow'
import { LineGroups } from './LineGroups'
import { useCallback, useRef } from 'react'
import { colors } from '@/constants/colors'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

export function LineGroupsSelect() {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const selectedGroup = useFilters(useShallow(state => state.selectedGroup))
  const selectGroup = useFilters(state => state.selectGroup)

  const handleButtonPress = useCallback(
    () => bottomSheetModal.current?.present(),
    [],
  )

  const handleSelectGroup = useCallback(
    (groupId: string) => selectGroup(groupId),
    [selectGroup],
  )

  return (
    <View style={styles.container}>
      <UiButton
        onPress={handleButtonPress}
        title={selectedGroup || 'Select a group'}
        style={styles.button}
      />

      <LineGroups
        ref={bottomSheetModal}
        onPressGroup={handleSelectGroup}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
  },
})
