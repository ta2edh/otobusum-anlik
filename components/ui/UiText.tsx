import { useTheme } from "@/hooks/useTheme";
import { Theme } from "@material/material-color-utilities";
import { TextProps, Text, StyleProp, TextStyle } from "react-native";

interface Props extends TextProps {
  info?: boolean;
  uiTheme?: Theme;
}

export function UiText({ style, info, uiTheme, ...rest }: Props) {
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
