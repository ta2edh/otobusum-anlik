import { FlashList } from '@shopify/flash-list'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { TheSearchInput } from '@/components/TheSearchInput'
import { TheSearchItem } from '@/components/TheSearchItem'
import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'
import { UiErrorContainer } from '@/components/ui/UiErrorContainer'
import { UiText } from '@/components/ui/UiText'

import { usePaddings } from '@/hooks/usePaddings'

import { getSearchResults } from '@/api/getSearchResults'
import { i18n } from '@/translations/i18n'
import { BusLine, BusStop } from '@/types/bus'

export const SearchScreen = () => {
  const paddings = usePaddings()

  const mutation = useMutation({
    mutationFn: getSearchResults,
  })

  const onSearch = useCallback(
    (q: string) => mutation.mutate(q),
    [mutation],
  )

  const data = useMemo(
    () => ([
      ...(mutation.data?.lines || []),
      ...(mutation.data?.stops || []),
    ]),
    [mutation.data?.lines, mutation.data?.stops],
  )

  const renderItem = useCallback(
    ({ item }: { item: BusLine | BusStop }) => (
      <TheSearchItem item={item} />
    ),
    [],
  )

  const emptyItem = useCallback(() => (
    <View style={styles.emptyContainer}>
      {
        mutation.error
          ? <UiErrorContainer message={mutation.error?.message || ''} />
          : mutation.data
            ? (
                <UiText info style={styles.empty}>
                  {i18n.t('emptySearch')}
                </UiText>
              )
            : mutation.isPending
              ? <UiActivityIndicator size="large" />
              : (
                  <UiText info style={styles.empty}>
                    {i18n.t('searchSomething')}
                  </UiText>
                )

      }
    </View>
  ), [mutation.data, mutation.isPending, mutation.error])

  return (
    <View style={styles.container}>
      <TheSearchInput
        onSearch={onSearch}
        isLoading={mutation.isPending}
        style={paddings}
        debounce
      />

      <View style={styles.list}>
        {!mutation.data
          ? emptyItem()
          : (
              <FlashList
                data={data}
                renderItem={renderItem}
                estimatedItemSize={45}
                fadingEdgeLength={20}
                contentContainerStyle={styles.contentStyle}
                keyboardDismissMode="on-drag"
              />
            )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentStyle: {
    padding: 14,
    paddingTop: 4,
  },
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
})

export default SearchScreen
