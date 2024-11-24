import { queryClient } from '@/api/client'
import { useTheme } from '@/hooks/useTheme'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClientProvider } from '@tanstack/react-query'

import { Stack, SplashScreen } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
  DefaultTheme,
  DarkTheme,
  ThemeProvider,
  Theme,
} from '@react-navigation/native'

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

  return (
    <QueryClientProvider client={queryClient}>
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
                options={{ presentation: 'modal', headerTitle: 'Edit Group Title' }}
              />
            </Stack>
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}
