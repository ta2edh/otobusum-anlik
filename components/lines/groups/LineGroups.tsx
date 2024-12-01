import { BottomSheetFlashList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { ListRenderItem } from '@shopify/flash-list'
import { forwardRef, useCallback, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiSheetModal } from '@/components/ui/sheet/UiSheetModal'
import { UiButton } from '@/components/ui/UiButton'

import { useTheme } from '@/hooks/useTheme'

import { LineGroupsItem } from './LineGroupsItem'

import { colors } from '@/constants/colors'
import { createNewGroup, useLines } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/lineGroup'

interface LineGroupsProps extends ViewProps {
  onPressGroup?: (group: LineGroup) => void
}

export const LineGroups = forwardRef<BottomSheetModal, LineGroupsProps>(function LineGroups(
  { onPressGroup, ...props },
  ref,
) {
  const groups = useLines(useShallow(state => Object.values(state.lineGroups)))
  const { getSchemeColorHex } = useTheme()

  const buttonBackground: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: getSchemeColorHex('primary') || colors.primary,
      margin: 14,
    }),
    [getSchemeColorHex],
  )

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
            title={i18n.t('createNewGroup')}
            icon="add"
            style={buttonBackground}
            onPress={handlePressNewGroup}
            textStyle={{ color: 'white' }}
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
