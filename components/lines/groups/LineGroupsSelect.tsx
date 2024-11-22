import { UiButton } from '@/components/ui/UiButton'
import { selectGroup, useFilters } from '@/stores/filters'
import { colors } from '@/constants/colors'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

import { StyleSheet, View } from 'react-native'
import { useCallback, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { LineGroups } from './LineGroups'

export function LineGroupsSelect() {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const selectedGroup = useFilters(useShallow(state => state.selectedGroup))

  const handleButtonPress = useCallback(
    () => bottomSheetModal.current?.present(),
    [],
  )

  const handleSelectGroup = useCallback(
    (groupId: string) => selectGroup(groupId),
    [],
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
