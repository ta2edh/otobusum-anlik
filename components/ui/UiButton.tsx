import { Ionicons } from '@expo/vector-icons'
import { Theme } from '@material/material-color-utilities'
import { useMemo } from 'react'
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from './UiActivityIndicator'
import { UiText } from './UiText'

import { IconSize, iconSizes } from '@/constants/uiSizes'

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
}

interface UiButtonPropsWithIcon extends UiButtonPropsBase {
  icon: keyof typeof Ionicons.glyphMap
  title?: string
}

interface UiButtonPropsWithTitle extends UiButtonPropsBase {
  icon?: keyof typeof Ionicons.glyphMap
  title: string
}

type UiButtonProps = UiButtonPropsWithTitle | UiButtonPropsWithIcon

export const UiButton = ({ iconSize = 'md', ...props }: UiButtonProps) => {
  const { getSchemeColorHex, colorsTheme } = useTheme(props.theme)

  const dynamicContainer: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('secondaryContainer'),
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

    return (
      <Ionicons
        name={props.icon}
        size={iconSizes[iconSize]}
        color={iconColor}
      />
    )
  }, [iconColor, iconSize, props.icon, props.isLoading])

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

// import { Ionicons } from '@expo/vector-icons'
// import { IconProps } from '@expo/vector-icons/build/createIconSet'
// import {
//   StyleProp,
//   StyleSheet,
//   TextStyle,
//   TouchableOpacity,
//   TouchableOpacityProps,
//   ViewStyle,
// } from 'react-native'
// import Animated, { AnimatedProps } from 'react-native-reanimated'

// import { useTheme } from '@/hooks/useTheme'

// import { UiActivityIndicator } from './UiActivityIndicator'
// import { UiText } from './UiText'

// export interface UiButtonProps extends TouchableOpacityProps {
//   title?: string
//   isLoading?: boolean
//   icon?: keyof typeof Ionicons.glyphMap
//   iconSize?: IconSize
//   disabled?: boolean
//   textStyle?: StyleProp<TextStyle>
//   square?: boolean
//   iconProps?: AnimatedProps<Omit<IconProps<keyof typeof Ionicons>, 'name'>>
// }

// type IconSize = 'sm' | 'md' | 'lg'

// const iconSizes: Record<IconSize, number> = {
//   sm: 18,
//   md: 20,
//   lg: 24,
// }

// const AnimatedIonIcons = Animated.createAnimatedComponent(Ionicons)

// export const UiButton = ({ style, square, iconSize = 'md', ...props }: UiButtonProps) => {
//   const { colorsTheme } = useTheme()

//   const dynamicStyle: StyleProp<ViewStyle> = {
//     opacity: props.disabled ? 0.4 : 1,
//   }

//   const Icon = () => {
//     if (props.isLoading) {
//       return (
//         <UiActivityIndicator
//           size="small"
//           color={(props.textStyle as TextStyle | undefined)?.color || colorsTheme.color}
//         />
//       )
//     }

//     if (props.icon) {
//       if (props.iconProps) {
//         return (
//           <AnimatedIonIcons
//             name={props.icon}
//             size={iconSizes[iconSize]}
//             color={(props.textStyle as TextStyle)?.color}
//             animatedProps={props.iconProps}
//           />
//         )
//       }

//       return (
//         <Ionicons
//           name={props.icon}
//           size={iconSizes[iconSize]}
//           color={(props.textStyle as TextStyle)?.color}
//           style={[{ color: colorsTheme.color }, props.textStyle]}
//         />
//       )
//     }

//     return null
//   }

//   return (
//     <TouchableOpacity style={[styles.button, dynamicStyle, square ? styles.square : undefined, style]} {...props}>
//       {Icon()}

//       {props.title && (
//         <UiText style={[styles.title, props.textStyle]} numberOfLines={1}>
//           {props.title}
//         </UiText>
//       )}
//     </TouchableOpacity>
//   )
// }

// const styles = StyleSheet.create({
//   button: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 4,
//     minWidth: 48,
//     padding: 8,
//     paddingHorizontal: 12,
//     borderRadius: 999,
//     flexShrink: 1,
//   },
//   title: {
//     textAlign: 'center',
//     textAlignVertical: 'center',
//   },
//   square: {
//     borderRadius: 14,
//     padding: 14,
//     paddingHorizontal: 14,
//   },
// })
