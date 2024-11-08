import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import { UiText } from "./UiText";

interface Props extends TouchableOpacityProps {
  title?: string;
  isLoading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  size?: "sm" | "md";
  primary?: string;
}

export function UiButton({ style, ...rest }: Props) {
  const fontSize = rest.size === "sm" ? 10 : 14;

  return (
    <View style={[styles.container, rest.containerStyle]}>
      <TouchableOpacity
        style={[
          styles.button,
          style,
          {
            opacity: rest.disabled ? 0.4 : 1,
          },
        ]}
        {...rest}
      >
        {rest.isLoading && <ActivityIndicator color="#FFFFFF" />}
        {!!rest.title && (
          <UiText style={{ color: "white", fontSize }} numberOfLines={1}>
            {rest.title}
          </UiText>
        )}

        <View>{rest.children}</View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    overflow: "hidden",
    flexShrink: 1,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    flexShrink: 1,
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
