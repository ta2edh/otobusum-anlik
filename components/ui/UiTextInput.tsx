import { StyleSheet, TextInputProps } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import { useTheme } from '@/hooks/useTheme'

import { colors } from '@/constants/colors'

export const UiTextInput = ({ style, ...props }: TextInputProps) => {
  const { colorsTheme } = useTheme()

  const dynamicStyle = { color: colorsTheme.color, backgroundColor: colorsTheme.surfaceContainerHigh }

  return (
    <TextInput
      style={[styles.input, dynamicStyle, style]}
      placeholderTextColor={colors.light.surfaceContainerHighest}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
})
