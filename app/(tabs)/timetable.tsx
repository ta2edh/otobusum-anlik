import { RouteTimetable } from "@/components/RouteTimetable";
import { SelectedRoutes } from "@/components/SelectedRoutes";
import { TheFocusAwareStatusBar } from "@/components/TheFocusAwareStatusbar";
import { UiText } from "@/components/ui/UiText";
import { colors } from "@/constants/colors";
import { useTheme } from "@/hooks/useTheme";
import { useRoutes } from "@/stores/routes";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TimetableScreen() {
  const theme = useTheme()
  const insets = useSafeAreaInsets();
  const offsetY = useSharedValue(0);

  const routes = useRoutes((state) => state.routes);
  const keys = Object.keys(routes);

  const animatedScrollHandler = useAnimatedScrollHandler(({ contentOffset }) => {
    offsetY.value = contentOffset.y;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    paddingTop: interpolate(offsetY.value, [0, 50], [8, insets.top + 8], "clamp"),
    borderRadius: interpolate(offsetY.value, [0, 50], [8, 0], "clamp"),
    right: interpolate(offsetY.value, [0, 50], [8, 0], "clamp"),
    left: interpolate(offsetY.value, [0, 50], [8, 0], "clamp"),
    marginTop: interpolate(offsetY.value, [0, 50], [insets.top + 8, 0], "clamp"),
    position: "absolute",
    zIndex: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    elevation: 5,
    backgroundColor: interpolateColor(offsetY.value, [0, 50], [theme.surfaceContainer, theme.surfaceContainerLow]),
  }));

  if (keys.length < 1) {
    return (
      <View style={{ flex: 1 }}>
        <TheFocusAwareStatusBar />

        <UiText info style={{ textAlign: "center", textAlignVertical: "center", flex: 1 }}>
          Selected Timetables of routes will appear here.
        </UiText>
      </View>
    );
  }

  return (
    <View>
      <SelectedRoutes style={animatedStyle} />

      <Animated.ScrollView
        onScroll={animatedScrollHandler}
        contentContainerStyle={[styles.content]}
      >
        <View style={{ flex: 1, flexDirection: "column", gap: 8 }}>
          {keys.map((cd) => (
            <RouteTimetable key={cd} code={cd} />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
    padding: 8,
    paddingTop: 140,
  },
});
