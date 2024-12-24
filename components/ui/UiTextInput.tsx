import { StyleSheet, TextInputProps } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import { useTheme } from '@/hooks/useTheme'

export const UiTextInput = ({ style, ...props }: TextInputProps) => {
  const { getSchemeColorHex } = useTheme()

  const dynamicStyle = {
    color: getSchemeColorHex('onSurface'),
    backgroundColor: getSchemeColorHex('surface'),
  }

  return (
    <TextInput
      style={[styles.input, dynamicStyle, style]}
      placeholderTextColor={getSchemeColorHex('onSurface')} // should be less opacity
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
