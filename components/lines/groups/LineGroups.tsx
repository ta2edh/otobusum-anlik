import { BottomSheetFlashList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { createNewGroup, useLines } from '@/stores/lines'
import { ListRenderItem } from '@shopify/flash-list'
import { LineGroupsItem } from './LineGroupsItem'

import { LineGroup } from '@/types/lineGroup'
import { UiButton } from '@/components/ui/UiButton'
import { useTheme } from '@/hooks/useTheme'
import { colors } from '@/constants/colors'

import { useShallow } from 'zustand/react/shallow'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { forwardRef, useCallback, useMemo } from 'react'
import { i18n } from '@/translations/i18n'

interface LineGroupsProps extends ViewProps {
  onPressGroup?: (group: LineGroup) => void
}

export const LineGroups = forwardRef<BottomSheetModal, LineGroupsProps>(function LineGroups(
  { onPressGroup, ...props },
  ref,
) {
  const groups = useLines(useShallow(state => state.lineGroups))
  const { bottomSheetStyle, getSchemeColorHex } = useTheme()

  const buttonBackground: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: getSchemeColorHex('primary') || colors.primary,
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

      <BottomSheetModal
        ref={ref}
        snapPoints={['50%']}
        enableDynamicSizing={false}
        {...bottomSheetStyle}
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
      </BottomSheetModal>
    </>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  listContainer: {
    flex: 1,
  },
})
