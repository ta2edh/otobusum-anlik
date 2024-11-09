import { BackHandler, StyleSheet } from "react-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import Animated, { LinearTransition, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";
import { useMutation } from "@tanstack/react-query";
import { getSearchResults, SearchResult } from "@/api/getSearchResults";
import BottomSheet, { BottomSheetFlashList, BottomSheetView } from "@gorhom/bottom-sheet";

import { TheSearchItem } from "./TheSearchItem";
import { TheSearchInput } from "./TheSearchInput";
import { TheFilters } from "./TheFilters";

export function TheSearchSheet() {
  const animatedPosition = useSharedValue(0);
  const animatedIndex = useSharedValue(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetIndex = useRef(0);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

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
  }, []);

  const snapPoints = useMemo(() => [60 + 24 + 8, "90%"], []);
  const data = useMemo(
    () => mutation.data?.list.filter((i) => i.Stationcode === 0),
    [mutation.data]
  );

  const collapseSheet = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);

  const renderItem = ({ item }: { item: SearchResult }) => {
    return <TheSearchItem item={item} onPress={collapseSheet} />;
  };

  return (
    <>
      <TheFilters animatedPosition={animatedPosition} animatedIndex={animatedIndex} />
      
      <BottomSheet
        ref={bottomSheetRef}
        handleStyle={{ backgroundColor: theme.surfaceContainerLow }}
        handleIndicatorStyle={{ backgroundColor: theme.surfaceContainerHighest }}
        backgroundStyle={{ backgroundColor: theme.surfaceContainerLow }}
        topInset={insets.top + 20}
        enableDynamicSizing={false}
        android_keyboardInputMode="adjustResize"
        keyboardBehavior="fillParent"
        snapPoints={snapPoints}
        onChange={(index) => (bottomSheetIndex.current = index)}
        animatedPosition={animatedPosition}
        animatedIndex={animatedIndex}
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
});
