import { useEffect, useRef } from 'react'
import { AppState, Platform, Linking } from 'react-native'
import * as Location from 'expo-location'

/**
 * iOS için uygulama yaşam döngüsü yönetimi
 */
export const useIOSAppLifecycle = () => {
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    if (Platform.OS !== 'ios') return

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!')
        handleAppForeground()
      } else if (nextAppState.match(/inactive|background/)) {
        console.log('App has gone to the background!')
        handleAppBackground()
      }

      appState.current = nextAppState
    })

    return () => {
      subscription?.remove()
    }
  }, [])
  const handleAppForeground = async () => {
    // Uygulama ön plana geldiğinde
    try {
      // Lokasyon izinlerini kontrol et
      const { status } = await Location.getForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Location permission lost')
      }
    } catch (error) {
      console.error('Foreground handling error:', error)
    }
  }

  const handleAppBackground = async () => {
    // Uygulama arka plana geçtiğinde
    try {
      // Background task başlat (gerekirse)
      console.log('App going to background, saving state...')
    } catch (error) {
      console.error('Background handling error:', error)
    }
  }

  return {
    isActive: appState.current === 'active',
    currentState: appState.current
  }
}

/**
 * iOS için deep link handling
 */
export const useIOSDeepLinks = () => {
  useEffect(() => {
    if (Platform.OS !== 'ios') return

    const handleDeepLink = (url: string) => {
      console.log('Deep link received:', url)
      
      // URL'yi parse et ve uygun sayfaya yönlendir
      if (url.includes('stop/')) {
        const stopId = url.split('stop/')[1]
        // Navigate to stop detail
        console.log('Navigate to stop:', stopId)
      } else if (url.includes('route/')) {
        const routeId = url.split('route/')[1]
        // Navigate to route detail
        console.log('Navigate to route:', routeId)
      }
    }

    // Initial URL kontrolü
    const checkInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL()
      if (initialUrl) {
        handleDeepLink(initialUrl)
      }
    }

    checkInitialURL()

    // URL change listener
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url)
    })

    return () => {
      subscription?.remove()
    }
  }, [])
}
