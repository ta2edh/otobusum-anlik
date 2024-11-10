import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { BottomSheetFlashList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { getAllRoutes, RouteTrack } from "@/api/getAllRoutes";
import { useTheme } from "@/hooks/useTheme";
import { useQuery } from "@tanstack/react-query";
import { memo, useCallback, useRef } from "react";
import { UiButton } from "./ui/UiButton";
import { useFilters } from "@/stores/filters";
import { useShallow } from "zustand/react/shallow";
import { colors } from "@/constants/colors";

interface Props {
  code: string;
}

interface Item extends Props {
  item: RouteTrack;
}

const SelectedLineRoutesItem = function SelectedLineRoutesItem(props: Item) {
  const setRoute = useFilters(useShallow((state) => state.setRoute));
  const selectedRoute = useFilters(useShallow((state) => state.selectedRoutes[props.code]));
  const isSelected = selectedRoute === props.item.route_code;

  const selectedStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.primary,
  };

  const handlePress = () => {
    setRoute(props.code, props.item.route_code);
  };

  return (
    <UiButton
      onPress={handlePress}
      title={props.item.route_long_name}
      containerStyle={[styles.item, isSelected ? selectedStyle : undefined]}
    />
  );
};

export const SelectedLineRoutes = memo(function SelectedLineRoutes(props: Props) {
  const bottomSheetModal = useRef<BottomSheetModal>(null);
  const { bottomSheetStyle } = useTheme();

  const lineRoutes = useQuery({
    queryKey: [`${props.code}-line-routes`],
    queryFn: () => getAllRoutes(props.code),
  });

  const renderItem = useCallback(({ item }: { item: RouteTrack }) => {
    return <SelectedLineRoutesItem code={props.code} item={item} />;
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
});

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
