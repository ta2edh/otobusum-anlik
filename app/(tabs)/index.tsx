import { View, StyleSheet, useColorScheme } from "react-native";
import { mapDarkStyle } from "@/constants/mapStyles";
import { colors } from "@/constants/colors";

import MapView, { Details, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TheSearch } from "@/components/TheSearch";
import { RouteMarkers } from "@/components/RouteMarkers";
import { TheFocusAwareStatusBar } from "@/components/TheFocusAwareStatusbar";
import { useRoutes } from "@/stores/routes";
import { SplashScreen } from "expo-router";
import { useCallback, useRef } from "react";

export default function HomeScreen() {
  const map = useRef<MapView>(null);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const updateInitialMapLocation = useRoutes((state) => state.updateInitialMapLocation);

  const handleReady = useCallback(() => {
    map.current?.animateCamera({
      center: useRoutes.getState().initialMapLocation,
      zoom: 13,
      heading: 0,
      pitch: 0,
    })
  }, [])

  const handleRegionChangeComplete = useCallback((props: Region, details: Details) => {
    if (!details.isGesture) return

    updateInitialMapLocation({ latitude: props.latitude, longitude: props.longitude });
  }, []);

  const handleMapLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <View style={styles.container}>
      <TheFocusAwareStatusBar />

      <MapView
        ref={map}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialCamera={{
          center: { latitude: 41.0082, longitude: 28.9784 },
          heading: 0,
          pitch: 0,
          zoom: 13,
        }}
        customMapStyle={colorScheme === "dark" ? mapDarkStyle : undefined}
        showsTraffic={true}
        mapPadding={{ top: insets.top, bottom: 0, left: 0, right: 0 }}
        onRegionChangeComplete={handleRegionChangeComplete}
        onMapLoaded={handleMapLoaded}
        onMapReady={handleReady}
      >
        <RouteMarkers />
      </MapView>

      <TheSearch />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "white",
  },
  map: {
    flex: 1,
  },
  handle: {
    backgroundColor: colors.dark.surfaceContainerLow,
  },
  sheetBackground: {
    backgroundColor: colors.dark.surfaceContainerLow,
  },
});
