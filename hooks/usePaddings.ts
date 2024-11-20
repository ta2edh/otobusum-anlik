import { useMemo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StyleProp, ViewStyle } from 'react-native'

export function usePaddings() {
  const insets = useSafeAreaInsets()

  const extraPadding = 8
  const paddings: StyleProp<ViewStyle> = useMemo(() => ({
    paddingTop: insets.top + extraPadding,
    paddingBottom: insets.bottom + extraPadding,
    paddingLeft: insets.left + extraPadding,
    paddingRight: insets.right + extraPadding,
  }), [insets])

  return paddings
}
