import { HeaderBackButton } from '@react-navigation/elements'
import { Stack, router } from 'expo-router'

export const HomeSearchLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="stop/[stopId]"
        options={{
          headerTransparent: true,
          headerTitle: '',
          headerLeft: (props) => {
            if (!props.canGoBack) return null

            return (
              <HeaderBackButton
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 999 }}
                onPress={() => router.back()}
                {...props}
              />
            )
          },
        }}
      />
    </Stack>
  )
}

export default HomeSearchLayout
