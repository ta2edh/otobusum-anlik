import { useMemo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const extraPadding = 12

export function usePaddings(removeInsetPaddings: boolean = false) {
  const insets = useSafeAreaInsets()

  const paddings: StyleProp<ViewStyle> = useMemo(() => {
    if (removeInsetPaddings) {
      return {
        paddingTop: extraPadding,
        paddingBottom: extraPadding,
        paddingLeft: extraPadding,
        paddingRight: extraPadding,
      }
    }

    return {
      paddingTop: insets.top + extraPadding,
      paddingBottom: insets.bottom + extraPadding,
      paddingLeft: insets.left + extraPadding,
      paddingRight: insets.right + extraPadding,
    }
  }, [insets, removeInsetPaddings])

  return paddings
}
