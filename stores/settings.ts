import AsyncStorage from '@react-native-async-storage/async-storage'
import { LatLng } from 'react-native-maps'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

export interface SettingsStore {
  initialMapLocation?: LatLng
  showMyLocation: boolean
  showTraffic: boolean
}

export const useSettings = create(
  subscribeWithSelector(
    persist<SettingsStore>(
      () => ({
        initialMapLocation: undefined,
        showMyLocation: false,
        showTraffic: true,
      }),
      {
        name: 'settings-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)
