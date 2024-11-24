import { UiText } from '@/components/ui/UiText'
import { useTheme } from '@/hooks/useTheme'
import { usePaddings } from '@/hooks/usePaddings'
import { useSettings } from '@/stores/settings'

import { ScrollView, StyleProp, StyleSheet, Switch, View, ViewStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import * as Location from 'expo-location'
import Constants from 'expo-constants'
import { i18n } from '@/translations/i18n'
import { colors } from '@/constants/colors'

export default function Settings() {
  const paddings = usePaddings()
  const showMyLocation = useSettings(useShallow(state => state.showMyLocation))
  const showTraffic = useSettings(useShallow(state => state.showTraffic))
  const { colorsTheme } = useTheme()

  const dynamicSettingContainer: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainer,
  }

  const handleToggleLocation = async () => {
    let showLocation = useSettings.getState().showMyLocation
    if (!showLocation) {
      const { granted } = await Location.requestForegroundPermissionsAsync()
      if (granted) {
        showLocation = true
      }
    } else {
      showLocation = false
    }

    useSettings.setState(() => ({
      showMyLocation: showLocation,
    }))
  }

  const handleTrafficInformation = () => {
    useSettings.setState(state => ({
      showTraffic: !state.showTraffic,
    }))
  }

  return (
    <ScrollView
      style={[paddings, styles.scrollContainer]}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.outerContainer}>
        <UiText style={styles.title}>{i18n.t('map')}</UiText>

        <View style={[styles.settingContainer, dynamicSettingContainer]}>
          <UiText>{i18n.t('showMyLocation')}</UiText>
          <Switch
            onValueChange={handleToggleLocation}
            value={showMyLocation}
            thumbColor={colors.primary}
            trackColor={{ true: colors.primaryDarker }}
          />
        </View>
        <View style={[styles.settingContainer, dynamicSettingContainer]}>
          <UiText>{i18n.t('showTraffic')}</UiText>
          <Switch
            onValueChange={handleTrafficInformation}
            value={showTraffic}
            thumbColor={colors.primary}
            trackColor={{ true: colors.primaryDarker }}
          />
        </View>
      </View>

      <UiText info style={styles.version}>
        {`${i18n.t('version')} ${Constants.expoConfig?.version}`}
      </UiText>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  outerContainer: {
    gap: 8,
  },
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
  version: {
    marginTop: 'auto',
  },
})
