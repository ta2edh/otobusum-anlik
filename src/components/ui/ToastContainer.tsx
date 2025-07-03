import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useToastStore, ToastMessage } from '@/stores/toast'
import { useTheme } from '@/hooks/useTheme'

const { width } = Dimensions.get('window')

interface ToastItemProps {
  toast: ToastMessage
}

const ToastItem = ({ toast }: ToastItemProps) => {
  const theme = useTheme()
  const removeToast = useToastStore(state => state.removeToast)
  const slideAnim = React.useRef(new Animated.Value(-100)).current
  const opacityAnim = React.useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      removeToast(toast.id)
    })
  }
  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return '#4CAF50'
      case 'error':
        return '#F44336'
      case 'warning':
        return '#FF9800'
      case 'info':
      default:
        return '#2196F3'
    }
  }

  return (
    <Animated.View
      style={[
        styles.toastItem,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toastContent}
        onPress={handleDismiss}
        activeOpacity={0.8}
      >
        <Text style={styles.toastText}>{toast.message}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

export const ToastContainer = () => {
  const toasts = useToastStore(state => state.toasts)
  const insets = useSafeAreaInsets()

  if (toasts.length === 0) {
    return null
  }

  return (
    <View style={[styles.container, { top: insets.top + 10 }]} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  toastItem: {
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toastText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
})

export default ToastContainer
