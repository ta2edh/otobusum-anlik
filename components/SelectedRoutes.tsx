import { useRoutes } from "@/stores/routes";
import { useTheme } from "@/hooks/useTheme";
import { UiText } from "./ui/UiText";
import { UiButton } from "./ui/UiButton";
import { StyleSheet, ViewProps } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { i18n } from "@/translations/i18n";

interface Props {
  item: string;
}

export function SelectedRoute(props: Props) {
  const deleteRoute = useRoutes((state) => state.deleteRoute);
  const routeColors = useRoutes((state) => state.routeColors);

  return (
    <Animated.View key={props.item} layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
      <UiButton
        onPress={() => deleteRoute(props.item)}
        title={props.item}
        containerStyle={{ marginRight: 4 }}
        style={{ backgroundColor: routeColors[props.item] }}
      />
    </Animated.View>
  );
}

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
        {i18n.t("selectedRoutes")}
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
