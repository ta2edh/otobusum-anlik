import { useLines } from "@/stores/lines";
import { useTheme } from "@/hooks/useTheme";
import { Marker, Callout } from "react-native-maps";
import { StyleProp, ViewStyle, View, Image, StyleSheet } from "react-native";
import { UiText } from "@/components/ui/UiText";
import { i18n } from "@/translations/i18n";
import { useFilters } from "@/stores/filters";
import { useShallow } from "zustand/react/shallow";
import { memo } from "react";

interface Props {
  code: string,
}

export const LineBusMarkers = memo(function LineBusMarkers(props: Props) {
  const { theme } = useTheme()

  const line = useLines(useShallow(state => state.lines[props.code]))
  const lineColor = useLines(useShallow((state) => state.lineColors[props.code]));
  const selectedRoute = useFilters(useShallow((state) => state.selectedRoutes[props.code]));

  const filtered = line.filter(loc => loc.yon  === selectedRoute)

  const calloutStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.surfaceContainer,
    padding: 8,
    width: 250,
    borderRadius: 8,
  }

  return (
    <>
      {filtered.map((loc) => (
        <Marker
          key={loc.kapino}
          coordinate={{
            latitude: parseFloat(loc.enlem),
            longitude: parseFloat(loc.boylam),
          }}
          pinColor={lineColor}
          tracksInfoWindowChanges={false}
        >
          <View style={[styles.iconContainer, { backgroundColor: lineColor }]}>
            <Image source={require("@/assets/bus.png")} style={styles.icon} />
          </View>

          <Callout alphaHitTest tooltip>
            <View style={calloutStyle}>
              <View>
                <UiText>
                  {loc.hatkodu} - {loc.hatad}
                </UiText>
                <UiText>{i18n.t("direction")}: {loc.yon}</UiText>
                <UiText>{i18n.t("lastUpdate")}: {loc.son_konum_zamani}</UiText>
              </View>
            </View>
          </Callout>
        </Marker>
      ))}
    </>
  );
})

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
