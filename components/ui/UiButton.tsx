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
import { colors } from "@/constants/colors";

interface Props extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  containerStyle?: StyleProp<ViewStyle>
}

export function UiButton({ style, ...rest }: Props) {
  return (
    <View style={[styles.container, rest.containerStyle]}>
      <TouchableOpacity style={[styles.button, style, { opacity: rest.disabled ? 0.4 : 1 }]} {...rest}>
        {rest.isLoading && <ActivityIndicator color="#FFFFFF" />}
        <UiText style={{color: 'white'}}>{rest.title}</UiText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    overflow: "hidden",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.primary,
  },
});
