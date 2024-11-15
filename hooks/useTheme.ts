import { colors } from '@/constants/colors'
import { hexFromArgb, Scheme, Theme } from '@material/material-color-utilities'
import { useCallback } from 'react'
import { useColorScheme } from 'react-native'

type SchemeKeys = {
  [K in keyof Scheme]: Scheme[K] extends number ? K : never
}[keyof Scheme]

export function useTheme(theme?: Theme) {
  const mode = useColorScheme() ?? 'dark'
  const scheme = mode === 'dark' ? theme?.schemes.dark : theme?.schemes.light
  const colorsTheme = colors[mode]

  const bottomSheetStyle = {
    handleStyle: { backgroundColor: colorsTheme.surfaceContainerLow },
    handleIndicatorStyle: { backgroundColor: colorsTheme.surfaceContainerHighest },
    backgroundStyle: { backgroundColor: colorsTheme.surfaceContainerLow },
  }

  const getSchemeColorHex = useCallback((key: SchemeKeys) => {
    if (!scheme) return

    return hexFromArgb(scheme[key])
  }, [scheme])

  return {
    colorsTheme,
    scheme,
    bottomSheetStyle,
    getSchemeColorHex,
  }
}
