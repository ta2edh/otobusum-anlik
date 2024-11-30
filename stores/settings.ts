import AsyncStorage from '@react-native-async-storage/async-storage'
import { ColorSchemeName } from 'react-native'
import { LatLng } from 'react-native-maps'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

export interface SettingsStore {
  initialMapLocation?: LatLng
  showMyLocation: boolean
  showTraffic: boolean
  colorScheme?: ColorSchemeName
}

export const useSettings = create(
  subscribeWithSelector(
    persist<SettingsStore>(
      () => ({
        initialMapLocation: undefined,
        showMyLocation: false,
        showTraffic: true,
        colorScheme: undefined,
      }),
      {
        name: 'settings-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)
