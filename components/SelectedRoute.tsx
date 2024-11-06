import { UiButton } from "./ui/UiButton";
import { useRoutes } from "@/stores/routes";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

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
