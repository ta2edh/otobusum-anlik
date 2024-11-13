import { getLineBusStopLocations } from "@/api/getLineBusStopLocations";
import { useRouteFilter } from "@/hooks/useRouteFilter";
import { useTheme } from "@/hooks/useTheme";
import { useFilters } from "@/stores/filters";
import { useLines } from "@/stores/lines";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Callout, Marker } from "react-native-maps";
import { useShallow } from "zustand/react/shallow";
import { UiText } from "../ui/UiText";

interface Props {
  code: string;
}

export const BusStopMarkersItem = memo(function BusStopMarkersItem(props: Props) {
  const lineTheme = useLines(useShallow((state) => state.lineTheme[props.code]));
  const selectedRoute = useFilters(useShallow((state) => state.selectedRoutes[props.code]));

  const { colorsTheme, getSchemeColorHex } = useTheme(lineTheme);
  const { getRouteDirection, getDefaultRoute } = useRouteFilter(props.code);

  const query = useQuery({
    queryKey: [`${props.code}-stop-locations`],
    queryFn: () => getLineBusStopLocations(props.code),
    staleTime: 60_000 * 5, // 5 Minutes
  });

  const calloutContainerBackground: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainerLow,
  };

  if (!query.data) {
    return null;
  }

  const route = selectedRoute || getDefaultRoute()?.route_code;
  const direction = route ? getRouteDirection(route) : undefined;
  const busStops = direction ? query.data.filter((stop) => stop.yon === direction) : query.data;
  
  const backgroundColor = getSchemeColorHex("primary")

  const busStopStyle: StyleProp<ViewStyle> = {
    borderColor: getSchemeColorHex("outlineVariant"),
  };

  return (
    <>
      {busStops.map((stop) => (
        <Marker
          key={`${stop.xKoordinati}-${stop.yKoordinati}-${stop.yon}-${stop.siraNo}`}
          coordinate={{
            latitude: parseFloat(stop.yKoordinati),
            longitude: parseFloat(stop.xKoordinati),
          }}
          tracksInfoWindowChanges={false}
          tracksViewChanges={false}
        >
          <View style={[styles.busStop, busStopStyle, { backgroundColor }]} />

          <Callout tooltip>
            <View style={[styles.calloutContainer, calloutContainerBackground]}>
              <UiText style={{ textAlign: "center", }}>
                {stop.durakKodu} - {stop.durakAdi}
              </UiText>
            </View>
          </Callout>
        </Marker>
      ))}
    </>
  );
});

export function BusStopMarkers() {
  const lineKeys = useLines(useShallow((state) => Object.keys(state.lines)));

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
    width: 12,
    height: 12,
    borderWidth: 1,
    borderRadius: 1000,
  },
  calloutContainer: {
    width: 250,
    padding: 8,
    borderRadius: 8,
  },
});
