import AsyncStorage from "@react-native-async-storage/async-storage";
import { LatLng } from "react-native-maps";
import { create } from "zustand";
import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware";

export interface SettingsStore {
  initialMapLocation?: LatLng;
}

export const useSettings = create(
  subscribeWithSelector(
    persist<SettingsStore>(
      () => ({
        initialMapLocation: undefined,
      }),
      {
        name: "settings-storage",
        storage: createJSONStorage(() => AsyncStorage)
      }
    )
  )
)
