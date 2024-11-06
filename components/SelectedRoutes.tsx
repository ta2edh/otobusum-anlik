import { useRoutes } from "@/stores/routes";
import { useTheme } from "@/hooks/useTheme";

import { UiText } from "./ui/UiText";
import { SelectedRoute } from "./SelectedRoute";

import { StyleSheet, ViewProps } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export function SelectedRoutes({ style, ...rest }: ViewProps) {
  const theme = useTheme();
  const routes = useRoutes((state) => state.routes);

  const routeKeys = Object.keys(routes) || [];

  if (routeKeys.length < 1) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[{ backgroundColor: theme.surfaceContainer }, styles.container, style]}
      {...rest}
    >
      <UiText
        info
        style={{
          marginLeft: 8,
          marginBottom: 8,
        }}
      >
        Selected Routes
      </UiText>

      <Animated.View style={styles.codes}>
        {routeKeys.map((item) => (
          <SelectedRoute key={item} item={item} />
        ))}
      </Animated.View>

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
    padding: 8,
  },
  empty: {
    textAlign: "center",
    fontWeight: "bold",
  },
  codes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
});
