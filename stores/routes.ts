import { create } from "zustand";
import { subscribeWithSelector, persist, createJSONStorage } from "zustand/middleware";
import { getRouteBusLocations, Location } from "@/api/getRouteBusLocations";
import { createColor } from "@/utils/createColor";
import { ToastAndroid } from "react-native";
import { LatLng } from "react-native-maps";

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RoutesStore {
  initialMapLocation?: LatLng;
  routes: Record<string, Location[]>;
  routeColors: Record<string, string>;
  updateInitialMapLocation: (newLocation: LatLng) => void;
  addRoute: (code: string) => Promise<void>;
  deleteRoute: (code: string) => void;
  updateRoute: (code: string, newRoute: Location[]) => void;
}

export const useRoutes = create(
  subscribeWithSelector(
    persist<RoutesStore>(
      (set, get) => ({
        initialMapLocation: undefined,
        routes: {},
        routeColors: {},
        updateInitialMapLocation: (newLocation: LatLng) =>
          set((state) => ({ ...state, initialMapLocation: newLocation })),
        addRoute: async (code) => {
          if (Object.keys(get().routes).length > 3) {
            ToastAndroid.show("Only 4 selections are allowed", ToastAndroid.SHORT);

            return;
          }

          const response = await getRouteBusLocations(code);
          if (!response) return;

          return set((state) => {
            const newColor = createColor();

            return {
              ...state,
              routes: {
                ...state.routes,
                [code]: response,
              },
              routeColors: {
                ...state.routeColors,
                [code]: newColor,
              },
            };
          });
        },
        deleteRoute: (code) =>
          set((state) => {
            delete state.routes[code];
            delete state.routeColors[code];

            return {
              routes: {
                ...state.routes,
              },
              routeColors: {
                ...state.routeColors,
              },
            };
          }),
        updateRoute: (code, newLocations) =>
          set((state) => {
            return {
              ...state,
              routes: {
                ...state.routes,
                [code]: newLocations,
              },
            };
          }),
      }),
      {
        name: "route-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);

setInterval(async () => {
  const keys = Object.keys(useRoutes.getState().routes);
  const results = await Promise.all(keys.map((k) => getRouteBusLocations(k)));

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const result = results[index];

    if (result) {
      useRoutes.getState().updateRoute(key, result);
    }
  }
}, 50_000);
