import { Theme } from '@material/material-color-utilities'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { UiText } from './UiText'

import { colors } from '@/constants/colors'

interface Button<T> {
  label: string
  value: T
}

interface UiSegmentedButtonsProps<T> extends TouchableOpacityProps {
  buttons: Button<T>[]
  value?: T
  onValueChange?: (value: T) => void
  theme?: Theme
}

export const UiSegmentedButtons = <T,>({ buttons, value, style, onValueChange, theme }: UiSegmentedButtonsProps<T>) => {
  const { colorsTheme, getSchemeColorHex } = useTheme(theme)

  const baseStyle: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('primaryContainer') || colorsTheme.surfaceContainerHigh,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexGrow: 1,
    flexBasis: 100,
  }

  const leftEdge: StyleProp<ViewStyle> = {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  }

  const rightEdge: StyleProp<ViewStyle> = {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  }

  const selectedStyle: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('tertiaryContainer') || colors.primary,
  }

  const selectedTextStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onTertiaryContainer') || colors.primary,
  }

  const textStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onPrimaryContainer'),
  }

  return (
    <View style={[styles.container, style]}>
      {buttons.map((button, index) => {
        const edgeStyle
          = index === 0 ? leftEdge : index === buttons.length - 1 ? rightEdge : undefined

        const selected = button.value === value

        return (
          <TouchableOpacity
            key={button.label}
            style={[edgeStyle, baseStyle, selected ? selectedStyle : undefined]}
            onPress={() => onValueChange?.(button.value)}
          >
            <UiText style={[styles.label, textStyle, selected ? selectedTextStyle : undefined]}>{button.label}</UiText>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  label: {
    textAlign: 'center',
  },
})
