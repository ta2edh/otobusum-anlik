import { colors } from "@/constants/colors";
import { useColorScheme } from "react-native";

export function useTheme() {
  const scheme = useColorScheme() ?? 'light'
  const theme = colors[scheme]

  const bottomSheetStyle = {
    handleStyle: { backgroundColor: theme.surfaceContainerLow },
    handleIndicatorStyle: { backgroundColor: theme.surfaceContainerHighest },
    backgroundStyle: { backgroundColor: theme.surfaceContainerLow },
  }

  return {
    theme,
    bottomSheetStyle
  }
}
