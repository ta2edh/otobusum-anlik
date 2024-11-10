import { StyleSheet, View, StyleProp, ViewStyle, TouchableOpacityProps, TouchableOpacity } from "react-native";

import { UiText } from "./UiText";
import { useTheme } from "@/hooks/useTheme";
import { colors } from "@/constants/colors";

interface Button<T> {
  label: string;
  value: T;
}

interface Props<T> extends TouchableOpacityProps {
  buttons: Button<T>[];
  value?: T,
  onValueChange?: (value: T) => void
}

export function UiSegmentedButtons<T>({ buttons, value, style, onValueChange }: Props<T>) {
  const { theme } = useTheme();

  const baseStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.surfaceContainerHigh,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexGrow: 1,
    flexBasis: 100,
  };

  const leftEdge: StyleProp<ViewStyle> = {
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
  };

  const rightEdge: StyleProp<ViewStyle> = {
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  };

  const selectedStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.primary
  }

  return (
    <View style={[styles.container, style]}>
      {buttons.map((button, index) => {
        const edgeStyle =
          index === 0 ? leftEdge : index === buttons.length - 1 ? rightEdge : undefined;
        const selected = button.value === value

        return (
          <TouchableOpacity
            key={button.label}
            style={[edgeStyle, baseStyle, selected ? selectedStyle : undefined]}
            onPress={() => onValueChange?.(button.value)}
          >
            <UiText style={styles.label}>{button.label}</UiText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  label: {
    textAlign: "center",
  }
});
