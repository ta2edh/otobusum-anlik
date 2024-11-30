import { Switch } from 'react-native'

import { SettingContainer } from './Container'

import { colors } from '@/constants/colors'
import { useSettings } from '@/stores/settings'
import { i18n } from '@/translations/i18n'

export function SettingsCluster() {
  const clusterStops = useSettings(state => state.clusterStops)

  const handleClusterStops = () => {
    useSettings.setState(state => ({
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
