import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { memo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { UiText } from './ui/UiText'
import { LineAddGroup } from './LineAddGroup'
import { UiLineCode } from './ui/UiLineCode'

import { SearchResult } from '@/api/getSearchResults'
import { useLines } from '@/stores/lines'

interface Props extends TouchableOpacityProps {
  item: SearchResult
}

export const TheSearchItem = memo(function SearchItem(props: Props) {
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.item.Code]))
  const addLine = useLines(state => state.addLine)
  const [isLoading, setIsLoading] = useState(false)

  const isInLines = lineTheme !== undefined

  const handlePress = async () => {
    setIsLoading(true)

    try {
      await addLine(props.item)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TouchableOpacity style={styles.container} disabled={isInLines} onPress={handlePress}>
      <View style={styles.title}>
        <UiLineCode code={props.item.Code} isLoading={isLoading} />
        <UiText>{props.item.Name}</UiText>
      </View>

      <LineAddGroup code={props.item.Code} />
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
