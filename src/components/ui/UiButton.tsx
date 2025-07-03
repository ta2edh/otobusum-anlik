import { type Theme } from '@material/material-color-utilities'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React, { useCallback } from 'react'
import { Platform, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { BaseButton } from 'react-native-gesture-handler'
import Animated, { AnimatedProps } from 'react-native-reanimated'

import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from './UiActivityIndicator'
import { UiText } from './UiText'

import { ButtonVariants, IconSize, iconSizes } from '@/constants/uiSizes'
import { IconValue } from '@/types/ui'

export interface UiButtonPropsBase {
  theme?: Theme
  isLoading?: boolean
  square?: boolean
  onPress?: () => void
  onLongPress?: () => void
  iconSize?: IconSize
  disabled?: boolean
  containerStyle?: StyleProp<ViewStyle>
  innerContainerStyle?: StyleProp<ViewStyle>
  iconColor?: string
  textStyle?: StyleProp<TextStyle>
  animatedIconProps?: Partial<AnimatedProps<typeof Ionicons>>
  variant?: ButtonVariants
  iconTrail?: IconValue
  children?: React.ReactNode
  align?: 'left'
  error?: boolean
}

export interface UiButtonPropsWithIcon extends UiButtonPropsBase {
  icon: IconValue
  title?: string
}

export interface UiButtonPropsWithTitle extends UiButtonPropsBase {
  icon?: IconValue
  title: string
}

export type UiButtonProps = UiButtonPropsWithTitle | UiButtonPropsWithIcon

const AnimatedIonIcons = Animated.createAnimatedComponent(Ionicons)

export const UiButton = ({
  iconSize = 'md',
  variant = 'solid',
  error,
  ...props
}: UiButtonProps) => {
  const { schemeColor } = useTheme()

  const defaultBackground
    = variant === 'solid'
      ? schemeColor.primary
      : variant === 'error'
        ? schemeColor.error
        : variant === 'soft'
          ? schemeColor.surfaceContainer
          : undefined

  const defaultTextColor
    = variant === 'solid'
      ? schemeColor.onPrimary
      : variant === 'error'
        ? schemeColor.onError
        : variant === 'soft'
          ? schemeColor.onSurface
          : schemeColor.onSurface

  const dynamicContainer: StyleProp<ViewStyle> = {
    backgroundColor: defaultBackground,
    opacity: props.disabled ? 0.5 : 1,
  }

  const dynamicText: StyleProp<TextStyle> = {
    color: defaultTextColor,
    ...(props.align === 'left' ? { flexGrow: 1, textAlign: 'left' } : {}),
  }

  const iconColor = dynamicText.color ?? props.iconColor

  const handlePress = useCallback(() => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    props.onPress?.()
  }, [props])

  const handleLongPress = useCallback(() => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    props.onLongPress?.()
  }, [props])

  const Icon = useCallback(
    ({ icon }: { icon: IconValue }) => {
      if (props.isLoading) {
        return <UiActivityIndicator size="small" color={iconColor} />
      }

      if (props.animatedIconProps) {
        return (
          <AnimatedIonIcons
            name={icon}
            size={iconSizes[iconSize]}
            color={iconColor}
            animatedProps={props.animatedIconProps}
          />
        )
      }

      return <Ionicons name={icon} size={iconSizes[iconSize]} color={iconColor} />
    },
    [iconColor, iconSize, props.animatedIconProps, props.isLoading],
  )

  return (
    <BaseButton
      style={[
        styles.container,
        dynamicContainer,
        props.containerStyle,
        props.square ? styles.square : undefined,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      rippleColor="black"
      enabled={!props.disabled}
    >
      <View
        accessible={true}
        accessibilityRole={'button'}

        style={[styles.innerContainer, props.innerContainerStyle]}
      >
        {props.icon && <Icon icon={props.icon} />}

        {props.title && (
          <UiText style={[styles.title, dynamicText, props.textStyle]} numberOfLines={2}>
            {props.title}
          </UiText>
        )}

        {props.iconTrail && <Icon icon={props.iconTrail} />}
        {props.children}
      </View>
    </BaseButton>
  )
}

const styles = StyleSheet.create({
  container: {
    minWidth: 48,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    flexShrink: 1,
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  title: {
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 18,
    flexShrink: 1,
  },
  square: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
})
