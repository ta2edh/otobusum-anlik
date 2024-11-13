import { useLines } from '@/stores/lines'
import { useFilters } from '@/stores/filters'

import { UiText } from './ui/UiText'
import { UiButton } from './ui/UiButton'
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  useWindowDimensions,
  useColorScheme,
  ListRenderItem,
  TextStyle,
} from 'react-native'
import Animated, {
  FadeInLeft,
  FlatListPropsWithLayout,
  LinearTransition,
  ZoomIn,
} from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useShallow } from 'zustand/react/shallow'
import { SelectedLineAnnouncements } from './SelectedLineAnnouncements'
import { SelectedLineRoutes } from './SelectedLineRoutes'
import { useRouteFilter } from '@/hooks/useRouteFilter'
import { UiActivityIndicator } from './ui/UiActivityIndicator'
import { hexFromArgb } from '@material/material-color-utilities'
import { useCallback } from 'react'

interface Props {
  code: string
}

export function SelectedLine(props: Props) {
  const { width } = useWindowDimensions()
  const isDark = useColorScheme() === 'dark'

  const setRoute = useFilters(useShallow(state => state.setRoute))
  const deleteLine = useLines(useShallow(state => state.deleteLine))
  const {
    findOtherRouteDirection,
    findRouteFromCode,
    query: { isPending },
  } = useRouteFilter(props.code)

  const selectedRoute = useFilters(useShallow(state => state.selectedRoutes[props.code]))
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))

  const route = selectedRoute ? findRouteFromCode(selectedRoute) : undefined
  const [leftTitle, rightTitle] = route?.route_long_name.trim().split('-') ?? ['', ''] ?? ['', '']

  const scheme = isDark ? lineTheme!.schemes.dark : lineTheme!.schemes.light

  const handleSwitchRoute = () => {
    if (!selectedRoute) return

    const otherDirection = findOtherRouteDirection(selectedRoute)
    if (!otherDirection) return

    setRoute(props.code, otherDirection.route_code)
  }

  const containerStyle: StyleProp<ViewStyle> = {
    backgroundColor: hexFromArgb(scheme.primary),
    maxWidth: width * 0.8,
  }

  const buttonContainerStyle: StyleProp<ViewStyle> = {
    backgroundColor: hexFromArgb(scheme.secondaryContainer),
  }

  const textContainerStyle: StyleProp<TextStyle> = {
    color: hexFromArgb(scheme.onSecondaryContainer),
  }

  const textStyle: StyleProp<TextStyle> = {
    color: hexFromArgb(scheme.onPrimary),
  }

  return (
    <Animated.View
      layout={LinearTransition}
      entering={ZoomIn}
      style={[containerStyle, styles.container]}
      key={props.code}
    >
      <View style={styles.titleContainer}>
        <UiText style={{ fontWeight: 'bold', color: hexFromArgb(scheme.onPrimary) }}>
          {props.code}
        </UiText>

        <View style={styles.titleContainer}>
          <SelectedLineAnnouncements code={props.code} style={buttonContainerStyle} />

          <UiButton
            onPress={() => deleteLine(props.code)}
            style={buttonContainerStyle}
            icon="trash-outline"
            textStyle={textContainerStyle}
          />
        </View>
      </View>

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
                  style={buttonContainerStyle}
                  textStyle={textContainerStyle}
                />
              </View>

              <View style={styles.lineButtonsContainer}>
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
}

export function SelectedLines({
  style,
  ...rest
}: Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>) {
  const keys = useLines(useShallow(state => Object.keys(state.lines))) || []
  const { width } = useWindowDimensions()

  const renderItem: ListRenderItem<string> = useCallback(({ item: code }) => {
    return <SelectedLine key={code} code={code} />
  }, [])

  if (keys.length < 1) {
    return null
  }

  return (
    <Animated.FlatList
      {...rest}
      layout={LinearTransition}
      contentContainerStyle={styles.codes}
      data={keys}
      renderItem={renderItem}
      snapToInterval={width * 0.8 + 8}
      snapToAlignment="center"
      style={style}
      horizontal
    />
  )
}

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
    flex: 1,
    overflow: 'hidden',
  },
  directionText: {
    flexBasis: 0,
    flexGrow: 1,
    fontWeight: 'bold',
  },
  routeContainer: {
    gap: 8,
  },
})
