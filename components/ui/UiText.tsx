import { useTheme } from "@/hooks/useTheme";
import { Theme } from "@material/material-color-utilities";
import { TextProps, Text, StyleProp, TextStyle } from "react-native";

interface Props extends TextProps {
  info?: boolean;
  uiTheme?: Theme;
}

export function UiText({ style, info, uiTheme, ...rest }: Props) {
  const { colorsTheme } = useTheme();

  const baseStyle: StyleProp<TextStyle> = {
    color: colorsTheme.color,
    flexShrink: 1,
  };

  if (info) {
    baseStyle['color'] = colorsTheme.surfaceContainerHighest
    baseStyle['fontWeight'] = "bold"
  }

  return <Text style={[baseStyle, style]} {...rest} />;
}
