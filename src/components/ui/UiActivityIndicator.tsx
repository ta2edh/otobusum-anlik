import { ActivityIndicator, ActivityIndicatorProps } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

export const UiActivityIndicator = (props: ActivityIndicatorProps) => {
  const { colorsTheme } = useTheme()

  return (
    <ActivityIndicator
      color={colorsTheme.color}
      {...props}
    />
  )
}
