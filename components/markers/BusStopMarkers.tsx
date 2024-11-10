import { getLineBusStopLocations } from "@/api/getLineBusStopLocations";
import { useTheme } from "@/hooks/useTheme";
import { useFilters } from "@/stores/filters";
import { useLines } from "@/stores/lines";
import { getRouteFromBusStopLocations } from "@/utils/getRouteFromBusLocations";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Marker } from "react-native-maps";
import { useShallow } from "zustand/react/shallow";

interface Props {
  code: string;
}

// Rerenders when lines are updated, should be optimized later.
export const BusStopMarkersItem = memo(function BusStopMarkersItem(props: Props) {
  const lineColor = useLines(useShallow((state) => state.lineColors[props.code]));
  const selectedRoute = useFilters(useShallow((state) => state.selectedRoutes[props.code]));
  const { theme } = useTheme();

  const query = useQuery({
    queryKey: [`${props.code}-stop-locations`],
    queryFn: () => getLineBusStopLocations(props.code),
    staleTime: 60_000 * 5, // 5 Minutes
  });

  const busStopStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.color,
    borderColor: theme.surfaceContainer,
  };
  
  if (!query.data) {
    return null;
  }

  const dir = getRouteFromBusStopLocations(props.code, selectedRoute, query.data)
  const filteredBusStops = dir ? query.data.filter((item) => item.yon === dir) : query.data;
  
  return (
    <>
      {filteredBusStops.map((bus) => (
        <Marker
          key={`${bus.xKoordinati}-${bus.yKoordinati}-${bus.yon}-${bus.siraNo}`}
          coordinate={{
            latitude: parseFloat(bus.yKoordinati),
            longitude: parseFloat(bus.xKoordinati),
          }}
          pinColor={lineColor}
          tracksViewChanges={false}
          tracksInfoWindowChanges={false}
        >
          <View
            style={[styles.busStop, busStopStyle, { backgroundColor: lineColor }]}
          />
        </Marker>
      ))}
    </>
  );
})

export function BusStopMarkers() {
  const lineKeys = useLines(useShallow(state => Object.keys(state.lines)))

  return (
    <>
      {lineKeys.map((code) => (
        <BusStopMarkersItem key={code} code={code} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  busStop: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 1000,
  },
});
