import { Ionicons } from '@expo/vector-icons'
import { IconProps } from '@expo/vector-icons/build/createIconSet'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'
import Animated, { AnimatedProps } from 'react-native-reanimated'

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
  iconProps?: AnimatedProps<Omit<IconProps<keyof typeof Ionicons>, 'name'>>
}

type IconSize = 'sm' | 'md' | 'lg'

const iconSizes: Record<IconSize, number> = {
  sm: 18,
  md: 20,
  lg: 24,
}

const AnimatedIonIcons = Animated.createAnimatedComponent(Ionicons)

export const UiButton = ({ style, square, iconSize = 'md', ...props }: UiButtonProps) => {
  const { colorsTheme } = useTheme()

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
      if (props.iconProps) {
        return (
          <AnimatedIonIcons
            name={props.icon}
            size={iconSizes[iconSize]}
            color={(props.textStyle as TextStyle)?.color}
            animatedProps={props.iconProps}
          />
        )
      }

      return (
        <Ionicons
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
    <TouchableOpacity style={[styles.button, dynamicStyle, square ? styles.square : undefined, style]} {...props}>
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
  square: {
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 14,
  },
})
