import { Ionicons } from '@expo/vector-icons'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'
import Animated from 'react-native-reanimated'

import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from './UiActivityIndicator'
import { UiText } from './UiText'

export interface UiButtonProps extends TouchableOpacityProps {
  title?: string
  isLoading?: boolean
  icon?: keyof typeof Ionicons.glyphMap
  iconSize?: IconSize
  disabled?: boolean
  textStyle?: StyleProp<TextStyle>
  square?: boolean
}

type IconSize = 'sm' | 'md' | 'lg'

const iconSizes: Record<IconSize, number> = {
  sm: 18,
  md: 20,
  lg: 24,
}

const AnimatedIonicons = Animated.createAnimatedComponent(
  Ionicons,
)

export function UiButton({ style, square, iconSize = 'md', ...props }: UiButtonProps) {
  const { colorsTheme } = useTheme()

  const squareStyle: StyleProp<ViewStyle> = {
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 14,
  }

  const dynamicStyle: StyleProp<ViewStyle> = {
    opacity: props.disabled ? 0.4 : 1,
  }

  const Icon = () => {
    if (props.isLoading) {
      return (
        <UiActivityIndicator
          size="small"
          color={(props.textStyle as TextStyle | undefined)?.color || colorsTheme.color}
        />
      )
    }

    if (props.icon) {
      return (
        <AnimatedIonicons
          name={props.icon}
          size={iconSizes[iconSize]}
          color={(props.textStyle as TextStyle)?.color}
          style={[{ color: colorsTheme.color }, props.textStyle]}
        />
      )
    }

    return null
  }

  return (
    <TouchableOpacity style={[styles.button, dynamicStyle, square ? squareStyle : undefined, style]} {...props}>
      {Icon()}

      {props.title && (
        <UiText style={[styles.title, props.textStyle]} numberOfLines={1}>
          {props.title}
        </UiText>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    minWidth: 48,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    flexShrink: 1,
  },
  title: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})
