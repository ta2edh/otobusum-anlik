import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Ionicons } from '@expo/vector-icons'
import { useCallback, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  AnimatedProps,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'
import * as Location from 'expo-location'

import { useTheme } from '@/hooks/useTheme'
import { useMap } from '@/hooks/contexts/useMap'

import { LineGroups } from './lines/line/LineGroups'
import { UiButton } from './ui/UiButton'

import { changeRouteDirection, selectGroup, unSelectGroup, useFiltersStore } from '@/stores/filters'
import { getLines, getTheme, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { useSettingsStore } from '@/stores/settings'
import { LineGroup } from '@/types/lineGroup'

export const TheMapButtons = () => {
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))
  const selectedGroup = useFiltersStore(state => state.selectedGroup)
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))
  const mapRef = useMap()

  const lineGroups = useLinesStore(useShallow(state => Object.keys(state.lineGroups[selectedCity])))
  const lines = useLinesStore(useShallow(() => getLines()))

  const { colorScheme, schemeDefault } = useTheme()

  const bgColor = useSharedValue(schemeDefault.surface)
  const txtColor = useSharedValue(schemeDefault.onSurface)
  const bottomSheetModalGroups = useRef<BottomSheetModal>(null)

  // Simple and reliable user location centering
  const centerOnUserLocation = async () => {
    console.log('🎯 Center button pressed')
    
    if (!mapRef?.current) {
      console.log('❌ Map ref not available')
      return
    }
    
    // Just use the map's built-in method
    mapRef.current.animateToUserLocation()
  }

  const updateColors = useCallback(
    (index: number) => {
      const lineCode = lines.at(index)
      if (lineCode === undefined) return

      const theme = getTheme(lineCode)
      if (!theme) return

      const scheme = theme[colorScheme]

      const targetBackground = scheme.surface
      const targetText = scheme.onSurface

      bgColor.value = withTiming(targetBackground)
      txtColor.value = withTiming(targetText)
    },
    [bgColor, colorScheme, lines, txtColor],
  )

  useEffect(() => {
    const unsub = useMiscStore.subscribe(
      state => state.scrolledLineIndex,
      (index) => {
        updateColors(index)
      },
      {
        fireImmediately: true,
      },
    )

    return unsub
  }, [updateColors])

  useEffect(() => {
    updateColors(0)
  }, [selectedGroup, updateColors, lines])

  const handleChangeAllDirections = () => {
    for (let index = 0; index < lines.length; index++) {
      const lineCode = lines[index]
      if (!lineCode) continue

      changeRouteDirection(lineCode)
    }
  }

  const handleLineGroupsSelect = () => {
    bottomSheetModalGroups.current?.present()
  }

  const handlePressGroup = (group: LineGroup) => {
    selectGroup(group.id)
    bottomSheetModalGroups.current?.dismiss()
  }

  const animatedContainerStyle = useAnimatedStyle(
    () => ({
      backgroundColor: bgColor.value,
      borderRadius: 14,
      elevation: 5,
    }),
    [],
  )

  const animatedIconProps = useAnimatedProps(() => {
    return {
      color: txtColor.value,
    } as Partial<AnimatedProps<typeof Ionicons>>
  })

  return (
    <View style={styles.container}>
      {lines.length > 0 && (
        <Animated.View style={animatedContainerStyle}>
          <UiButton
            icon="repeat"
            onPress={handleChangeAllDirections}
            animatedIconProps={animatedIconProps}
            variant="ghost"
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
              animatedIconProps={animatedIconProps}
              variant="ghost"
              square
            />
          </Animated.View>

          {!!selectedGroup && (
            <Animated.View style={animatedContainerStyle}>
              <UiButton
                icon="close"
                onPress={unSelectGroup}
                animatedIconProps={animatedIconProps}
                variant="ghost"
                square
              />
            </Animated.View>
          )}

          <LineGroups cRef={bottomSheetModalGroups} onPressGroup={handlePressGroup} />
        </>
      )}

      {showMyLocation && (
        <Animated.View style={animatedContainerStyle}>
          <UiButton
            icon="locate"
            onPress={centerOnUserLocation}
            animatedIconProps={animatedIconProps}
            variant="ghost"
            square
          />
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignSelf: 'flex-end',
    gap: 8,
    marginHorizontal: 8,
  },
})
