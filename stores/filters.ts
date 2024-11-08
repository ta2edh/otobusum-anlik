import { create } from "zustand";
import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface FiltersStore {
  selectedDirections: Record<string, string>;
  setDirection: (code: string, direction: string) => void;
}

export const useFilters = create(
  subscribeWithSelector(
    persist<FiltersStore>(
      (set, _get) => ({
        selectedDirections: {},
        setDirection: (code, direction) =>
          set((state) => ({
            selectedDirections: { ...state.selectedDirections, [code]: direction },
          })),
      }),
      {
        name: "filter-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
