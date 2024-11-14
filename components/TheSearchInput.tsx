import { useCallback, useRef, useState } from 'react'
import { UiTextInput } from './ui/UiTextInput'
import { UiButton } from './ui/UiButton'
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputChangeEventData,
  ViewProps,
} from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { i18n } from '@/translations/i18n'
import { colors } from '@/constants/colors'

interface Props extends ViewProps {
  isLoading?: boolean
  onSearch: (query: string) => void
}

export function TheSearchInput({ isLoading, onSearch, style, ...rest }: Props) {
  const queryValue = useRef('')
  const [queryDisabled, setQueryDisabled] = useState(() => true)

  const handleQueryChange = useCallback(
    (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      queryValue.current = event.nativeEvent.text

      if (queryValue.current && queryDisabled === true) {
        setQueryDisabled(false)
      }
      else if (!queryValue.current && queryDisabled === false) {
        setQueryDisabled(true)
      }
    },
    [queryDisabled],
  )

  const handleSearch = useCallback(() => {
    onSearch(queryValue.current)
  }, [onSearch])

  return (
    <Animated.View layout={LinearTransition} style={[styles.container, style]} {...rest}>
      <UiTextInput
        placeholder="KM-12, KM-12..."
        onChange={handleQueryChange}
        style={styles.input}
        onSubmitEditing={handleSearch}
        multiline={false}
        returnKeyType="search"
      />
      <UiButton
        title={i18n.t('search')}
        isLoading={isLoading}
        disabled={queryDisabled}
        onPress={handleSearch}
        style={{ backgroundColor: colors.primary }}
        icon="search"
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 4,
    paddingHorizontal: 8,
  },
  input: {
    flexGrow: 1,
  },
})
