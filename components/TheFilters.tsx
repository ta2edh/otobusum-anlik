import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { SelectedRoutes } from "./SelectedRoutes";

export function TheFilters({
  animatedPosition,
  animatedIndex,
}: {
  animatedPosition: SharedValue<number>;
  animatedIndex: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: animatedPosition.value - 84 - (8 * 2) - 14 // 8 padding, 93 content itself, 8 extra padding
        }
      ],
      opacity: 1 - animatedIndex.value
    };
  });

  return (
    <Animated.View style={[animatedStyle, styles.filters]}>
      <SelectedRoutes />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  filters: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 50,
  },
});
