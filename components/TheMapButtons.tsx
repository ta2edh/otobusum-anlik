import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { hexFromArgb } from '@material/material-color-utilities'
import { useEffect, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@/hooks/useTheme'

import { LineGroups } from './lines/groups/LineGroups'
import { UiButton } from './ui/UiButton'

import { changeRouteDirection, selectGroup, unSelectGroup, useFilters } from '@/stores/filters'
import { useLines } from '@/stores/lines'
import { useMisc } from '@/stores/misc'
import { LineGroup } from '@/types/lineGroup'

export function TheMapButtons() {
  const lines = useLines(state => state.lines)
  const lineGroups = useLines(state => state.lineGroups)
  const selectedGroup = useFilters(state => state.selectedGroup)

  const insets = useSafeAreaInsets()
  const bgColor = useSharedValue('#ffffff')
  const txtColor = useSharedValue('#ffffff')
  const bottomSheetModalGroups = useRef<BottomSheetModal>(null)
  const { mode } = useTheme()

  useEffect(() => {
    const unsub = useMisc.subscribe(state => state.selectedLineScrollIndex, (index) => {
      const lineCode = useLines.getState().lines.at(index)
      if (lineCode === undefined) return

      const theme = useLines.getState().lineTheme[lineCode]
      if (!theme) return

      const scheme = theme.schemes[mode]

      const targetBackground = hexFromArgb(scheme.primary)
      const targetText = hexFromArgb(scheme.onPrimary)

      bgColor.value = withTiming(targetBackground)
      txtColor.value = withTiming(targetText)
    }, {
      fireImmediately: true,
    })

    return unsub
  }, [bgColor, txtColor, mode])

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

  const handleLineGroupsSelect = () => {
    bottomSheetModalGroups.current?.present()
  }

  const handlePressGroup = (group: LineGroup) => {
    selectGroup(group)
    bottomSheetModalGroups.current?.close()
  }

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: bgColor.value,
      // padding: 12,
      // paddingHorizontal: 6,
      borderRadius: 14,
    }
  })

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: txtColor.value,
    }
  })

  return (
    <View style={[styles.container, insetStyle]}>
      {lines.length > 0 && (
        <Animated.View style={animatedContainerStyle}>
          <UiButton
            icon="repeat"
            onPress={handleChangeAllDirections}
            textStyle={animatedTextStyle}
            square
          />
        </Animated.View>
      )}

      {lineGroups.length > 0 && (
        <>
          <Animated.View style={animatedContainerStyle}>
            <UiButton
              icon="albums"
              onPress={handleLineGroupsSelect}
              textStyle={animatedTextStyle}
              square
            />
          </Animated.View>

          {
            !!selectedGroup && (
              <Animated.View style={animatedContainerStyle}>
                <UiButton
                  icon="close"
                  onPress={unSelectGroup}
                  textStyle={animatedTextStyle}
                  square
                />
              </Animated.View>
            )
          }

          <LineGroups
            ref={bottomSheetModalGroups}
            onPressGroup={handlePressGroup}
          />
        </>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    padding: 14,
    gap: 8,
  },
})
