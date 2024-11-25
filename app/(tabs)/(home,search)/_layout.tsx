import { router, Stack } from 'expo-router'
import { HeaderBackButton } from '@react-navigation/elements'

export default function Both() {
  return (
    <Stack
      screenOptions={{
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
  )
}
