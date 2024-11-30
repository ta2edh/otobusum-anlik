import { hexFromArgb } from '@material/material-color-utilities'
import { useEffect } from 'react'
import { StyleProp, StyleSheet, useColorScheme, View, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { UiButton } from './ui/UiButton'

import { changeRouteDirection, useFilters } from '@/stores/filters'
import { useLines } from '@/stores/lines'
import { useMisc } from '@/stores/misc'

export function TheMapButtons() {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const bgColor = useSharedValue('#ffffff')
  const txtColor = useSharedValue('#ffffff')

  useEffect(() => {
    const unsub = useMisc.subscribe(state => state.selectedLineScrollIndex, (index) => {
      const lineCode = useLines.getState().lines.at(index)
      if (lineCode === undefined) return

      const theme = useLines.getState().lineTheme[lineCode]
      if (!theme) return

      const scheme = theme.schemes[colorScheme || 'dark']

      const targetBackground = hexFromArgb(scheme.primary)
      const targetText = hexFromArgb(scheme.onPrimary)

      bgColor.value = withTiming(targetBackground)
      txtColor.value = withTiming(targetText)
    }, {
      fireImmediately: true,
    })

    return unsub
  }, [bgColor, txtColor, colorScheme])

  const insetStyle: StyleProp<ViewStyle> = {
    top: insets.top,
    right: insets.right,
  }

  const handleChangeAllDirections = () => {
    const group = useFilters.getState().selectedGroup?.lineCodes || useLines.getState().lines

    for (let index = 0; index < group.length; index++) {
      const lineCode = group[index]
      if (!lineCode) continue

      changeRouteDirection(lineCode)
    }
  }

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: bgColor.value,
    }
  })

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: txtColor.value,
    }
  })

  return (
    <View style={[styles.container, insetStyle]}>
      <Animated.View style={[styles.button, animatedContainerStyle]}>
        <UiButton
          icon="repeat"
          onPress={handleChangeAllDirections}
          textStyle={animatedTextStyle}
          iconSize="lg"
          square
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    padding: 14,
  },
  button: {
    padding: 12,
    paddingHorizontal: 6,
    borderRadius: 14,
  },
})
