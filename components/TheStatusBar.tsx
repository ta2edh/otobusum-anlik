import { StatusBarProps } from 'expo-status-bar'
import { StatusBar, StatusBarStyle } from 'react-native'
import { useTheme } from '@/hooks/useTheme'

export function TheStatusBar(props: StatusBarProps) {
  const { mode } = useTheme()

  const style: StatusBarStyle = mode === 'dark' ? 'light-content' : 'dark-content'

  setTimeout(() => {
    StatusBar.setBarStyle(style)
  }, 0)

  return <StatusBar barStyle={style} animated translucent {...props} />
}
