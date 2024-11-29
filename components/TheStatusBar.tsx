import { useSettings } from '@/stores/settings'
import { StatusBar, StatusBarProps } from 'expo-status-bar'
import { useShallow } from 'zustand/react/shallow'

export function TheStatusBar(props: StatusBarProps) {
  const colorScheme = useSettings(useShallow(state => state.colorScheme))

  const style = colorScheme
    ? colorScheme === 'dark'
      ? 'light'
      : 'dark'
    : undefined

  return <StatusBar style={style} animated translucent {...props} />
}
