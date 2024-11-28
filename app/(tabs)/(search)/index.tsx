import { getSearchResults } from '@/api/getSearchResults'
import { TheMap } from '@/components/TheMap'
import { TheSearchInput } from '@/components/TheSearchInput'
import { TheSearchItem } from '@/components/TheSearchItem'
import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'
import { UiText } from '@/components/ui/UiText'

import { useTheme } from '@/hooks/useTheme'
import { i18n } from '@/translations/i18n'
import { FlashList } from '@shopify/flash-list'
import { useMutation } from '@tanstack/react-query'
import { BusLine, BusStop } from '@/types/bus'

import MapView from 'react-native-maps'
import { useCallback, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export default function Search() {
  const { colorsTheme } = useTheme()
  const map = useRef<MapView>(null)

  const mutation = useMutation({
    mutationFn: getSearchResults,
  })

  const onSearch = useCallback(
    (q: string) => {
      map.current?.animateCamera({
        center: {
          latitude: 40.817762,
          longitude: 29.297951,
        },
      })
      mutation.mutate(q)
    },
    [mutation],
  )

  const data = [
    ...mutation.data?.lines || [],
    ...mutation.data?.stops || [],
  ]

  const dynamicSearchContainer: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainerLow,
  }

  const renderItem = useCallback(
    ({ item }: { item: BusLine | BusStop }) => <TheSearchItem item={item} />,
    [],
  )

  const emptyItem = useCallback(() => {
    if (mutation.data) {
      return <UiText info style={styles.empty}>{i18n.t('emptySearch')}</UiText>
    }

    if (mutation.isPending) {
      return <UiActivityIndicator size="large" />
    }

    return <UiText info style={styles.empty}>{i18n.t('searchSomething')}</UiText>
  }, [mutation.data, mutation.isPending])

  return (
    <View style={[styles.container]}>
      <TheMap
        ref={map}
        scrollEnabled={false}
      />

      <View style={[styles.searchContainer, dynamicSearchContainer]}>
        <TheSearchInput
          onSearch={onSearch}
          isLoading={mutation.isPending}
          style={{ marginBottom: 8 }}
          debounce
        />

        <View style={styles.list}>
          <FlashList
            data={data}
            renderItem={renderItem}
            estimatedItemSize={45}
            fadingEdgeLength={20}
            contentContainerStyle={{ paddingVertical: 8 }}
            keyboardDismissMode="on-drag"
            ListEmptyComponent={emptyItem}
          />
        </View>
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
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 14,
    backgroundColor: 'red',
    borderRadius: 32,
    height: '78%',
    marginTop: -100,

    // marginTop: -200,
    // marginBottom: 50,
  },
  list: {
    flex: 1,
  },
})
