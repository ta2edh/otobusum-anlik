import { StatusBarProps, StatusBar, StatusBarStyle } from 'expo-status-bar'

import { useTheme } from '@/hooks/useTheme'

export const TheStatusBar = (props: StatusBarProps) => {
  const { mode } = useTheme()

  const style: StatusBarStyle = mode === 'dark' ? 'light' : 'dark'

  return <StatusBar style={style} animated translucent {...props} />
}
