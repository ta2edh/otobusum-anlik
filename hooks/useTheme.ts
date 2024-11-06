import { colors } from "@/constants/colors";
import { useColorScheme } from "react-native";

export function useTheme() {
  const scheme = useColorScheme() ?? 'light'

  return colors[scheme]
}
