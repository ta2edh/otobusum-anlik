import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { UiText } from "./ui/UiText";
import { colors } from "@/constants/colors";
import { SearchResult } from "@/api/getSearchResults";
import { useState, memo } from "react";
import { useLines } from "@/stores/lines";
import { useShallow } from "zustand/react/shallow";

interface Props extends TouchableOpacityProps {
  item: SearchResult;
  onPress?: () => void;
}

export const TheSearchItem = memo(function SearchItem(props: Props) {
  const [isPending, setIsPending] = useState(false);

  const lineColor = useLines(useShallow(state => state.lineColors[props.item.Code]))
  const addLine = useLines((state) => state.addLine);

  const backgroundColor = lineColor || colors.primary;
  const isInLines = lineColor !== undefined;

  const handlePress = async () => {
    props.onPress?.();
    setIsPending(true);

    try {
      await addLine(props.item.Code);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { opacity: isInLines ? 0.4 : 1 }]}
      disabled={isInLines}
      onPress={handlePress}
    >
      <UiText style={[styles.renderCode, { backgroundColor }]}>
        {isPending ? <ActivityIndicator color="#FFFFFF" /> : props.item.Code}
      </UiText>
      <UiText>{props.item.Name}</UiText>
    </TouchableOpacity>
  );
});

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
