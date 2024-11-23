import { useRouteFilter } from '@/hooks/useRouteFilter'
import { useTheme } from '@/hooks/useTheme'
import { selectRoute, toggleLineVisibility, useFilters } from '@/stores/filters'
import { deleteLine, useLines } from '@/stores/lines'
import { Ionicons } from '@expo/vector-icons'
import { memo, useEffect, useMemo } from 'react'
import {
  useWindowDimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
  Pressable,
  ViewProps,
  StyleSheet,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInLeft,
  AnimatedProps,
} from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UiActivityIndicator } from '../ui/UiActivityIndicator'
import { UiButton } from '../ui/UiButton'
import { UiText } from '../ui/UiText'
import { SelectedLineAnnouncements } from './SelectedLineAnnouncements'
import { SelectedLineBusStops } from './SelectedLineBusStops'
import { SelectedLineRoutes } from './SelectedLineRoutes'

export interface SelectedLineProps extends AnimatedProps<ViewProps> {
  code: string
}

export const SelectedLine = memo(function SelectedLine(props: SelectedLineProps) {
  const selectedRoute = useFilters(useShallow(state => state.selectedRoutes[props.code]))
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))

  const { width } = useWindowDimensions()
  const { getSchemeColorHex } = useTheme(lineTheme)
  const isVisible = useSharedValue(true)

  const {
    findOtherRouteDirection,
    findRouteFromCode,
    getDefaultRoute,
    query: { isPending },
  } = useRouteFilter(props.code)

  useEffect(() => {
    const unsub = useFilters.subscribe(
      state => state.invisibleLines[props.code],
      (newCodes) => {
        isVisible.value = !newCodes
      },
      {
        fireImmediately: true,
      },
    )

    return unsub
  }, [props.code, isVisible])

  const route = selectedRoute ? findRouteFromCode(selectedRoute) : getDefaultRoute()
  const [leftTitle, rightTitle] = route?.route_long_name.trim().split('-') ?? ['', ''] ?? ['', '']

  const handleSwitchRoute = () => {
    if (!selectedRoute) return

    const otherDirection = findOtherRouteDirection(selectedRoute)
    if (!otherDirection || !otherDirection.route_code) return

    selectRoute(props.code, otherDirection.route_code)
  }

  const handleVisibility = () => {
    toggleLineVisibility(props.code)
  }

  const handleDelete = () => {
    deleteLine(props.code)
  }

  const containerStyle: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('primary'),
    width: width - 8 - 8 - 24,
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

  const textStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onPrimary'),
  }

  return (
    <Animated.View
      style={[containerStyle, containerAnimatedStyle, styles.container]}
      key={props.code}
      {...props}
    >
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

      <SelectedLineBusStops code={props.code} routeCode={selectedRoute} />

      {isPending
        ? (
            <UiActivityIndicator size={24} />
          )
        : (
            <Animated.View entering={FadeInLeft} style={styles.routeContainer}>
              <View style={styles.lineButtonsContainer}>
                <UiButton
                  onPress={handleSwitchRoute}
                  icon="repeat"
                  style={buttonContainerStyle}
                  textStyle={textContainerStyle}
                />

                <SelectedLineRoutes
                  code={props.code}
                  style={[buttonContainerStyle, styles.grow]}
                  textStyle={textContainerStyle}
                />
              </View>

              <Pressable
                onPress={handleSwitchRoute}
                style={[styles.lineButtonsContainer, { flexGrow: 1 }]}
              >
                <UiText style={[styles.directionText, textStyle]} numberOfLines={1}>
                  {leftTitle}
                </UiText>
                <Ionicons name="arrow-forward" size={18} color={textStyle.color} />
                <UiText style={[styles.directionText, textStyle]} numberOfLines={1}>
                  {rightTitle}
                </UiText>
              </Pressable>
            </Animated.View>
          )}
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
  lineButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  directionText: {
    flexBasis: 0,
    flexGrow: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  routeContainer: {
    gap: 8,
    flexShrink: 0,
  },
  grow: {
    flexGrow: 1,
  },
})
