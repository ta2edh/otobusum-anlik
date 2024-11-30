import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { UiButton } from './ui/UiButton'
import { useTheme } from '@/hooks/useTheme'
import { changeRouteDirection, useFilters } from '@/stores/filters'
import { useLines } from '@/stores/lines'

export function TheMapButtons() {
  const insets = useSafeAreaInsets()
  const { colorsTheme } = useTheme()

  const insetStyle: StyleProp<ViewStyle> = {
    top: insets.top,
    right: insets.right,
  }

  const buttonBackgroundStyle: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainerHigh,
  }

  const handleChangeAllDirections = () => {
    const group = useFilters.getState().selectedGroup?.lineCodes || useLines.getState().lines

    for (let index = 0; index < group.length; index++) {
      const lineCode = group[index]
      if (!lineCode) continue

      changeRouteDirection(lineCode)
    }
  }

  return (
    <View style={[styles.container, insetStyle]}>
      <UiButton
        icon="repeat"
        style={[styles.button, buttonBackgroundStyle]}
        onPress={handleChangeAllDirections}
        square
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    padding: 8,
  },
  button: {
    padding: 14,
  },
})
