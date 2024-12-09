import { Theme } from '@material/material-color-utilities'
import Ionicons from '@react-native-vector-icons/ionicons'
import { ComponentProps, useMemo } from 'react'
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import Animated, { AnimatedProps } from 'react-native-reanimated'

import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from './UiActivityIndicator'
import { UiText } from './UiText'

import { colors } from '@/constants/colors'
import { ButtonVariants, IconSize, iconSizes } from '@/constants/uiSizes'

interface UiButtonPropsBase {
  theme?: Theme
  isLoading?: boolean
  square?: boolean
  onPress?: () => void
  iconSize?: IconSize
  disabled?: boolean
  containerStyle?: StyleProp<ViewStyle>
  iconColor?: string
  textStyle?: StyleProp<TextStyle>
  animatedIconProps?: Partial<AnimatedProps<typeof Ionicons>>
  variant?: ButtonVariants
}

interface UiButtonPropsWithIcon extends UiButtonPropsBase {
  icon: ComponentProps<typeof Ionicons>['name']
  title?: string
}

interface UiButtonPropsWithTitle extends UiButtonPropsBase {
  icon?: ComponentProps<typeof Ionicons>['name']
  title: string
}

type UiButtonProps = UiButtonPropsWithTitle | UiButtonPropsWithIcon

const AnimatedIonIcons = Animated.createAnimatedComponent(Ionicons)

export const UiButton = ({ iconSize = 'md', variant = 'solid', ...props }: UiButtonProps) => {
  const { getSchemeColorHex, colorsTheme } = useTheme(props.theme)

  const defaultBackground = variant === 'solid'
    ? colors.primary
    : variant === 'soft'
      ? colorsTheme.surfaceContainer
      : undefined

  const dynamicContainer: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('secondaryContainer') || defaultBackground,
    opacity: props.disabled ? 0.4 : 1,
  }

  const dynamicText: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onSecondaryContainer') || colorsTheme.color,
  }

  const iconColor = dynamicText.color ?? props.iconColor

  const Icon = useMemo(() => {
    if (props.isLoading) {
      return (
        <UiActivityIndicator
          size="small"
          color={iconColor}
        />
      )
    }

    if (!props.icon) return null

    if (props.animatedIconProps) {
      return (
        <AnimatedIonIcons
          name={props.icon}
          size={iconSizes[iconSize]}
          animatedProps={props.animatedIconProps}
        />
      )
    }

    return (
      <Ionicons
        name={props.icon}
        size={iconSizes[iconSize]}
        color={iconColor}
      />
    )
  }, [iconColor, iconSize, props.animatedIconProps, props.icon, props.isLoading])

  return (
    <TouchableOpacity
      style={[styles.container, dynamicContainer, props.containerStyle, props.square ? styles.square : undefined]}
      onPress={props.onPress}
    >
      {Icon}

      {props.title && (
        <UiText
          style={[styles.title, dynamicText, props.textStyle]}
          numberOfLines={1}
        >
          {props.title}
        </UiText>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minWidth: 48,
    flexShrink: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  title: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  square: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
})
