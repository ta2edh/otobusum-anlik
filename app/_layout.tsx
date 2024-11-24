import { queryClient, persister } from '@/api/client'
import { useTheme } from '@/hooks/useTheme'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

import { Stack, SplashScreen } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { DefaultTheme, DarkTheme, ThemeProvider, Theme } from '@react-navigation/native'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { DehydrateOptions } from '@tanstack/react-query'
import { i18n } from '@/translations/i18n'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
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
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <ThemeProvider value={modifiedTheme}>
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
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  )
}
