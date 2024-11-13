import { useIsFocused } from '@react-navigation/native'
import { StatusBar, StatusBarProps } from 'expo-status-bar'

export function TheFocusAwareStatusBar(props: StatusBarProps) {
  const isFocused = useIsFocused()

  return isFocused ? <StatusBar animated translucent {...props} /> : null
}
