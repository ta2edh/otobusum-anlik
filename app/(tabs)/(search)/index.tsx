import { TheMap } from '@/components/TheMap'
import { TheSearchItem } from '@/components/TheSearchItem'
import { TheSearchInput } from '@/components/TheSearchInput'
import { getSearchResults } from '@/api/getSearchResults'
import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'
import { LineBusStopMarkersItem } from '@/components/markers/LineBusStopMarkers'
import { UiText } from '@/components/ui/UiText'

import { useTheme } from '@/hooks/useTheme'
import { i18n } from '@/translations/i18n'
import { FlashList } from '@shopify/flash-list'
import { useMutation } from '@tanstack/react-query'
import { BusLine, BusStop } from '@/types/bus'
import { isStop } from '@/utils/isStop'

import MapView from 'react-native-maps'
import { useCallback, useMemo, useRef, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export default function Search() {
  const { colorsTheme } = useTheme()
  const [renderedStop, setRenderedStop] = useState<BusStop>()
  const map = useRef<MapView>(null)

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

  const dynamicSearchContainer: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainerLow,
  }

  const handleLongPress = useCallback((item: BusLine | BusStop) => {
    if (!isStop(item)) return

    map.current?.animateCamera({
      center: {
        latitude: item.y_coord,
        longitude: item.x_coord,
      },
      zoom: 16,
    })

    setRenderedStop(item)
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: BusLine | BusStop }) => (
      <TheSearchItem item={item} onLongPress={() => handleLongPress(item)} />
    ),
    [handleLongPress],
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
    <View style={[styles.container]}>
      <TheMap
        ref={map}
        liteMode
      >
        {!!renderedStop && <LineBusStopMarkersItem stop={renderedStop} />}
      </TheMap>

      <View style={[styles.searchContainer, dynamicSearchContainer]}>
        <TheSearchInput
          onSearch={onSearch}
          isLoading={mutation.isPending}
          style={styles.searchInput}
          debounce
        />

        <View style={styles.list}>
          <FlashList
            data={data}
            renderItem={renderItem}
            estimatedItemSize={45}
            fadingEdgeLength={20}
            contentContainerStyle={styles.content}
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
  searchInput: {
    padding: 14,
    paddingBottom: 0,
  },
  content: {
    padding: 14,
  },
  searchContainer: {
    borderRadius: 32,
    height: '78%',
    marginTop: -100,
  },
  list: {
    flex: 1,
  },
})
