import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { UiText } from "./ui/UiText";
import { colors } from "@/constants/colors";
import { SearchResult } from "@/api/getSearchResults";
import { useCallback, useState, memo } from "react";
import { useRoutes } from "@/stores/routes";

interface Props extends TouchableOpacityProps {
  item: SearchResult;
  onPress?: () => void;
}

export const TheSearchItem = memo(function SearchItem(props: Props) {
  const [isPending, setIsPending] = useState(false);

  const addRoute = useRoutes((state) => state.addRoute);
  const routeColors = useRoutes((state) => state.routeColors);

  const backgroundColor = routeColors[props.item.Code] || colors.primary
  const isInRoutes = routeColors[props.item.Code] !== undefined

  const handlePress = useCallback(async () => {
    props.onPress?.();
    setIsPending(true)
    
    try {
      await addRoute(props.item.Code)
    } finally {
      setIsPending(false)
    }
  }, []);

  return (
    <TouchableOpacity
      style={[styles.container, { opacity: isInRoutes ? 0.4 : 1 }]}
      disabled={isInRoutes}
      onPress={handlePress}
    >
      <UiText style={[styles.renderCode, { backgroundColor }]}>
        {isPending ? <ActivityIndicator color="#FFFFFF" /> : props.item.Code}
      </UiText>
      <UiText>{props.item.Name}</UiText>
    </TouchableOpacity>
  );
})

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 4,
  },
  renderCode: {
    borderRadius: 999,
    padding: 9,
    minWidth: 70,
    textAlign: "center",
  },
});
