import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useCallback, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiButton } from '@/components/ui/UiButton'

import { LineGroups } from './LineGroups'

import { colors } from '@/constants/colors'
import { selectGroup, unSelectGroup, useFilters } from '@/stores/filters'
import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/lineGroup'

export function LineGroupsSelect() {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const selectedGroup = useFilters(useShallow(state => state.selectedGroup))

  const handleButtonPress = useCallback(
    () => bottomSheetModal.current?.present(),
    [],
  )

  const handleSelectGroup = useCallback(
    (group: LineGroup) => {
      selectGroup(group)
      bottomSheetModal.current?.close()
    },
    [],
  )

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <UiButton
          onPress={handleButtonPress}
          title={selectedGroup?.title || i18n.t('selectAGroup')}
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
    backgroundColor: colors.primary,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})
