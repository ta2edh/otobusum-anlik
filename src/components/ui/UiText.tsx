import { StyleProp, Text, TextProps, TextStyle } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { FontSize, fontSizes } from '@/constants/uiSizes'

interface Props extends TextProps {
  info?: boolean
  size?: FontSize
  error?: boolean
}

export const UiText = ({ style, info, size = 'md', ...rest }: Props) => {
  const { colorsTheme } = useTheme()

  const baseStyle: StyleProp<TextStyle> = {
    color: colorsTheme.color,
    fontSize: fontSizes[size],
    flexShrink: 1,
  }

  if (info) {
    baseStyle['color'] = colorsTheme.surfaceContainerHighest
    baseStyle['fontWeight'] = 'bold'
  }

  return <Text style={[baseStyle, style]} {...rest} />
}
