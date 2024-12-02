import { Ionicons } from '@expo/vector-icons'
import { useMemo } from 'react'
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'
import { UiButton } from '@/components/ui/UiButton'
import { UiText } from '@/components/ui/UiText'

import { useRouteFilter } from '@/hooks/useRouteFilter'
import { useTheme } from '@/hooks/useTheme'

import { LineRoutes } from './LineRoutes'

import { changeRouteDirection } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'

interface Props {
  code: string
}

export const LineRoutesContainer = (props: Props) => {
  const { getCurrentOrDefaultRoute, query: { isPending } } = useRouteFilter(props.code)
  const lineTheme = useLinesStore(useShallow(state => state.lineTheme[props.code]))
  const { getSchemeColorHex } = useTheme(lineTheme)

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

  if (isPending) {
    return <UiActivityIndicator size="small" />
  }

  const route = getCurrentOrDefaultRoute()
  const [leftTitle, rightTitle] = route?.route_long_name?.trim().split('-') ?? ['', ''] ?? ['', '']

  const textStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onPrimary'),
  }

  const handleSwitchRoute = () => {
    changeRouteDirection(props.code)
  }

  return (
    <View style={styles.routeContainer}>
      <View style={styles.lineButtonsContainer}>
        <UiButton
          onPress={handleSwitchRoute}
          icon="repeat"
          style={buttonContainerStyle}
          textStyle={textContainerStyle}
        />

        <LineRoutes
          code={props.code}
          style={[buttonContainerStyle, styles.grow]}
          textStyle={textContainerStyle}
        />
      </View>

      <Pressable
        onPress={handleSwitchRoute}
        style={styles.lineButtonsContainer}
      >
        <UiText style={[styles.directionText, textStyle]} numberOfLines={1}>
          {leftTitle}
        </UiText>
        <Ionicons name="arrow-forward" size={18} color={textStyle.color} />
        <UiText style={[styles.directionText, textStyle]} numberOfLines={1}>
          {rightTitle}
        </UiText>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  routeContainer: {
    gap: 8,
    flexShrink: 0,
  },
  lineButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexGrow: 1,
  },
  directionText: {
    flexBasis: 0,
    flexGrow: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grow: {
    flexGrow: 1,
  },
})
