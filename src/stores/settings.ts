import AsyncStorage from '@react-native-async-storage/async-storage'
import { ColorSchemeName } from 'react-native'
import { Region } from 'react-native-maps'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

export interface SettingsStore {
  initialMapLocation?: Region
  showMyLocation: boolean
  showTraffic: boolean
  colorScheme?: ColorSchemeName
  clusterStops: boolean
  useAppleMaps: boolean
}

export const useSettingsStore = create(
  subscribeWithSelector(
    persist<SettingsStore>(
      () => ({
        initialMapLocation: undefined,
        showMyLocation: true,
        showTraffic: true,
        colorScheme: undefined,
        clusterStops: false,
        useAppleMaps: false,
      }),
      {
        name: 'settings-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)
