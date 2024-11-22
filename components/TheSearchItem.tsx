import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { memo, useCallback, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { UiText } from './ui/UiText'
import { LineGroups } from './lines/groups/LineGroups'
import { UiLineCode } from './ui/UiLineCode'

import { SearchResult } from '@/api/getSearchResults'
import { useLines } from '@/stores/lines'
import { UiButton } from './ui/UiButton'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useFilters } from '@/stores/filters'

interface Props extends TouchableOpacityProps {
  item: SearchResult
}

export const TheSearchItem = memo(function SearchItem(props: Props) {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const [isLoading, setIsLoading] = useState(false)

  const lineTheme = useLines(useShallow(state => state.lineTheme[props.item.Code]))
  const addLineToGroup = useFilters(state => state.addLineToGroup)
  const addLine = useLines(state => state.addLine)

  const isInLines = lineTheme !== undefined

  // const getBusLocations = async () => {

  // }

  // const handlePress = async () => {
  //   setIsLoading(true)

  //   try {
  //     await addLine(props.item)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const handlePress = () => {
    addLine(props.item.Code)
  }

  const handleAddPress = useCallback(() => {
    bottomSheetModal.current?.present()
  }, [])

  const handleGroupSelect = useCallback((groupId: string) => {
    addLineToGroup(props.item.Code, groupId)
  }, [addLineToGroup, props.item.Code])

  return (
    <TouchableOpacity style={styles.container} disabled={isInLines} onPress={handlePress}>
      <View style={styles.title}>
        <UiLineCode code={props.item.Code} isLoading={isLoading} />
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
