import { Platform, StatusBar } from 'react-native'
import { useColorScheme } from 'react-native'

/**
 * iOS için özel tema değerleri
 */
export const iOSTheme = {
  colors: {
    // iOS sistem renkleri
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemIndigo: '#5856D6',
    systemOrange: '#FF9500',
    systemPink: '#FF2D92',
    systemPurple: '#AF52DE',
    systemRed: '#FF3B30',
    systemTeal: '#5AC8FA',
    systemYellow: '#FFCC00',
    
    // iOS label renkleri
    label: '#000000',
    secondaryLabel: '#3C3C43',
    tertiaryLabel: '#3C3C43',
    quaternaryLabel: '#3C3C43',
    
    // iOS fill renkleri  
    systemFill: '#787880',
    secondarySystemFill: '#787880',
    tertiarySystemFill: '#767680',
    quaternarySystemFill: '#747480',
    
    // iOS background renkleri
    systemBackground: '#FFFFFF',
    secondarySystemBackground: '#F2F2F7',
    tertiarySystemBackground: '#FFFFFF',
    
    // iOS grouped background renkleri
    systemGroupedBackground: '#F2F2F7',
    secondarySystemGroupedBackground: '#FFFFFF',
    tertiarySystemGroupedBackground: '#F2F2F7',
  },
  
  fonts: {
    // iOS sistem fontları
    largeTitle: {
      fontSize: 34,
      fontWeight: '700' as const,
      lineHeight: 41,
    },
    title1: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 34,
    },
    title2: {
      fontSize: 22,
      fontWeight: '700' as const,
      lineHeight: 28,
    },
    title3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 25,
    },
    headline: {
      fontSize: 17,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
    body: {
      fontSize: 17,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    callout: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 21,
    },
    subhead: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    footnote: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 18,
    },
    caption1: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
    caption2: {
      fontSize: 11,
      fontWeight: '400' as const,
      lineHeight: 13,
    },
  },
  
  spacing: {
    // iOS standart spacing değerleri
    small: 8,
    medium: 16,
    large: 24,
    xLarge: 32,
  },
  
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xLarge: 20,
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
}

/**
 * iOS için status bar yönetimi
 */
export const useIOSStatusBar = () => {
  const colorScheme = useColorScheme()
  
  const setStatusBarStyle = (style: 'default' | 'light-content' | 'dark-content') => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle(style, true)
    }
  }

  const setStatusBarHidden = (hidden: boolean) => {
    if (Platform.OS === 'ios') {
      StatusBar.setHidden(hidden, 'slide')
    }
  }

  // Otomatik tema ayarı
  const setAutoStatusBar = () => {
    if (Platform.OS === 'ios') {
      const style = colorScheme === 'dark' ? 'light-content' : 'dark-content'
      StatusBar.setBarStyle(style, true)
    }
  }

  return {
    setStatusBarStyle,
    setStatusBarHidden,
    setAutoStatusBar,
    currentScheme: colorScheme,
  }
}

/**
 * iOS için haptic feedback yönetimi
 */
export const iOSHaptics = {
  light: () => {
    if (Platform.OS === 'ios') {
      // Light haptic feedback zaten UiButton'da implement edilmiş
      console.log('Light haptic feedback')
    }
  },
  medium: () => {
    if (Platform.OS === 'ios') {
      // Medium haptic feedback zaten UiButton'da implement edilmiş
      console.log('Medium haptic feedback')
    }
  },
  heavy: () => {
    if (Platform.OS === 'ios') {
      console.log('Heavy haptic feedback')
    }
  },
  success: () => {
    if (Platform.OS === 'ios') {
      console.log('Success haptic feedback')
    }
  },
  warning: () => {
    if (Platform.OS === 'ios') {
      console.log('Warning haptic feedback')
    }
  },
  error: () => {
    if (Platform.OS === 'ios') {
      console.log('Error haptic feedback')
    }
  },
}
