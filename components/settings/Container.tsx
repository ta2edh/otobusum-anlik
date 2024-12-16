import { Linking, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { UiButton } from '../ui/UiButton'
import { UiText } from '../ui/UiText'

interface ContainerProps extends ViewProps {
  title: string
}

interface SettingProps extends ContainerProps {
  href?: string
}

export const GroupContainer = (props: ContainerProps) => {
  return (
    <View style={styles.outerContainer}>
      <UiText style={styles.title}>{props.title}</UiText>

      {props.children}
    </View>
  )
}

export const SettingContainer = (props: SettingProps) => {
  const { colorsTheme } = useTheme()

  const dynamicSettingContainer: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainer,
  }

  return (
    <>
      {props.href
        ? (
            <UiButton
              title={props.title}
              variant="ghost"
              containerStyle={[styles.settingContainer, dynamicSettingContainer]}
              onPress={() => Linking.openURL(props.href!)}
            />
          )
        : (
            <View style={[styles.settingContainer, dynamicSettingContainer]}>
              <UiText>{props.title}</UiText>
              {props.children}
            </View>
          )}
    </>

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
    minHeight: 52,
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
