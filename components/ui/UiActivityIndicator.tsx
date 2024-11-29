import { useTheme } from '@/hooks/useTheme'
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native'

export function UiActivityIndicator(props: ActivityIndicatorProps) {
  const { colorsTheme } = useTheme()

  return (
    <ActivityIndicator
      color={colorsTheme.color}
      {...props}
    />
  )
}
