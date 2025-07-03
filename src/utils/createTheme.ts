import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
  type Theme,
} from '@material/material-color-utilities'

import { ColorSchemes } from '@/constants/colors'

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100

  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0') // convert to Hex and prefix "0" if needed
  }

  return `#${f(0)}${f(8)}${f(4)}`
}

// Predefined distinct colors for better visual separation
const DISTINCT_COLORS = [
  '#E53E3E', // Red
  '#3182CE', // Blue  
  '#38A169', // Green
  '#D69E2E', // Yellow
  '#805AD5', // Purple
  '#DD6B20', // Orange
  '#319795', // Teal
  '#E91E63', // Pink
  '#2B6CB0', // Indigo
  '#48BB78', // Emerald
  '#ED8936', // Amber
  '#9F7AEA', // Violet
  '#4299E1', // Sky
  '#68D391', // Lime
  '#F6AD55', // Gold
  '#B794F6', // Lavender
  '#63B3ED', // Light Blue
  '#9AE6B4', // Mint
  '#FBB6CE', // Rose
  '#C6F6D5', // Light Green
  '#FF6B6B', // Coral
  '#4ECDC4', // Turquoise
  '#45B7D1', // Ocean Blue
  '#F9CA24', // Bright Yellow
  '#6C5CE7', // Bright Purple
  '#FD79A8', // Hot Pink
  '#FDCB6E', // Peach
  '#E17055', // Terra Cotta
  '#00B894', // Mint Green
  '#A29BFE', // Periwinkle
]

// Color wheel positions for maximum visual distinction  
const GOLDEN_RATIO_CONJUGATE = 0.618033988749895
const SATURATION_VALUES = [65, 75, 85] // High saturation for distinction
const LIGHTNESS_VALUES = [45, 55, 65] // Medium lightness for readability

let colorIndex = 0
let hueOffset = 0

const getDistinctHslValues = (): [number, number, number] => {
  // Use golden ratio to distribute hues evenly around color wheel
  hueOffset = (hueOffset + GOLDEN_RATIO_CONJUGATE * 360) % 360
  
  // Cycle through saturation and lightness values for variation
  const saturation = SATURATION_VALUES[colorIndex % SATURATION_VALUES.length] || 70
  const lightness = LIGHTNESS_VALUES[Math.floor(colorIndex / SATURATION_VALUES.length) % LIGHTNESS_VALUES.length] || 55
  
  colorIndex++
  
  return [hueOffset, saturation, lightness]
}

const getPresetColor = (): string => {
  const color = DISTINCT_COLORS[colorIndex % DISTINCT_COLORS.length] || '#3182CE'
  colorIndex++
  return color
}

export const materialThemeToLocalSchemes = (theme: Theme): ColorSchemes => {
  return {
    dark: {
      surface: hexFromArgb(theme.schemes['dark']['surface']),
      surfaceContainer: hexFromArgb(theme.palettes.neutral.tone(12)),
      surfaceContainerHigh: hexFromArgb(theme.palettes.neutral.tone(17)),
      onSurface: hexFromArgb(theme.schemes['dark']['onSurface']),
      onSurfaceDimmed: hexFromArgb(theme.schemes['dark']['onSurface']),
      primary: hexFromArgb(theme.schemes['dark']['primary']),
      onPrimary: hexFromArgb(theme.schemes['dark']['onPrimary']),
      error: hexFromArgb(theme.schemes['dark']['error']),
      onError: hexFromArgb(theme.schemes['dark']['onError']),

      primaryContainer: hexFromArgb(theme.schemes['dark']['primaryContainer']),
      onPrimaryContainer: hexFromArgb(theme.schemes['dark']['onPrimaryContainer']),
    },
    light: {
      surface: hexFromArgb(theme.schemes['light']['surface']),
      surfaceContainer: hexFromArgb(theme.palettes.neutral.tone(94)),
      surfaceContainerHigh: hexFromArgb(theme.palettes.neutral.tone(92)),
      onSurface: hexFromArgb(theme.schemes['light']['onSurface']),
      onSurfaceDimmed: hexFromArgb(theme.schemes['light']['onSurface']),
      primary: hexFromArgb(theme.schemes['light']['primary']),
      onPrimary: hexFromArgb(theme.schemes['light']['onPrimary']),
      error: hexFromArgb(theme.schemes['light']['error']),
      onError: hexFromArgb(theme.schemes['light']['onError']),

      primaryContainer: hexFromArgb(theme.schemes['light']['primaryContainer']),
      onPrimaryContainer: hexFromArgb(theme.schemes['light']['onPrimaryContainer']),
    },
  }
}

// Simple hash function for consistent color assignment based on line code
const hashCode = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

export const createTheme = (hex?: string, lineCode?: string): ColorSchemes => {
  let theme: Theme

  if (hex) {
    theme = themeFromSourceColor(argbFromHex(hex))
    return materialThemeToLocalSchemes(theme)
  }

  // Use line code for consistent color assignment
  if (lineCode) {
    const hash = hashCode(lineCode)
    
    // First try preset colors for maximum distinction
    if (hash % 2 === 0 && DISTINCT_COLORS.length > 0) {
      const colorIndex = hash % DISTINCT_COLORS.length
      const colorHex = DISTINCT_COLORS[colorIndex] || '#3182CE'
      theme = themeFromSourceColor(argbFromHex(colorHex))
      return materialThemeToLocalSchemes(theme)
    }
    
    // Generate deterministic HSL values based on hash
    const hue = (hash * GOLDEN_RATIO_CONJUGATE * 360) % 360
    const saturationIndex = hash % SATURATION_VALUES.length
    const lightnessIndex = Math.floor(hash / SATURATION_VALUES.length) % LIGHTNESS_VALUES.length
    const saturation = SATURATION_VALUES[saturationIndex] || 70
    const lightness = LIGHTNESS_VALUES[lightnessIndex] || 55
    
    const colorHex = hslToHex(hue, saturation, lightness)
    theme = themeFromSourceColor(argbFromHex(colorHex))
    return materialThemeToLocalSchemes(theme)
  }

  // Fallback: sequential color assignment (existing behavior)
  // First try preset colors for maximum distinction
  if (colorIndex < DISTINCT_COLORS.length * 2) {
    const colorHex = getPresetColor()
    theme = themeFromSourceColor(argbFromHex(colorHex))
    return materialThemeToLocalSchemes(theme)
  }

  // Fall back to algorithmically generated distinct colors
  const [h, s, l] = getDistinctHslValues()
  const colorHex = hslToHex(h, s, l)
  theme = themeFromSourceColor(argbFromHex(colorHex))
  return materialThemeToLocalSchemes(theme)
}

// Debug function to preview line colors
export const previewLineColors = (lineCodes: string[]) => {
  console.log('🎨 Line Color Preview:')
  lineCodes.forEach((lineCode, index) => {
    const theme = createTheme(undefined, lineCode)
    console.log(`Line ${lineCode}:`, {
      lightPrimary: theme.light.primary,
      darkPrimary: theme.dark.primary,
      index,
    })
  })
}
