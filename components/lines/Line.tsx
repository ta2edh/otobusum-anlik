import { memo, useCallback, useEffect, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import Animated, {
  AnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from '@/hooks/queries/useLine'
import { useTheme } from '@/hooks/useTheme'

import { UiButton } from '../ui/UiButton'
import { UiText } from '../ui/UiText'

import { LineAnnouncementsMemoized } from './LineAnnouncements'
import { LineBusStops } from './LineBusStops'
import { LineRouteDirection } from './routes/LineRouteDirection'
import { LineRoutes } from './routes/LineRoutes'

import { changeRouteDirection } from '@/stores/filters'
import { deleteLine, useLinesStore } from '@/stores/lines'
import { toggleLineVisibility, useMiscStore } from '@/stores/misc'

export interface LineProps extends AnimatedProps<ViewProps> {
  lineCode: string
}

const Line = ({ style, ...props }: LineProps) => {
  const lineTheme = useLinesStore(useShallow(state => state.lineTheme[props.lineCode]))

  const { getSchemeColorHex } = useTheme(lineTheme)
  const { lineWidth } = useLine(props.lineCode)

  const isVisible = useSharedValue(true)

  useEffect(() => {
    const unsub = useMiscStore.subscribe(
      state => state.invisibleLines,
      (newCodes) => {
        isVisible.value = !newCodes.includes(props.lineCode)
      },
      {
        fireImmediately: true,
      },
    )

    return unsub
  }, [props.lineCode, isVisible])

  const handleVisibility = () => {
    toggleLineVisibility(props.lineCode)
  }

  const handleDelete = () => {
    deleteLine(props.lineCode)
  }

  const containerStyle: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('primary'),
    width: lineWidth,
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

  const handleSwitchRoute = useCallback(() => {
    changeRouteDirection(props.lineCode)
  }, [props.lineCode])

  return (
    <Animated.View
      style={[containerStyle, containerAnimatedStyle, styles.container, style]}
      key={props.lineCode}
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
          {props.lineCode}
        </UiText>

        <View style={styles.titleContainer}>
          <UiButton
            onPress={handleVisibility}
            theme={lineTheme}
            icon="eye-outline"
          />

          <LineAnnouncementsMemoized code={props.lineCode} style={buttonContainerStyle} />

          <UiButton
            onPress={handleDelete}
            icon="trash-outline"
            theme={lineTheme}
          />
        </View>
      </View>

      <LineBusStops code={props.lineCode} />

      <View style={styles.lineButtonsContainer}>
        <UiButton onPress={handleSwitchRoute} icon="repeat" theme={lineTheme} />
        <LineRoutes lineCode={props.lineCode} />
      </View>

      <LineRouteDirection lineCode={props.lineCode} />
    </Animated.View>
  )
}

export const LineMemoized = memo(Line)

const styles = StyleSheet.create({
  container: {
    padding: 12,
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
  lineButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexGrow: 1,
  },
})
