import { StyleSheet, View, Image, StyleProp, ViewStyle } from "react-native";
import { Callout, MapMarker, Marker } from "react-native-maps";
import { useShallow } from "zustand/react/shallow";
import { useRef } from "react";

import { i18n } from "@/translations/i18n";
import { UiText } from "@/components/ui/UiText";
import { useLines } from "@/stores/lines";
import { Location } from "@/api/getLineBusLocations";
import { useTheme } from "@/hooks/useTheme";

export function LineBusMarker({ location, lineCode }: { lineCode: string; location: Location }) {
  const markerRef = useRef<MapMarker>(null);
  const lineColor = useLines(useShallow((state) => state.lineColors[lineCode]));
  const { theme } = useTheme();

  const calloutStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.surfaceContainer,
    padding: 8,
    width: 250,
    borderRadius: 8,
  };

  return (
    <Marker
      ref={markerRef}
      key={location.kapino}
      coordinate={{
        latitude: parseFloat(location.enlem),
        longitude: parseFloat(location.boylam),
      }}
      pinColor={lineColor}
      tracksInfoWindowChanges={false}
      tracksViewChanges={false}
    >
      <View style={[styles.iconContainer, { backgroundColor: lineColor }]}>
        <Image
          fadeDuration={0}
          source={require("@/assets/bus.png")}
          onLoad={() => {
            markerRef.current?.redraw();
          }}
          style={styles.icon}
        />
      </View>

      <Callout alphaHitTest tooltip>
        <View style={calloutStyle}>
          <View>
            <UiText>
              {location.hatkodu} - {location.hatad}
            </UiText>
            <UiText>
              {i18n.t("direction")}: {location.yon}
            </UiText>
            <UiText>
              {i18n.t("lastUpdate")}: {location.son_konum_zamani}
            </UiText>
          </View>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 999,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  icon: {
    width: 10,
    height: 10,
  },
});
