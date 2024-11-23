import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { memo, useCallback, useRef } from 'react'

import { UiText } from './ui/UiText'
import { LineGroups } from './lines/groups/LineGroups'
import { UiLineCode } from './ui/UiLineCode'
import { UiButton } from './ui/UiButton'

import { SearchResult } from '@/api/getSearchResults'
import { addLine, addLineToGroup } from '@/stores/lines'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { LineGroup } from '@/types/lineGroup'

interface Props extends TouchableOpacityProps {
  item: SearchResult
}

export const TheSearchItem = memo(function SearchItem(props: Props) {
  const bottomSheetModal = useRef<BottomSheetModal>(null)

  const handlePress = () => {
    addLine(props.item.Code)
  }

  const handleAddPress = () => {
    bottomSheetModal.current?.present()
  }

  const handleGroupSelect = useCallback((group: LineGroup) => {
    addLineToGroup(group.id, props.item.Code)
    bottomSheetModal.current?.close()
  }, [props.item.Code])

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
    >
      <View style={styles.title}>
        <UiLineCode code={props.item.Code} />
        <UiText>{props.item.Name}</UiText>
      </View>

      <LineGroups ref={bottomSheetModal} onPressGroup={handleGroupSelect}>
        <UiButton icon="add-circle-outline" onPress={handleAddPress} />
      </LineGroups>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 4,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
})
