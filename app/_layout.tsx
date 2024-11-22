import { queryClient } from '@/api/client'
import { useTheme } from '@/hooks/useTheme'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClientProvider } from '@tanstack/react-query'

import { Stack, SplashScreen } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { colorsTheme } = useTheme()

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              navigationBarColor: colorsTheme.surfaceContainerLow,
            }}
          >
            <Stack.Screen name="(tabs)" />
          </Stack>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}
