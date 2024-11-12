import { useLines } from "@/stores/lines";
import { useFilters } from "@/stores/filters";

import { UiText } from "./ui/UiText";
import { UiButton } from "./ui/UiButton";
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  FadeInLeft,
  FlatListPropsWithLayout,
  LinearTransition,
  ZoomIn,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useShallow } from "zustand/react/shallow";
import { SelectedLineAnnouncements } from "./SelectedLineAnnouncements";
import { SelectedLineRoutes } from "./SelectedLineRoutes";
import { useRouteFilter } from "@/hooks/useRouteFilter";
import { UiActivityIndicator } from "./ui/UiActivityIndicator";

interface Props {
  code: string;
}

export function SelectedLine(props: Props) {
  const { width } = useWindowDimensions();

  const setRoute = useFilters(useShallow((state) => state.setRoute));
  const deleteLine = useLines(useShallow((state) => state.deleteLine));
  const {
    findOtherRouteDirection,
    findRouteFromCode,
    query: { isPending },
  } = useRouteFilter(props.code);

  const selectedRouteCode = useFilters(useShallow((state) => state.selectedRoutes[props.code]));
  const lineColor = useLines(useShallow((state) => state.lineColors[props.code]));

  const route = selectedRouteCode ? findRouteFromCode(selectedRouteCode) : undefined;
  const [leftTitle, rightTitle] = route?.route_long_name.trim().split("-") ?? ["", ""] ?? ["", ""];

  const handleSwitchRoute = () => {
    if (!selectedRouteCode) return;

    const otherDirection = findOtherRouteDirection(selectedRouteCode);
    if (!otherDirection) return;

    setRoute(props.code, otherDirection.route_code);
  };

  const containerStyle: StyleProp<ViewStyle> = {
    backgroundColor: lineColor,
    maxWidth: width * 0.8,
  };

  return (
    <Animated.View
      layout={LinearTransition}
      entering={ZoomIn}
      style={[containerStyle, styles.container]}
      key={props.code}
    >
      <View style={styles.titleContainer}>
        <UiText style={{ fontWeight: "bold" }}>{props.code}</UiText>

        <View style={styles.titleContainer}>
          <SelectedLineAnnouncements code={props.code} />

          <UiButton onPress={() => deleteLine(props.code)} style={styles.lineButton}>
            <Ionicons name="trash-outline" size={16} color="white" />
          </UiButton>
        </View>
      </View>

      {isPending ? (
        <UiActivityIndicator size={24} />
      ) : (
        <Animated.View entering={FadeInLeft} style={styles.routeContainer}>
          <View style={styles.lineButtonsContainer}>
            <UiButton onPress={handleSwitchRoute} style={styles.lineButton}>
              <Ionicons name="refresh" size={16} color="white" />
            </UiButton>

            <SelectedLineRoutes code={props.code} />
          </View>

          <View style={styles.lineButtonsContainer}>
            <UiText style={styles.directionText} numberOfLines={1}>
              {leftTitle}
            </UiText>
            <Ionicons name="arrow-forward" size={18} color="rgba(0, 0, 0, 0.5)" />
            <UiText style={styles.directionText} numberOfLines={1}>
              {rightTitle}
            </UiText>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export function SelectedLines({
  style,
  ...rest
}: Omit<FlatListPropsWithLayout<string>, "data" | "renderItem">) {
  const keys = useLines(useShallow((state) => Object.keys(state.lines)));
  const { width } = useWindowDimensions();
  const lineKeys = keys || [];

  if (lineKeys.length < 1) {
    return null;
  }

  return (
    <Animated.FlatList
      {...rest}
      layout={LinearTransition}
      contentContainerStyle={styles.codes}
      data={lineKeys}
      renderItem={({ item: code }) => <SelectedLine key={code} code={code} />}
      horizontal
      snapToInterval={width * 0.8 + 8}
      snapToAlignment="center"
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  codes: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    padding: 8,
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
  directionText: {
    flexBasis: 0,
    flexGrow: 1,
    fontWeight: "bold",
    opacity: 0.4,
    color: "black",
  },
  lineButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  routeContainer: {
    gap: 8,
  },
});
