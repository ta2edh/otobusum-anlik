import { TheSearchItem } from '@/components/TheSearchItem'
import { TheSearchInput } from '@/components/TheSearchInput'
import { getSearchResults } from '@/api/getSearchResults'
import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'
import { UiText } from '@/components/ui/UiText'

import { i18n } from '@/translations/i18n'
import { FlashList } from '@shopify/flash-list'
import { useMutation } from '@tanstack/react-query'
import { BusLine, BusStop } from '@/types/bus'

import { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { usePaddings } from '@/hooks/usePaddings'

export default function Search() {
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

  const emptyItem = useCallback(() => {
    if (mutation.data) {
      return (
        <UiText info style={styles.empty}>
          {i18n.t('emptySearch')}
        </UiText>
      )
    }

    if (mutation.isPending) {
      return <UiActivityIndicator size="large" />
    }

    return (
      <UiText info style={styles.empty}>
        {i18n.t('searchSomething')}
      </UiText>
    )
  }, [mutation.data, mutation.isPending])

  return (
    <View style={styles.container}>
      <TheSearchInput
        onSearch={onSearch}
        isLoading={mutation.isPending}
        style={paddings}
        debounce
      />

      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={renderItem}
          estimatedItemSize={45}
          fadingEdgeLength={20}
          contentContainerStyle={styles.contentStyle}
          keyboardDismissMode="on-drag"
          ListEmptyComponent={emptyItem}
        />
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
  contentStyle: {
    padding: 14,
  },
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
})
