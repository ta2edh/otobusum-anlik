import { memo, useEffect, useMemo } from 'react'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'
import Animated, {
  AnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useTheme } from '@/hooks/useTheme'

import { UiButton } from '../ui/UiButton'
import { UiText } from '../ui/UiText'

import { SelectedLineRoutesContainer } from './routes/SelectedLineRoutesContainer'
import { SelectedLineAnnouncements } from './SelectedLineAnnouncements'
import { SelectedLineBusStops } from './SelectedLineBusStops'

import { selectedLineWidth } from '@/constants/width'
import { deleteLine, useLinesStore } from '@/stores/lines'
import { toggleLineVisibility, useMiscStore } from '@/stores/misc'

export interface SelectedLineProps extends AnimatedProps<ViewProps> {
  code: string
}

export const SelectedLine = memo(function SelectedLine({ style, ...props }: SelectedLineProps) {
  const lineTheme = useLinesStore(useShallow(state => state.lineTheme[props.code]))

  const { getSchemeColorHex } = useTheme(lineTheme)
  const isVisible = useSharedValue(true)

  useEffect(() => {
    const unsub = useMiscStore.subscribe(
      state => state.invisibleLines,
      (newCodes) => {
        isVisible.value = !newCodes.includes(props.code)
      },
      {
        fireImmediately: true,
      },
    )

    return unsub
  }, [props.code, isVisible])

  const handleVisibility = () => {
    toggleLineVisibility(props.code)
  }

  const handleDelete = () => {
    deleteLine(props.code)
  }

  const containerStyle: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('primary'),
    width: selectedLineWidth,
  }

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible.value ? 1 : 0.4),
  }))

  const buttonContainerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: getSchemeColorHex('secondaryContainer'),
    }),
    [getSchemeColorHex],
  )

  const textContainerStyle: StyleProp<TextStyle> = useMemo(
    () => ({
      color: getSchemeColorHex('onSecondaryContainer'),
    }),
    [getSchemeColorHex],
  )

  return (
    <Animated.View
      style={[containerStyle, containerAnimatedStyle, styles.container, style]}
      key={props.code}
      {...props}
    >
      {/* {isRefetching && (
        <UiActivityIndicator
          color={getSchemeColorHex('onPrimary')}
          size={50}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0.2,
          }}
        />
      )} */}

      <View style={styles.titleContainer}>
        <UiText
          style={{
            fontWeight: 'bold',
            fontSize: 24,
            letterSpacing: 2,
            color: getSchemeColorHex('onPrimary'),
          }}
        >
          {props.code}
        </UiText>

        <View style={styles.titleContainer}>
          <UiButton
            onPress={handleVisibility}
            style={buttonContainerStyle}
            icon="eye-outline"
            textStyle={textContainerStyle}
          />

          <SelectedLineAnnouncements code={props.code} style={buttonContainerStyle} />

          <UiButton
            onPress={handleDelete}
            style={buttonContainerStyle}
            icon="trash-outline"
            textStyle={textContainerStyle}
          />
        </View>
      </View>

      <SelectedLineBusStops code={props.code} />
      <SelectedLineRoutesContainer code={props.code} />
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 8,
    gap: 8,
    flexShrink: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
})
