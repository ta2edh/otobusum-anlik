import { create } from "zustand";
import { subscribeWithSelector, persist, createJSONStorage } from "zustand/middleware";
import { getLineBusLocations, Location } from "@/api/getLineBusLocations";
import { createColor } from "@/utils/createColor";
import { ToastAndroid } from "react-native";
import { LatLng } from "react-native-maps";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFilters } from "./filters";

export interface LinesStore {
  initialMapLocation?: LatLng;
  lines: Record<string, Location[]>;
  lineColors: Record<string, string>;
  updateInitialMapLocation: (newLocation: LatLng) => void;
  addLine: (code: string) => Promise<void>;
  deleteLine: (code: string) => void;
  updateLine: (code: string, newLine: Location[]) => void;
}

export const useLines = create(
  subscribeWithSelector(
    persist<LinesStore>(
      (set, get) => ({
        initialMapLocation: undefined, // TODO: move this to different store. (Maybe something called settings)
        lines: {},
        lineColors: {},
        updateInitialMapLocation: (newLocation: LatLng) =>
          set((state) => ({ ...state, initialMapLocation: newLocation })),
        addLine: async (code) => {
          if (Object.keys(get().lines).length > 3) {
            ToastAndroid.show("Only 4 selections are allowed", ToastAndroid.SHORT);
            return;
          }

          const response = await getLineBusLocations(code);
          if (!response) return;

          return set((state) => {
            const newColor = createColor();

            return {
              ...state,
              lines: {
                ...state.lines,
                [code]: response,
              },
              lineColors: {
                ...state.lineColors,
                [code]: newColor,
              },
            };
          });
        },
        deleteLine: (code) =>
          set((state) => {
            delete state.lines[code];
            delete state.lineColors[code];

            return {
              lines: {
                ...state.lines,
              },
              lineColors: {
                ...state.lineColors,
              },
            };
          }),
        updateLine: (code, newLocations) =>
          set((state) => {
            // Filter update stuff
            const currentRoute = useFilters.getState().selectedRoutes[code];
            if (currentRoute) {
              const foundIndex = newLocations.findIndex((it) => it.yon === currentRoute.route_code); //TODO
              if (foundIndex === -1) {
                if (newLocations.length > 0) {
                  useFilters.setState((state) => {
                    return {
                      selectedRoutes: {
                        ...state.selectedRoutes,
                        // [code]: newLocations[0].guzergahkodu,
                      }
                    }
                  })
                } else {
                  useFilters.setState((state) => {
                    delete state.selectedRoutes[code];
                    return state;
                  });
                }
              }
            }
            //

            return {
              ...state,
              lines: {
                ...state.lines,
                [code]: newLocations,
              },
            };
          }),
      }),
      {
        name: "line-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);

const updateLines = async () => {
  const keys = Object.keys(useLines.getState().lines);
  const results = await Promise.all(keys.map((k) => getLineBusLocations(k)));

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const result = results[index];

    if (result) {
      useLines.getState().updateLine(key, result);
    }
  }

  setTimeout(updateLines, 50_000);
};

if (!__DEV__) {
  useLines.persist.onFinishHydration(updateLines);
}
