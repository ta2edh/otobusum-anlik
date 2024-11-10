import { useLines } from "@/stores/lines";
import { useFilters } from "@/stores/filters";

import { UiText } from "./ui/UiText";
import { UiButton } from "./ui/UiButton";
import { StyleProp, StyleSheet, ViewProps, ViewStyle, View, ScrollView } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useShallow } from "zustand/react/shallow";
import { SelectedLineAnnouncements } from "./SelectedLineAnnouncements";
import { SelectedLineRoutes } from "./SelectedLineRoutes";

interface Props {
  code: string;
}

export function SelectedLine(props: Props) {
  const rotation = useSharedValue(0);

  const setRoute = useFilters((state) => state.setRoute);
  const deleteLine = useLines((state) => state.deleteLine);

  const selectedRoute = useFilters(useShallow((state) => state.selectedRoutes[props.code]));
  const lineColor = useLines(useShallow((state) => state.lineColors[props.code]));
  const lines = useLines(useShallow((state) => state.lines[props.code]));

  const allRoutes = [...new Set(lines?.map((it) => it.yon))];

  const currentRoute = selectedRoute ?? allRoutes.at(0);
  const otherRouteIndex = allRoutes.length - allRoutes.indexOf(currentRoute) - 1;

  const handleSwiftRoute = () => {
    rotation.value = withTiming(rotation.value + 180, { duration: 500 }, () => {
      runOnJS(setRoute)(props.code, allRoutes[otherRouteIndex]);
    });
  };

  const switchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotateZ: `${rotation.value}deg`,
      },
    ],
  }));

  const containerStyle: StyleProp<ViewStyle> = {
    backgroundColor: lineColor,
    padding: 14,
    borderRadius: 8,
    gap: 8,
    maxWidth: 300,
  };

  return (
    <View style={containerStyle} key={props.code}>
      <View style={styles.titleContainer}>
        <UiText style={{ fontWeight: "bold" }}>{props.code}</UiText>

        <View style={styles.titleContainer}>
          <SelectedLineAnnouncements code={props.code} />

          <UiButton onPress={() => deleteLine(props.code)} style={styles.lineButton}>
            <Ionicons name="trash-outline" size={16} color="white" />
          </UiButton>
        </View>
      </View>

      <SelectedLineRoutes code={props.code} />

      {allRoutes.length > 0 && (
        <View style={styles.lineButtonsContainer}>
          {allRoutes.length > 1 && (
            <>
              <UiButton onPress={handleSwiftRoute} style={styles.lineButton}>
                <Animated.View style={switchAnimatedStyle}>
                  <Ionicons name="refresh" size={20} color="white" />
                </Animated.View>
              </UiButton>

              <UiButton
                title={allRoutes[otherRouteIndex]}
                style={styles.lineButton}
                containerStyle={{ flexShrink: 1 }}
              />
            </>
          )}

          <Ionicons name="arrow-forward" size={18} color="rgba(0, 0, 0, 0.5)" />
          <UiButton
            title={currentRoute}
            style={styles.lineButton}
            containerStyle={{ flexShrink: 1 }}
          />
        </View>
      )}
    </View>
  );
}

export function SelectedLines({ style, ...rest }: ViewProps) {
  const keys = useLines(useShallow((state) => Object.keys(state.lines)));
  const lineKeys = keys || [];

  if (lineKeys.length < 1) {
    return null;
  }

  return (
    <View style={style} {...rest}>
      <ScrollView contentContainerStyle={styles.codes} horizontal>
        {lineKeys.map((code) => (
          <SelectedLine key={code} code={code} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  codes: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    padding: 14,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  lineButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    overflow: "hidden",
  },
  lineButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
