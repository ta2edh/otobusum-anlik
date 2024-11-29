import { ViewProps, View, StyleProp, ViewStyle, StyleSheet } from 'react-native'
import { useTheme } from '@/hooks/useTheme'
import { UiText } from '../ui/UiText'

interface ContainerProps extends ViewProps {
  title: string
}

export function GroupContainer(props: ContainerProps) {
  return (
    <View style={styles.outerContainer}>
      <UiText style={styles.title}>{props.title}</UiText>

      {props.children}
    </View>
  )
}

export function SettingContainer(props: ContainerProps) {
  const { colorsTheme } = useTheme()

  const dynamicSettingContainer: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainer,
  }

  return (
    <View style={[styles.settingContainer, dynamicSettingContainer]}>
      <UiText>{props.title}</UiText>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 14,
  },
  outerContainer: {
    gap: 8,
  },
})
