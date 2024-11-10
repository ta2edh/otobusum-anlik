import { create } from "zustand";
import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineRoute } from "@/api/getAllRoutes";

export interface FiltersStore {
  selectedRoutes: Record<string, LineRoute>;
  setRoute: (code: string, route: LineRoute) => void;
}

export const useFilters = create(
  subscribeWithSelector(
    persist<FiltersStore>(
      (set, _get) => ({
        selectedRoutes: {},
        setRoute: (code, route) =>
          set((state) => ({
            selectedRoutes: { ...state.selectedRoutes, [code]: route },
          })),
      }),
      {
        name: "filter-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
