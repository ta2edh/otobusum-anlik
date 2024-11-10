import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { getAnnouncements } from "@/api/getAnnouncements";

import { UiButton } from "./ui/UiButton";
import { UiText } from "./ui/UiText";

import { useRef } from "react";
import { StyleSheet } from "react-native";

interface Props {
  code: string;
}

export function SelectedLineAnnouncements(props: Props) {
  const bottomSheetModal = useRef<BottomSheetModal>(null);
  const { bottomSheetStyle } = useTheme()

  const announcements = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
    staleTime: 60_000 * 30,
  });

  const lineAnnouncement = announcements.data?.find((ann) => ann.HATKODU === props.code);

  return (
    <>
      <UiButton
        onPress={() => bottomSheetModal.current?.present()}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        disabled={!lineAnnouncement}
      >
        <Ionicons name="megaphone-outline" size={16} color="white" />
      </UiButton>

      {!!lineAnnouncement && (
        <BottomSheetModal
          ref={bottomSheetModal}
          snapPoints={["50%"]}
          enableDynamicSizing={false}
          {...bottomSheetStyle}
        >
          <BottomSheetView style={styles.announcementsContainer}>
            <UiText>{lineAnnouncement.GUNCELLEME_SAATI}</UiText>
            <UiText>{lineAnnouncement.MESAJ}</UiText>
          </BottomSheetView>
        </BottomSheetModal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  announcementsContainer: {
    padding: 8,
    flex: 1,
  },
})
