import { useCallback, useRef, useState } from "react";
import { UiTextInput } from "./ui/UiTextInput";
import { UiButton } from "./ui/UiButton";
import { NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { i18n } from "@/translations/i18n";

interface Props {
  isLoading?: boolean;
  onSearch: (query: string) => void;
}

export function TheSearchInput(props: Props) {
  const queryValue = useRef("");
  const [queryDisabled, setQueryDisabled] = useState(() => true);

  const handleQueryChange = useCallback((event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    queryValue.current = event.nativeEvent.text;

    if (queryValue.current && queryDisabled === true) {
      setQueryDisabled(false);
    } else if (!queryValue.current && queryDisabled === false) {
      setQueryDisabled(true);
    }
  }, []);

  const handleSearch = useCallback(() => {
    props.onSearch(queryValue.current)
  }, [])

  return (
    <Animated.View layout={LinearTransition} style={styles.container}>
      <UiTextInput
        placeholder="KM-12, KM-12..."
        onChange={handleQueryChange}
        style={styles.input}
      />
      <UiButton
        title={i18n.t("search")}
        isLoading={props.isLoading}
        disabled={queryDisabled}
        onPress={handleSearch}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 4
  },
  input: {
    flexGrow: 1,
  }
})
