import { useRoutes } from "@/stores/routes";
import { useFilters } from "@/stores/filters";

import { UiText } from "./ui/UiText";
import { UiButton } from "./ui/UiButton";
import { StyleProp, StyleSheet, ViewProps, ViewStyle, View, ScrollView } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  code: string;
}

export function SelectedRoute(props: Props) {
  const selectedDirections = useFilters((state) => state.selectedDirections);
  const setDirection = useFilters((state) => state.setDirection);
  const deleteRoute = useRoutes((state) => state.deleteRoute);
  const routeColors = useRoutes((state) => state.routeColors);
  const routes = useRoutes((state) => state.routes);

  const allDirections = [...new Set(routes[props.code].map((it) => it.yon))];

  const currentDirection = selectedDirections[props.code] ?? allDirections[0];
  const otherDirectionIndex = allDirections.length - allDirections.indexOf(currentDirection) - 1;

  const handleSwiftDirection = () => {
    setDirection(props.code, allDirections[otherDirectionIndex]);
  };

  const containerStyle: StyleProp<ViewStyle> = {
    backgroundColor: routeColors[props.code],
    padding: 14,
    borderRadius: 8,
    gap: 8,
    maxWidth: 300,
  };

  return (
    <Animated.View
      style={containerStyle}
      key={props.code}
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <View style={styles.titleContainer}>
        <UiText style={{ fontWeight: "bold" }}>{props.code}</UiText>
        <UiButton onPress={() => deleteRoute(props.code)} style={styles.routeButton}>
          <Ionicons name="trash-outline" size={10} color="white" />
        </UiButton>
      </View>

      <View style={styles.routeButtonsContainer}>
        <UiButton title={allDirections[otherDirectionIndex]} style={styles.routeButton} size="sm" />
        <UiButton onPress={handleSwiftDirection}>
          <Ionicons name="refresh" size={20} color="white" />
        </UiButton>
        <UiButton title={currentDirection} style={styles.routeButton} size="sm" />
      </View>
    </Animated.View>
  );
}

export function SelectedRoutes({ style, ...rest }: ViewProps) {
  const routes = useRoutes((state) => state.routes);

  const routeKeys = Object.keys(routes) || [];

  if (routeKeys.length < 1) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.container, style]} {...rest}>
      <ScrollView contentContainerStyle={styles.codes} horizontal>
        {routeKeys.map((code) => (
          <SelectedRoute key={code} code={code} />
        ))}
      </ScrollView>

      {/* https://github.com/gorhom/react-native-bottom-sheet/issues/1939 */}
      {/* <BottomSheetFlashList
        data={routeKeys}
        renderItem={renderItem}
        estimatedItemSize={60}
        horizontal
        directionalLockEnabled
      /> */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  empty: {
    textAlign: "center",
    fontWeight: "bold",
  },
  codes: {
    flexDirection: "row",
    gap: 8,
    padding: 14,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    overflow: "hidden",
  },
  routeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
  },
});
