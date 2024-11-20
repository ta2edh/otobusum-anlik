import { useLines } from '@/stores/lines'
import { useFilters } from '@/stores/filters'

import { UiText } from '../ui/UiText'
import { UiButton } from '../ui/UiButton'
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  useWindowDimensions,
  ListRenderItem,
  TextStyle,
  ViewProps,
  FlatList,
} from 'react-native'
import Animated, {
  AnimatedProps,
  FadeInLeft,
  FlatListPropsWithLayout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useCallback, memo, useEffect, useMemo, forwardRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Ionicons from '@expo/vector-icons/Ionicons'

import { UiActivityIndicator } from '../ui/UiActivityIndicator'
import { SelectedLineBusStops } from './SelectedLineBusStops'
import { SelectedLineAnnouncements } from './SelectedLineAnnouncements'
import { SelectedLineRoutes } from './SelectedLineRoutes'
import { useRouteFilter } from '@/hooks/useRouteFilter'
import { useTheme } from '@/hooks/useTheme'

interface Props extends AnimatedProps<ViewProps> {
  code: string
}

export const SelectedLine = memo(function SelectedLine(props: Props) {
  const selectedRoute = useFilters(useShallow(state => state.selectedRoutes[props.code]))
  const setRoute = useFilters(useShallow(state => state.setRoute))
  const toggleInvisibleRoute = useFilters(useShallow(state => state.toggleInvisibleRoute))

  const deleteLine = useLines(useShallow(state => state.deleteLine))
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))

  const { width } = useWindowDimensions()
  const { getSchemeColorHex } = useTheme(lineTheme)
  const isVisible = useSharedValue(true)

  const {
    findOtherRouteDirection,
    findRouteFromCode,
    query: { isPending },
  } = useRouteFilter(props.code)

  useEffect(() => {
    const unsub = useFilters.subscribe(
      state => state.invisibleRoutes[props.code],
      (newCodes) => {
        isVisible.value = !newCodes
      },
      {
        fireImmediately: true,
      },
    )

    return unsub
  }, [props.code, isVisible])

  const route = selectedRoute ? findRouteFromCode(selectedRoute) : undefined
  const [leftTitle, rightTitle] = route?.route_long_name.trim().split('-') ?? ['', ''] ?? ['', '']

  const handleSwitchRoute = () => {
    if (!selectedRoute) return

    const otherDirection = findOtherRouteDirection(selectedRoute)
    if (!otherDirection || !otherDirection.route_code) return

    setRoute(props.code, otherDirection.route_code)
  }

  const handleVisiblity = () => {
    toggleInvisibleRoute(props.code)
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
          <UiButton onPress={handleVisiblity} style={buttonContainerStyle} icon="eye-outline" />

          <SelectedLineAnnouncements code={props.code} style={buttonContainerStyle} />

          <UiButton
            onPress={() => deleteLine(props.code)}
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
                  icon="refresh"
                  style={buttonContainerStyle}
                  textStyle={textContainerStyle}
                />

                <SelectedLineRoutes
                  code={props.code}
                  style={[buttonContainerStyle, styles.grow]}
                  textStyle={textContainerStyle}
                />
              </View>

              <View style={[styles.lineButtonsContainer, { flexGrow: 1 }]}>
                <UiText style={[styles.directionText, textStyle]} numberOfLines={1}>
                  {leftTitle}
                </UiText>
                <Ionicons name="arrow-forward" size={18} color={textStyle.color} />
                <UiText style={[styles.directionText, textStyle]} numberOfLines={1}>
                  {rightTitle}
                </UiText>
              </View>
            </Animated.View>
          )}
    </Animated.View>
  )
})

type LinesProps = Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>

export const SelectedLines = forwardRef<FlatList, LinesProps>(function SelectedLines({ style, ...props }, ref) {
  const keys = useLines(useShallow(state => Object.keys(state.lines))) || []

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: code }) => {
      return (
        <SelectedLine key={code} code={code}>
          {props?.children}
        </SelectedLine>
      )
    },
    [props.children],
  )

  if (keys.length < 1) {
    return null
  }

  return (
    <Animated.FlatList
      {...props}
      ref={ref}
      contentContainerStyle={styles.codes}
      data={keys}
      renderItem={renderItem}
      keyExtractor={item => item}
      snapToAlignment="center"
      pagingEnabled
      style={style}
      horizontal
    />
  )
})

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  codes: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 8,
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
