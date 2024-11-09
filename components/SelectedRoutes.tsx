import { useRoutes } from "@/stores/routes";
import { useFilters } from "@/stores/filters";

import { UiText } from "./ui/UiText";
import { UiButton } from "./ui/UiButton";
import { StyleProp, StyleSheet, ViewProps, ViewStyle, View, ScrollView } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useShallow } from "zustand/react/shallow"

interface Props {
  code: string;
}

export function SelectedRoute(props: Props) {
  const setDirection = useFilters((state) => state.setDirection);
  const deleteRoute = useRoutes((state) => state.deleteRoute);
  const routeColors = useRoutes((state) => state.routeColors);

  const selectedDirections = useFilters(useShallow((state) => state.selectedDirections[props.code]));
  const routes = useRoutes(useShallow(state => state.routes[props.code]));

  const allDirections = [...new Set(routes?.map((it) => it.yon))];

  const currentDirection = selectedDirections ?? allDirections[0];
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
      layout={LinearTransition}
      exiting={FadeOut}
      entering={FadeIn}
      style={containerStyle}
      key={props.code}
    >
      <View style={styles.titleContainer}>
        <UiText style={{ fontWeight: "bold" }}>{props.code}</UiText>
        <UiButton onPress={() => deleteRoute(props.code)} style={styles.routeButton}>
          <Ionicons name="trash-outline" size={10} color="white" />
        </UiButton>
      </View>

      {allDirections.length > 0 && (
        <View style={styles.routeButtonsContainer}>
          {allDirections.length > 1 && (
            <>
              <UiButton onPress={handleSwiftDirection}>
                <Ionicons name="refresh" size={20} color="white" />
              </UiButton>
              <UiButton
                title={allDirections[otherDirectionIndex]}
                style={styles.routeButton}
                size="sm"
              />
            </>
          )}

          <Ionicons name="arrow-forward" size={20} color="rgba(0, 0, 0, 0.5)" />
          <UiButton title={currentDirection} style={styles.routeButton} size="sm" />
        </View>
      )}
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
    <Animated.View entering={FadeIn} exiting={FadeOut} style={style} {...rest}>
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
  codes: {
    flexDirection: "row",
    gap: 8,
    padding: 14,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
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
