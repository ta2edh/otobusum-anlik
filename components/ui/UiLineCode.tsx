import { StyleProp, StyleSheet, TextProps, TextStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from './UiActivityIndicator'
import { UiText } from './UiText'

import { colors } from '@/constants/colors'
import { useLinesStore } from '@/stores/lines'

interface Props extends TextProps {
  isLoading?: boolean
  code: string
}

export const UiLineCode = ({ isLoading, code, ...props }: Props) => {
  const lineTheme = useLinesStore(useShallow(state => state.lineTheme[code]))
  const { getSchemeColorHex } = useTheme(lineTheme)

  const renderCodeContainer: StyleProp<TextStyle> = {
    backgroundColor: getSchemeColorHex('primary') || colors.primary,
    color: getSchemeColorHex('onPrimary') || 'white',
  }

  return (
    <UiText style={[styles.renderCode, renderCodeContainer]}>
      {isLoading ? <UiActivityIndicator /> : code}
      {props.children}
    </UiText>
  )
}

const styles = StyleSheet.create({
  renderCode: {
    borderRadius: 999,
    padding: 9,
    minWidth: 70,
    textAlign: 'center',
  },
})
