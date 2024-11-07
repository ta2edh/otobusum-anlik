import { Dimensions, StyleSheet } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { UiSegmentedButtons } from "./ui/UiSegmentedButtons";
import { i18n } from "@/translations/i18n";
import { useFilters } from "@/stores/filters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function TheFilters({
  animatedPosition,
  animatedIndex,
}: {
  animatedPosition: SharedValue<number>;
  animatedIndex: SharedValue<number>;
}) {
  const direction = useFilters((state) => state.direction);
  const setDirection = useFilters((state) => state.setDirection);
  const safeArea = useSafeAreaInsets();
  const dimensions = Dimensions.get("screen");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      bottom:
        dimensions.height -
        animatedPosition.value -
        safeArea.bottom -
        safeArea.top -
        (__DEV__ ? 0 : 35),
      opacity: 1 - animatedIndex.value
    };
  });

  return (
    <Animated.View style={[animatedStyle, styles.filters]}>
      <UiSegmentedButtons
        value={direction}
        onValueChange={setDirection}
        buttons={[
          {
            value: "D",
            label: i18n.t("departure"),
          },
          {
            value: "G",
            label: i18n.t("return"),
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  filters: {
    position: "absolute",
    left: 14,
    // bottom: 14,
    zIndex: 50,
  },
});
