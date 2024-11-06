import { useTheme } from "@/hooks/useTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, SplashScreen } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient()
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const theme = useTheme()

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <Stack
          screenOptions={{
            headerShown: false,
            navigationBarColor: theme.surfaceContainerLow,
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
