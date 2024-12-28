import { memo, useCallback, useEffect, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import Animated, {
  AnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useMap } from '@/hooks/contexts/useMap'
import { useLine } from '@/hooks/queries/useLine'
import { useLineBusStops } from '@/hooks/queries/useLineBusStops'
import { useTheme } from '@/hooks/useTheme'

import { UiButton } from '../ui/UiButton'
import { UiText } from '../ui/UiText'

import { LineAnnouncementsMemoized } from './LineAnnouncements'
import { LineBusStops } from './LineBusStops'
import { LineRouteDirection } from './routes/LineRouteDirection'
import { LineRoutes } from './routes/LineRoutes'

import { changeRouteDirection, getSelectedRouteCode, useFiltersStore } from '@/stores/filters'
import { deleteLine, getTheme, useLinesStore } from '@/stores/lines'
import { toggleLineVisibility, useMiscStore } from '@/stores/misc'

export interface LineProps extends AnimatedProps<ViewProps> {
  lineCode: string
}

const Line = ({ style, lineCode, ...props }: LineProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const routeCode = useFiltersStore(() => getSelectedRouteCode(lineCode))
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))

  const { getSchemeColorHex } = useTheme(lineTheme)
  const { lineWidth } = useLine(lineCode)
  const { query } = useLineBusStops(routeCode)

  const map = useMap()

  const isVisible = useSharedValue(true)

  useEffect(() => {
    const unsub = useMiscStore.subscribe(
      state => state.invisibleLines,
      (newCodes) => {
        isVisible.value = !newCodes.includes(lineCode)

        if (!isVisible.value && query.data) {
          const coords = query.data.map(x => ({ latitude: x.y_coord, longitude: x.x_coord }))
          map?.current?.fitToCoordinates(coords, {
            edgePadding: {
              bottom: 200,
              top: 0,
              left: 0,
              right: 0,
            },
          })
        }
      },
      {
        fireImmediately: true,
      },
    )

    return unsub
  }, [isVisible, query.data, map, lineCode])

  const handleVisibility = () => {
    toggleLineVisibility(lineCode)
  }

  const handleDelete = () => {
    deleteLine(lineCode)
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
    changeRouteDirection(lineCode)
  }, [lineCode])

  return (
    <Animated.View
      style={[containerStyle, containerAnimatedStyle, styles.container, style]}
      key={lineCode}
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
          {lineCode}
        </UiText>

        <View style={styles.titleContainer}>
          <UiButton
            onPress={handleVisibility}
            theme={lineTheme}
            icon="eye-outline"
          />

          {selectedCity === 'istanbul' && (
            <LineAnnouncementsMemoized lineCode={lineCode} style={buttonContainerStyle} />
          )}

          <UiButton
            onPress={handleDelete}
            icon="trash-outline"
            theme={lineTheme}
          />
        </View>
      </View>

      <LineBusStops lineCode={lineCode} />

      <View style={styles.lineButtonsContainer}>
        <UiButton onPress={handleSwitchRoute} icon="repeat" theme={lineTheme} />
        <LineRoutes lineCode={lineCode} />
      </View>

      <LineRouteDirection lineCode={lineCode} />
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
