import { Switch } from 'react-native'

import { SettingContainer } from './Container'

import { colors } from '@/constants/colors'
import { useSettingsStore } from '@/stores/settings'
import { i18n } from '@/translations/i18n'

export function SettingsCluster() {
  const clusterStops = useSettingsStore(state => state.clusterStops)

  const handleClusterStops = () => {
    useSettingsStore.setState(state => ({
      clusterStops: !state.clusterStops,
    }))
  }

  return (
    <SettingContainer title={i18n.t('clusterBusStops')}>
      <Switch
        onValueChange={handleClusterStops}
        value={clusterStops}
        thumbColor={colors.primary}
        trackColor={{ true: colors.primaryDarker }}
      />
    </SettingContainer>
  )
}
