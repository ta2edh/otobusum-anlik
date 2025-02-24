import { useMemo } from 'react'
import { StyleProp, StyleSheet, TextProps, TextStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useTheme } from '@/hooks/useTheme'

import { UiText } from './UiText'

import { getTheme, useLinesStore } from '@/stores/lines'

interface Props extends TextProps {
  lineCode?: string
}

export const UiLineCode = ({ lineCode, ...props }: Props) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode || '')))
  const { getSchemeColorHex } = useTheme(lineTheme)

  const renderCodeContainer: StyleProp<TextStyle> = useMemo(() => ({
    backgroundColor: getSchemeColorHex('primary'),
    color: getSchemeColorHex('onPrimary'),
  }), [getSchemeColorHex])

  return (
    <UiText style={[styles.renderCode, renderCodeContainer]}>
      {lineCode}
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
