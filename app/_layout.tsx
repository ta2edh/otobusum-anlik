import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native'
import { DehydrateOptions } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { SplashScreen, Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { TheStatusBar } from '@/components/TheStatusBar'

import { useTheme } from '@/hooks/useTheme'

import { persister, queryClient } from '@/api/client'
import { i18n } from '@/translations/i18n'

SplashScreen.preventAutoHideAsync()

export const RootLayout = () => {
  const { colorsTheme, mode } = useTheme()

  const targetTheme = mode === 'dark' ? DarkTheme : DefaultTheme

  const modifiedTheme: Theme = {
    ...targetTheme,
    colors: {
      ...targetTheme.colors,
      background: colorsTheme.surfaceContainerLow,
      card: colorsTheme.surfaceContainerLow,
    },
  }

  const dehydrateOptions: DehydrateOptions = {
    shouldDehydrateQuery: (query) => {
      return !!query.meta?.persist
    },
  }

  return (
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
            <Stack screenOptions={{ navigationBarColor: colorsTheme.surfaceContainerLow }}>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="group/[groupId]/edit"
                options={{ presentation: 'modal', headerTitle: i18n.t('editGroupTitle') }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  )
}

export default RootLayout
