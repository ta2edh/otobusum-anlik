import { colors } from "@/constants/colors";
import { useTheme } from "@/hooks/useTheme";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { BottomSheetTextInputProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput";
import { ForwardedRef, forwardRef } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export const UiTextInput = forwardRef(function UiTextInput(
  { style, ...props }: BottomSheetTextInputProps,
  ref: ForwardedRef<TextInput>
) {
  const { colorsTheme } = useTheme();

  const dynamicStyle = { color: colorsTheme.color, backgroundColor: colorsTheme.surfaceContainerHigh }

  return (
    <BottomSheetTextInput
      ref={ref}
      style={[styles.input, dynamicStyle, style]}
      placeholderTextColor={colors.light.surfaceContainerHighest}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
