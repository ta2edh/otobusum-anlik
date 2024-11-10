import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { UiText } from "./ui/UiText";

import { BottomSheetFlashList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { getAllRoutes, RouteTrack } from "@/api/getAllRoutes";
import { useTheme } from "@/hooks/useTheme";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { UiButton } from "./ui/UiButton";
import { useFilters } from "@/stores/filters";
import { useShallow } from "zustand/react/shallow";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

interface Props {
  code: string;
}

export function SelectedLineRoutes(props: Props) {
  const bottomSheetModal = useRef<BottomSheetModal>(null);
  const selectedDirection = useFilters(useShallow((state) => state.selectedDirections[props.code]));
  const { bottomSheetStyle } = useTheme();

  const lineRoutes = useQuery({
    queryKey: [`${props.code}-line-routes`],
    queryFn: () => getAllRoutes(props.code),
  });

  const selectedStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.primary,
  };

  const renderItem = useCallback(({ item }: { item: RouteTrack }) => {
    const isSelected = selectedDirection === item.route_code;

    return (
      <View style={[styles.item, isSelected ? selectedStyle : undefined]}>
        <UiButton title={item.route_long_name}>
          {isSelected && <Ionicons name="checkmark-outline" size={20} color="white" />}
        </UiButton>
      </View>
    );
  }, []);

  return (
    <>
      <UiButton
        title="Obaley"
        style={styles.button}
        onPress={() => bottomSheetModal.current?.present()}
      />

      <BottomSheetModal
        ref={bottomSheetModal}
        snapPoints={["50%"]}
        enableDynamicSizing={false}
        {...bottomSheetStyle}
      >
        <BottomSheetFlashList
          data={lineRoutes.data?.result.records || []}
          renderItem={renderItem}
          estimatedItemSize={35}
        />
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
});
