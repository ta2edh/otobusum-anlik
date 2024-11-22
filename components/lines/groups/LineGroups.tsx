import { BottomSheetFlashList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useTheme } from '@/hooks/useTheme'
import { createNewGroup, useFilters } from '@/stores/filters'
import { ListRenderItem } from '@shopify/flash-list'
import { colors } from '@/constants/colors'
import { UiButton } from '@/components/ui/UiButton'
import { LineGroupsItem } from './LineGroupsItem'

import { useShallow } from 'zustand/react/shallow'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { forwardRef, useCallback, useMemo } from 'react'

interface LineGroupsProps extends ViewProps {
  onPressGroup?: (groupId: string) => void
}

export const LineGroups = forwardRef<BottomSheetModal, LineGroupsProps>(function LineGroups(
  { onPressGroup, ...props },
  ref,
) {
  const groups = useFilters(useShallow(state => Object.keys(state.lineGroups)))
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

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: groupId }) => (
      <LineGroupsItem groupId={groupId} onPress={() => onPressGroup?.(groupId)} />
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
              estimatedItemSize={35}
              fadingEdgeLength={40}
            />
          </View>

          <UiButton
            title="Create new group"
            icon="add"
            style={buttonBackground}
            onPress={handlePressNewGroup}
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
