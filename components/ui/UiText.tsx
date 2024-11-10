import { useTheme } from "@/hooks/useTheme";
import { TextProps, Text, StyleProp, TextStyle } from "react-native";

interface Props extends TextProps {
  info?: boolean;
}

export function UiText({ style, info, ...rest }: Props) {
  const { theme } = useTheme();

  const baseStyle: StyleProp<TextStyle> = {
    color: theme.color,
    flexShrink: 1,
  };

  if (info) {
    baseStyle['color'] = theme.surfaceContainerHighest
    baseStyle['fontWeight'] = "bold"
  }

  return <Text style={[baseStyle, style]} {...rest} />;
}
