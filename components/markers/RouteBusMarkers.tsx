import { useRoutes } from "@/stores/routes";
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

export const RouteBusMarkers = memo(function RouteBusMarkers(props: Props) {
  const theme = useTheme()

  const route = useRoutes(useShallow(state => state.routes[props.code]))
  const routeColor = useRoutes(useShallow((state) => state.routeColors[props.code]));
  const selectedDirection = useFilters(useShallow((state) => state.selectedDirections[props.code]));

  const filtered = route.filter(loc => loc.yon  === selectedDirection)

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
          pinColor={routeColor}
          tracksInfoWindowChanges={false}
        >
          <View style={[styles.iconContainer, { backgroundColor: routeColor }]}>
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
