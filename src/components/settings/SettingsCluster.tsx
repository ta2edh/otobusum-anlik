import { SettingsContainer } from './SettingsContainer'

import { useSettingsStore } from '@/stores/settings'
import { i18n } from '@/translations/i18n'

export const SettingsCluster = () => {
  const clusterStops = useSettingsStore(state => state.clusterStops)

  const handleClusterStops = () => {
    useSettingsStore.setState(state => ({
      clusterStops: !state.clusterStops,
    }))
  }

  return (
    <SettingsContainer
      type="switch"
      title={i18n.t('clusterBusStops') || 'Cluster Bus Stops'}
      value={clusterStops}
      onChange={handleClusterStops}
    />
  )
}
