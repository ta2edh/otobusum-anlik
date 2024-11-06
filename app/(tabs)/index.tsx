import { View, StyleSheet, useColorScheme } from "react-native";
import { mapDarkStyle } from "@/constants/mapStyles";
import { colors } from "@/constants/colors";

import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TheSearch } from "@/components/TheSearch";
import { RouteMarkers } from "@/components/RouteMarkers";
import { TheFocusAwareStatusBar } from "@/components/TheFocusAwareStatusbar";
import { useRoutes } from "@/stores/routes";
import { SplashScreen } from "expo-router";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const initialMapLocation = useRoutes.getState().initialMapLocation
  const updateInitialMapLocation = useRoutes((state) => state.updateInitialMapLocation)

  const handleRegionChangeComplete = (props: Region) => {
    updateInitialMapLocation({ latitude: props.latitude, longitude: props.longitude })
  }

  const handleMapLoaded = () => {
    SplashScreen.hideAsync()
  }

  return (
    <View style={styles.container}>
      <TheFocusAwareStatusBar />
      
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialCamera={{
          center: initialMapLocation,
          heading: 0,
          pitch: 0,
          zoom: 13,
        }}
        customMapStyle={colorScheme === "dark" ? mapDarkStyle : undefined}
        showsTraffic={true}
        mapPadding={{ top: insets.top, bottom: 0, left: 0, right: 0 }}
        onRegionChangeComplete={handleRegionChangeComplete}
        onMapLoaded={handleMapLoaded}
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
