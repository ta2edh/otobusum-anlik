import { getRouteBusStopLocations } from "@/api/getRouteBusStopLocations";
import { useTheme } from "@/hooks/useTheme";
import { useRoutes } from "@/stores/routes";
import { useQuery } from "@tanstack/react-query";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Marker } from "react-native-maps";

interface Props {
  code: string;
}

function BusStopMarkersItem(props: Props) {
  const routeColors = useRoutes((state) => state.routeColors);
  const theme = useTheme();
  const query = useQuery({
    queryKey: [`${props.code}-stop-locations`],
    queryFn: () => getRouteBusStopLocations(props.code),
    staleTime: 60_000 * 5, // 5 Minutes
  });

  const busStopStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.color,
    borderColor: theme.surfaceContainer,
  };

  if (!query.data) {
    return null;
  }

  return (
    <>
      {query.data.map((bus) => (
        <Marker
          key={`${bus.xKoordinati}-${bus.yKoordinati}-${bus.yon}`}
          coordinate={{
            latitude: parseFloat(bus.yKoordinati),
            longitude: parseFloat(bus.xKoordinati),
          }}
          pinColor={routeColors[bus.hatKodu]}
        >
          <View
            style={[styles.busStop, busStopStyle, { backgroundColor: routeColors[bus.hatKodu] }]}
          />
        </Marker>
      ))}
    </>
  );
}

export function BusStopMarkers() {
  const routes = useRoutes((state) => state.routes);
  const routeKeys = Object.keys(routes);

  return (
    <>
      {routeKeys.map((code) => (
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
