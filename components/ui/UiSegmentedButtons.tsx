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

  const selectedStyle: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('tertiaryContainer'),
  }

  const selectedTextStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onTertiaryContainer'),
  }

  const textStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onPrimaryContainer'),
  }

  return (
    <View style={[styles.container, style]}>
      {buttons.map((button, index) => {
        const selected = button.value === value

        return (
          <TouchableOpacity
            key={button.label}
            style={[baseStyle, selected ? selectedStyle : undefined]}
            onPress={() => onValueChange?.(button.value)}
          >
            <UiText
              style={[styles.label, textStyle, selected ? selectedTextStyle : undefined]}
              numberOfLines={1}
            >
              {button.label}
            </UiText>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    textAlign: 'center',
  },
})
