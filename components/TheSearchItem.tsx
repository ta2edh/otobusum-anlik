import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { memo, useCallback, useRef } from 'react'

import { UiText } from './ui/UiText'
import { LineGroups } from './lines/groups/LineGroups'
import { UiLineCode } from './ui/UiLineCode'
import { UiButton } from './ui/UiButton'

import { addLine, addLineToGroup } from '@/stores/lines'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { LineGroup } from '@/types/lineGroup'
import { BusLine, BusStop } from '@/types/bus'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface Props extends TouchableOpacityProps {
  item: BusStop | BusLine
}

function isStop(item: BusStop | BusLine): item is BusStop {
  return (item as BusStop).stop_code !== undefined
}

export const TheSearchItem = memo(function SearchItem(props: Props) {
  const bottomSheetModal = useRef<BottomSheetModal>(null)

  const handlePress = () => {
    if (isStop(props.item)) return
    addLine(props.item.code)
  }

  const handleAddPress = () => {
    bottomSheetModal.current?.present()
  }

  const handleGroupSelect = useCallback((group: LineGroup) => {
    if (isStop(props.item)) return

    addLineToGroup(group.id, props.item.code)
    bottomSheetModal.current?.close()
  }, [props.item])

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
    >
      <View style={styles.title}>
        {isStop(props.item)
          ? (
              <>
                <UiLineCode code="">
                  <MaterialCommunityIcons name="bus-stop" size={20} />
                </UiLineCode>
                <UiText>{props.item.stop_name}</UiText>
              </>
            )
          : (
              <>
                <UiLineCode code={props.item.code} />
                <UiText>{props.item.title}</UiText>
              </>
            )}
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
