import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'
import { UiActivityIndicator } from './UiActivityIndicator'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/hooks/useTheme'
import { UiText } from './UiText'

export interface UiButtonProps extends TouchableOpacityProps {
  title?: string
  isLoading?: boolean
  icon?: keyof typeof Ionicons.glyphMap
  disabled?: boolean
  textStyle?: StyleProp<TextStyle>
  square?: boolean
}

export function UiButton({ style, square, ...props }: UiButtonProps) {
  const { colorsTheme } = useTheme()

  const dynamicStyle: StyleProp<ViewStyle> = {
    opacity: props.disabled ? 0.4 : 1,
    borderRadius: square ? 14 : 999,
  }

  return (
    <TouchableOpacity style={[styles.button, dynamicStyle, style]} {...props}>
      {props.isLoading
        ? (
            <UiActivityIndicator
              size="small"
              color={(props.textStyle as TextStyle | undefined)?.color || colorsTheme.color}
            />
          )
        : props.icon
          ? (
              <Ionicons
                name={props.icon}
                size={20}
                color={colorsTheme.color}
                style={[{ color: colorsTheme.color }, props.textStyle]}
              />
            )
          : null}

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
    flexShrink: 1,
  },
  title: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})
