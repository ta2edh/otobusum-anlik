import { Platform } from 'react-native'
import { useEffect, ReactNode } from 'react'
import * as Haptics from 'expo-haptics'

interface IOSWrapperProps {
  children: ReactNode
  enableHaptics?: boolean
}

/**
 * iOS-specific wrapper component that provides iOS enhancements
 */
export const IOSWrapper = ({ 
  children, 
  enableHaptics = true
}: IOSWrapperProps) => {
  
  useEffect(() => {
    if (Platform.OS !== 'ios') return

    // iOS-specific initialization
    const initializeIOSFeatures = async () => {
      try {        // Configure haptics
        if (enableHaptics) {
          // Haptics are automatically available, no setup needed
          console.log('iOS Haptics enabled')
        }

        // Set iOS-specific app settings
        console.log('iOS features initialized successfully')
      } catch (error) {
        console.error('iOS initialization error:', error)
      }
    }

    initializeIOSFeatures()
  }, [enableHaptics])

  return <>{children}</>
}

/**
 * iOS-specific utility functions
 */
export const IOSUtils = {
  /**
   * Trigger haptic feedback if on iOS
   */
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (Platform.OS === 'ios') {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          break
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          break
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
          break
      }
    }
  },

  /**
   * Show success haptic feedback
   */
  successFeedback: () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }
  },

  /**
   * Show warning haptic feedback
   */
  warningFeedback: () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    }
  },

  /**
   * Show error haptic feedback
   */
  errorFeedback: () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }
  },

  /**
   * Check if device is iOS
   */
  isIOS: () => Platform.OS === 'ios',

  /**
   * Get iOS version
   */
  getIOSVersion: () => {
    if (Platform.OS === 'ios') {
      return Platform.Version
    }
    return null
  },
}
