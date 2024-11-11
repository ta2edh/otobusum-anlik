import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import { memo, useCallback, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { UiButton } from "./ui/UiButton";
import { UiText } from "./ui/UiText";

import { BottomSheetFlashList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouteFilter } from "@/hooks/useRouteFilter";
import { useFilters } from "@/stores/filters";
import { LineRoute } from "@/api/getAllRoutes";
import { useTheme } from "@/hooks/useTheme";
import { colors } from "@/constants/colors";

interface Props extends TouchableOpacityProps {
  code: string;
}

interface ItemProps extends Props {
  item: LineRoute;
}

function SelectedLineRoutesItem(props: ItemProps) {
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
    <TouchableOpacity
      style={[styles.item, props.style, isSelected ? selectedStyle : undefined]}
      onPress={handlePress}
    >
      <UiText>{`${props.item.route_code} ${props.item.route_long_name}`}</UiText>
    </TouchableOpacity>
  );
}

export const SelectedLineRoutes = memo(function SelectedLineRoutes(props: Props) {
  const { bottomSheetStyle } = useTheme();
  const { routes, findRouteFromCode } = useRouteFilter(props.code);

  const bottomSheetModal = useRef<BottomSheetModal>(null);
  const selectedRouteCode = useFilters(useShallow((state) => state.selectedRoutes[props.code]));

  const route = selectedRouteCode ? findRouteFromCode(selectedRouteCode) : undefined;

  const routesfiltered: LineRoute[] = [];
  const routesDefaults: LineRoute[] = [];

  for (let index = 0; index < (routes.data?.result.records.length || 0); index++) {
    const element = routes.data?.result.records[index];
    if (!element) continue;

    if (element.route_code.endsWith("D0")) {
      routesDefaults.push(element);
    } else {
      routesfiltered.push(element);
    }
  }

  const renderItem = useCallback(
    ({ item }: { item: LineRoute }) => {
      return <SelectedLineRoutesItem code={props.code} item={item} />;
    },
    [props.code]
  );

  const defaultRoutes = () => {
    return (
      <View>
        {routesDefaults.map((item) => SelectedLineRoutesItem({ code: props.code, item }))}
      </View>
    );
  };

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
        <UiText info style={styles.title}>
          Routes
        </UiText>

        <BottomSheetFlashList
          data={routesfiltered}
          renderItem={renderItem}
          estimatedItemSize={35}
          ListHeaderComponent={defaultRoutes}
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
  title: {
    fontSize: 24,
    padding: 8,
  },
});
