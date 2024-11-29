import { colors } from '@/constants/colors'
import { useSettings } from '@/stores/settings'
import { hexFromArgb, Scheme, Theme } from '@material/material-color-utilities'
import { useCallback, useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

type SchemeKeys = {
  [K in keyof Scheme]: Scheme[K] extends number ? K : never
}[keyof Scheme]

export function useTheme(theme?: Theme) {
  const storedTheme = useSettings(useShallow(state => state.colorScheme))
  const systemScheme = useColorScheme()

  const mode = storedTheme ?? systemScheme ?? 'dark'

  const scheme = mode === 'dark' ? theme?.schemes.dark : theme?.schemes.light
  const colorsTheme = colors[mode]

  const bottomSheetStyle = useMemo(() => ({
    handleStyle: { backgroundColor: colorsTheme.surfaceContainerLow },
    handleIndicatorStyle: { backgroundColor: colorsTheme.surfaceContainerHighest },
    backgroundStyle: { backgroundColor: colorsTheme.surfaceContainerLow },
  }), [colorsTheme])

  const getSchemeColorHex = useCallback((key: SchemeKeys) => {
    if (!scheme) return

    return hexFromArgb(scheme[key])
  }, [scheme])

  return {
    mode,
    scheme,
    colorsTheme,
    bottomSheetStyle,
    getSchemeColorHex,
  }
}
