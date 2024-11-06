import { useRoutes } from "@/stores/routes";
import { useTheme } from "@/hooks/useTheme";
import { Marker, Callout } from "react-native-maps";
import { StyleProp, ViewStyle, View, Image, StyleSheet } from "react-native";
import { UiText } from "./ui/UiText";

export function BusMarkers() {
  const theme = useTheme()
  const routes = useRoutes((state) => state.routes);
  const routeColors = useRoutes((state) => state.routeColors);

  const locationsFlat = Object.values(routes).flat();

  const calloutStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.surfaceContainer,
    padding: 8,
    width: 250,
    borderRadius: 8,
  }

  return (
    <>
      {locationsFlat?.map((loc) => (
        <Marker
          key={loc.kapino}
          coordinate={{
            latitude: parseFloat(loc.enlem),
            longitude: parseFloat(loc.boylam),
          }}
          pinColor={routeColors[loc.hatkodu]}
        >
          <View style={[styles.iconContainer, { backgroundColor: routeColors[loc.hatkodu] }]}>
            <Image source={require("../assets/bus.png")} style={styles.icon} />
          </View>

          <Callout alphaHitTest tooltip>
            <View style={calloutStyle}>
              <View>
                <UiText>
                  {loc.hatkodu} - {loc.hatad}
                </UiText>
                <UiText>Direction: {loc.yon}</UiText>
                <UiText>Last Update: {loc.son_konum_zamani}</UiText>
              </View>
            </View>
          </Callout>
        </Marker>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 999,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  icon: {
    width: 10,
    height: 10,
  }
})
