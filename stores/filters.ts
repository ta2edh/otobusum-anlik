import { create } from "zustand";
import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware";
import { Direction } from "@/types/departure";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface FiltersStore {
  direction: Direction;
  setDirection: (newDirection: Direction) => void;
}

export const useFilters = create(
  subscribeWithSelector(
    persist<FiltersStore>(
      (set, get) => ({
        direction: "D",
        setDirection: (newDirection) => set(() => ({ direction: newDirection })),
      }),
      {
        name: "filter-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
