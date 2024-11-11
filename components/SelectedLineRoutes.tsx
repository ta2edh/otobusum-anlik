import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import { BottomSheetFlashList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { LineRoute } from "@/api/getAllRoutes";
import { useTheme } from "@/hooks/useTheme";
import { memo, useCallback, useRef } from "react";
import { UiButton } from "./ui/UiButton";
import { useFilters } from "@/stores/filters";
import { useShallow } from "zustand/react/shallow";
import { colors } from "@/constants/colors";
import { useRouteFilter } from "@/hooks/useRouteFilter";
import { UiText } from "./ui/UiText";

interface Props {
  code: string;
}

interface Item extends Props {
  item: LineRoute;
}

const SelectedLineRoutesItem = function SelectedLineRoutesItem(props: Item) {
  const setRoute = useFilters(useShallow((state) => state.setRoute));
  const selectedRouteCode = useFilters(useShallow((state) => state.selectedRoutes[props.code]));

  const isSelected = selectedRouteCode === props.item.route_code;

  const selectedStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.primary,
  };

  const handlePress = () => {
    setRoute(props.code, props.item.route_code);
  };

  return (
    <TouchableOpacity style={[styles.item, isSelected ? selectedStyle : undefined]} onPress={handlePress}>
      <UiText>{`${props.item.route_code} ${props.item.route_long_name}`}</UiText>
    </TouchableOpacity>
  );
};

export const SelectedLineRoutes = memo(function SelectedLineRoutes(props: Props) {
  const { bottomSheetStyle } = useTheme();
  const { routes, findRouteFromCode } = useRouteFilter(props.code);

  const bottomSheetModal = useRef<BottomSheetModal>(null);
  const selectedRouteCode = useFilters(useShallow((state) => state.selectedRoutes[props.code]));

  const route = selectedRouteCode ? findRouteFromCode(selectedRouteCode) : undefined

  const filteredRoutes =
    routes.data?.result.records.filter((route) => !route.route_code.endsWith("0")) || [];

  const renderItem = useCallback(({ item }: { item: LineRoute }) => {
    return <SelectedLineRoutesItem code={props.code} item={item} />;
  }, []);

  return (
    <>
      <UiButton
        title={route?.route_long_name}
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
          data={filteredRoutes}
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
