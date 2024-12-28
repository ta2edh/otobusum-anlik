import { BottomSheetModal, BottomSheetSectionList, BottomSheetView } from '@gorhom/bottom-sheet'
import { RefObject, useCallback, useMemo } from 'react'
import {
  ListRenderItem,
  SectionListData,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewProps,
} from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiSheetModal } from '@/components/ui/sheet/UiSheetModal'
import { UiButton } from '@/components/ui/UiButton'
import { UiText } from '@/components/ui/UiText'

import { useTheme } from '@/hooks/useTheme'

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
  const { getSchemeColorHex } = useTheme()

  const groups = useLinesStore(useShallow(state => state.lineGroups))

  const data = Object.entries(groups).map(([city, groupsObject]) => ({
    title: city,
    data: Object.values(groupsObject),
  }))

  const headerStyle: StyleProp<TextStyle> = useMemo(
    () => ({
      backgroundColor: getSchemeColorHex('primary'),
      color: getSchemeColorHex('onPrimary'),
      borderRadius: 4,
      padding: 4,
    }),
    [getSchemeColorHex],
  )

  const handlePressNewGroup = useCallback(() => {
    createNewGroup()
  }, [])

  const handlePressGroup = useCallback(
    (group: LineGroup) => {
      onPressGroup?.(group)
      if (!lineCodeToAdd) return

      addLineToGroup(group.id, lineCodeToAdd)
      props.cRef?.current?.dismiss()
    },
    [lineCodeToAdd, props.cRef, onPressGroup],
  )

  const renderItem: ListRenderItem<LineGroup> = useCallback(
    ({ item }) => (
      <LineGroupsItem
        group={item}
        onPress={() => handlePressGroup(item)}
      />
    ),
    [handlePressGroup],
  )

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<LineGroup, (typeof data)[number]> }) => (
      <UiText style={headerStyle}>
        {section.title}
        {' '}
        groups
      </UiText>
    ),
    [headerStyle],
  )

  return (
    <>
      {props.children}

      <UiSheetModal cRef={props.cRef} snapPoints={['50%']} enableDynamicSizing={false}>
        <BottomSheetView style={styles.container}>
          <BottomSheetSectionList
            sections={data}
            renderItem={renderItem}
            fadingEdgeLength={40}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={styles.contentContainer}
          />

          <UiButton icon="add" title={i18n.t('createNewGroup')} onPress={handlePressNewGroup} />
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
  contentContainer: {
    gap: 4,
  },
})
