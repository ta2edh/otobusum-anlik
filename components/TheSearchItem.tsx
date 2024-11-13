import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'
import { UiText } from './ui/UiText'
import { SearchResult } from '@/api/getSearchResults'
import { useState, memo } from 'react'
import { useLines } from '@/stores/lines'
import { useShallow } from 'zustand/react/shallow'
import { UiActivityIndicator } from './ui/UiActivityIndicator'

interface Props extends TouchableOpacityProps {
  item: SearchResult
  onPress?: () => void
}

export const TheSearchItem = memo(function SearchItem(props: Props) {
  const [isPending, setIsPending] = useState(false)

  const lineColor = useLines(useShallow(state => state.lineTheme[props.item.Code]))
  const addLine = useLines(state => state.addLine)

  const isInLines = lineColor !== undefined

  const handlePress = async () => {
    props.onPress?.()
    setIsPending(true)

    try {
      await addLine(props.item)
    }
    finally {
      setIsPending(false)
    }
  }

  return (
    <TouchableOpacity
      style={[styles.container, { opacity: isInLines ? 0.4 : 1 }]}
      disabled={isInLines}
      onPress={handlePress}
    >
      <UiText style={[styles.renderCode]}>
        {isPending ? <UiActivityIndicator /> : props.item.Code}
      </UiText>
      <UiText>{props.item.Name}</UiText>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  renderCode: {
    borderRadius: 999,
    padding: 9,
    minWidth: 70,
    textAlign: 'center',
  },
})
