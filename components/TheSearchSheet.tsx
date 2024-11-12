import { BackHandler, StyleSheet } from "react-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";
import { useMutation } from "@tanstack/react-query";
import { getSearchResults, SearchResult } from "@/api/getSearchResults";
import BottomSheet, { BottomSheetFlashList, BottomSheetView } from "@gorhom/bottom-sheet";

import { TheSearchItem } from "./TheSearchItem";
import { TheSearchInput } from "./TheSearchInput";
import { TheFilters } from "./TheFilters";
import { UiText } from "./ui/UiText";
import { UiActivityIndicator } from "./ui/UiActivityIndicator";
import { i18n } from "@/translations/i18n";

export function TheSearchSheet() {
  const animatedPosition = useSharedValue(0);
  const animatedIndex = useSharedValue(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetIndex = useRef(0);
  const insets = useSafeAreaInsets();
  const { bottomSheetStyle } = useTheme();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (bottomSheetIndex.current !== 0) {
        bottomSheetRef.current?.snapToIndex(0);
        return true;
      }

      return false;
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  const mutation = useMutation({
    mutationFn: getSearchResults,
  });

  const onSearch = useCallback((q: string) => {
    mutation.mutate(q);
  }, [mutation]);

  const snapPoints = useMemo(() => [68 + 24 + 8, "90%"], []);
  const data = useMemo(
    () => mutation.data?.list.filter((i) => i.Stationcode === 0),
    [mutation.data]
  );

  const collapseSheet = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);

  const emptyItem = useCallback(() => {
    if (mutation.data) {
      return <UiText style={styles.empty}>{i18n.t("emptySearch")}</UiText>
    }

    if (mutation.isPending) {
      return <UiActivityIndicator size={34} />
    }
    
    return <UiText style={styles.empty}>{i18n.t("searchSomething")}</UiText>
  }, [mutation.data, mutation.isPending])

  const renderItem = ({ item }: { item: SearchResult }) => {
    return <TheSearchItem item={item} onPress={collapseSheet} />;
  };

  return (
    <>
      <TheFilters animatedPosition={animatedPosition} animatedIndex={animatedIndex} />
      
      <BottomSheet
        ref={bottomSheetRef}
        topInset={insets.top + 20}
        enableDynamicSizing={false}
        android_keyboardInputMode="adjustResize"
        keyboardBehavior="fillParent"
        snapPoints={snapPoints}
        onChange={(index) => (bottomSheetIndex.current = index)}
        animatedPosition={animatedPosition}
        animatedIndex={animatedIndex}
        {...bottomSheetStyle}
      >
        <BottomSheetView style={styles.container}>
          <TheSearchInput onSearch={onSearch} isLoading={mutation.isPending} />
        </BottomSheetView>

        <BottomSheetFlashList
          data={data}
          renderItem={renderItem}
          estimatedItemSize={45}
          fadingEdgeLength={20}
          contentContainerStyle={{ padding: 8 }}
          keyboardDismissMode="on-drag"
          ListEmptyComponent={emptyItem}
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 18,
    padding: 8,
  },
  query: {
    gap: 8,
    padding: 8,
  },
  empty: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  }
});
