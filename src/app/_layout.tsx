import '@/assets/styles.css'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native'
import { DehydrateOptions } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { setBackgroundColorAsync } from 'expo-system-ui'
import { useEffect, useRef } from 'react'
import { Platform, Dimensions } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { enableFreeze, enableScreens } from 'react-native-screens'

import { CrashBoundary } from '@/components/CrashBoundary'
import { TheStatusBar } from '@/components/TheStatusBar'
import { ToastContainer } from '@/components/ui/ToastContainer'

import { useTheme } from '@/hooks/useTheme'
import { useIOSAppLifecycle, useIOSDeepLinks } from '@/hooks/useIOSLifecycle'

import { persister, queryClient } from '@/api/client'
import { fontSizes } from '@/constants/uiSizes'
import { i18n } from '@/translations/i18n'
import { useLanguageStore } from '@/stores/language'
import { useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { checkAllPermissions } from '@/utils/iOSPermissions'

SplashScreen.preventAutoHideAsync().catch((error) => {
  console.warn('SplashScreen prevent auto hide error:', error)
})

SplashScreen.setOptions({
  duration: 300, // Production'da biraz daha uzun
  fade: true,
})

enableFreeze(true)
enableScreens(true)

export const RootLayout = () => {
  const { schemeColor, colorScheme } = useTheme()
  const languageHydrated = useLanguageStore(state => state._hasHydrated)
  const linesHydrated = useLinesStore(state => state._hasHydrated)
  const miscHydrated = useMiscStore(state => state._hasHydrated)
  const allStoresHydrated = languageHydrated && linesHydrated && miscHydrated
  const hydrationTimeoutRef = useRef<number | null>(null)
  const splashTimeoutRef = useRef<number | null>(null)

  // iOS-specific hooks
  if (Platform.OS === 'ios') {
    useIOSAppLifecycle()
    useIOSDeepLinks()
  }

  // Splash screen ve hydration timeout
  useEffect(() => {
    // iPad için daha uzun timeout (5 saniye), diğerleri için 4 saniye
    const { width, height } = Dimensions.get('window')
    const isIPad = Platform.OS === 'ios' && (width >= 768 || height >= 768)
    const splashTimeout = isIPad ? 5000 : 4000
    
    console.log(`Device dimensions: ${width}x${height}, isIPad: ${isIPad}, timeout: ${splashTimeout}ms`)
    
    splashTimeoutRef.current = setTimeout(() => {
      console.log('Force hiding splash screen due to timeout')
      SplashScreen.hideAsync().catch(() => {})
    }, splashTimeout)
    
    return () => {
      if (splashTimeoutRef.current) clearTimeout(splashTimeoutRef.current)
    }
  }, [])

  // Store hydration'ını bekle
  useEffect(() => {
    if (!allStoresHydrated) {
      console.log(`Store hydration status: language=${languageHydrated}, lines=${linesHydrated}, misc=${miscHydrated}`)
      // 2.5 saniye sonra yine de splash screen'i kapat (timeout'tan önce)
      hydrationTimeoutRef.current = setTimeout(() => {
        console.log('Force hiding splash screen due to hydration timeout')
        SplashScreen.hideAsync().catch(() => {})
      }, 2500)
      return
    }
    
    // Tüm store'lar hazır, splash screen'i kapat
    if (hydrationTimeoutRef.current) clearTimeout(hydrationTimeoutRef.current)
    console.log('All stores hydrated, hiding splash screen')
    SplashScreen.hideAsync().catch(() => {})
  }, [allStoresHydrated, languageHydrated, linesHydrated, miscHydrated])

  // iOS permission check on app start
  useEffect(() => {
    if (Platform.OS === 'ios') {
      checkAllPermissions().then((permissions) => {
        console.log('iOS permissions:', permissions)
      })
    }
  }, [])

  const targetTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  const modifiedTheme: Theme = {
    ...targetTheme,
    colors: {
      ...targetTheme.colors,
      background: schemeColor.surface,
      card: schemeColor.surfaceContainer,
    },
  }

  setBackgroundColorAsync(modifiedTheme.colors.background)

  const dehydrateOptions: DehydrateOptions = {
    shouldDehydrateQuery: (query) => {
      return !!query.meta?.persist
    },
  }

  return (
    <CrashBoundary>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          dehydrateOptions,
        }}
      >
      <TheStatusBar />

      <GestureHandlerRootView>
        <ThemeProvider value={modifiedTheme}>
          <BottomSheetModalProvider>
            <SafeAreaProvider>
              <Stack
                screenOptions={{
                  animation: 'fade',
                  navigationBarTranslucent: true,
                  navigationBarColor: schemeColor.surfaceContainer,
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    fontSize: fontSizes['md'],
                  },
                  headerBackButtonDisplayMode: 'minimal',
                }}
              >
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: 'modal',
                    headerShown: false,
                    navigationBarColor: schemeColor.surface,
                  }}
                />
                <Stack.Screen
                  name="group/[groupId]/edit"
                  options={{
                    headerTitle: i18n.t('editGroupTitle'),
                    navigationBarColor: schemeColor.surface,
                  }}
                />
              </Stack>
              
              {/* Toast notifications */}
              <ToastContainer />
            </SafeAreaProvider>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
    </CrashBoundary>
  )
}

export default RootLayout
