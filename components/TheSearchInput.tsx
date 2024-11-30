import { useCallback, useRef, useState } from 'react'
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputChangeEventData,
  View,
  ViewProps,
} from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import { UiButton } from './ui/UiButton'
import { UiTextInput } from './ui/UiTextInput'

import { colors } from '@/constants/colors'
import { i18n } from '@/translations/i18n'

interface Props extends ViewProps {
  isLoading?: boolean
  debounce?: boolean
  onSearch: (query: string) => void
}

export function TheSearchInput({ isLoading, debounce, onSearch, style, ...rest }: Props) {
  const queryValue = useRef('')
  const [queryDisabled, setQueryDisabled] = useState(() => true)

  const handleSearch = useCallback(() => {
    onSearch(queryValue.current)
  }, [onSearch])

  const handleDebouncedSearch = useDebouncedCallback(() => {
    if (!queryValue.current) return
    onSearch(queryValue.current)
  }, 800)

  const handleQueryChange = useCallback(
    (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      queryValue.current = event.nativeEvent.text

      if (queryValue.current && queryDisabled === true) {
        setQueryDisabled(false)
      } else if (!queryValue.current && queryDisabled === false) {
        setQueryDisabled(true)
      }

      if (debounce) {
        handleDebouncedSearch()
      }
    },
    [queryDisabled, debounce, handleDebouncedSearch],
  )

  return (
    <View style={[styles.container, style]} {...rest}>
      <UiTextInput
        placeholder="KM-12, KM-12..."
        onChange={handleQueryChange}
        style={styles.input}
        onSubmitEditing={debounce ? handleDebouncedSearch : handleSearch}
        multiline={false}
        returnKeyType="search"
      />
      <UiButton
        title={i18n.t('search')}
        isLoading={isLoading}
        disabled={queryDisabled}
        onPress={debounce ? handleDebouncedSearch : handleSearch}
        style={{ backgroundColor: colors.primary }}
        textStyle={{ color: 'white' }}
        icon="search"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 4,
  },
  input: {
    flexGrow: 1,
  },
})
