import { BackHandler, StyleSheet } from 'react-native'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@/hooks/useTheme'
import { useMutation } from '@tanstack/react-query'
import { getSearchResults, SearchResult } from '@/api/getSearchResults'
import BottomSheet, { BottomSheetFlashList, BottomSheetProps } from '@gorhom/bottom-sheet'

import { TheSearchItem } from './TheSearchItem'
import { TheSearchInput } from './TheSearchInput'
import { UiText } from './ui/UiText'
import { UiActivityIndicator } from './ui/UiActivityIndicator'
import { i18n } from '@/translations/i18n'

export function TheSearchSheet(props: BottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const bottomSheetIndex = useRef(0)
  const insets = useSafeAreaInsets()
  const { bottomSheetStyle } = useTheme()

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (bottomSheetIndex.current !== 0) {
        bottomSheetRef.current?.collapse()
        return true
      }

      return false
    })

    return () => {
      backHandler.remove()
    }
  }, [])

  const mutation = useMutation({
    mutationFn: getSearchResults,
  })

  const onSearch = useCallback(
    (q: string) => {
      mutation.mutate(q)
    },
    [mutation],
  )

  const snapPoints = useMemo(() => [56 + 24 + 8, '90%'], [])
  const data = useMemo(
    () => mutation.data?.list.filter(i => i.Stationcode === 0),
    [mutation.data],
  )

  const emptyItem = useCallback(() => {
    if (mutation.data) {
      return <UiText style={styles.empty}>{i18n.t('emptySearch')}</UiText>
    }

    if (mutation.isPending) {
      return <UiActivityIndicator size={34} />
    }

    return <UiText style={styles.empty}>{i18n.t('searchSomething')}</UiText>
  }, [mutation.data, mutation.isPending])

  const renderItem = ({ item }: { item: SearchResult }) => {
    return <TheSearchItem item={item} />
  }

  return (
    <>
      {props.children}

      <BottomSheet
        ref={bottomSheetRef}
        topInset={insets.top + 20}
        enableDynamicSizing={false}
        android_keyboardInputMode="adjustResize"
        keyboardBehavior="fillParent"
        snapPoints={snapPoints}
        onChange={index => (bottomSheetIndex.current = index)}
        {...bottomSheetStyle}
        {...props}
      >
        <TheSearchInput
          onSearch={onSearch}
          isLoading={mutation.isPending}
          style={{ marginBottom: 8 }}
        />

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
  )
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})
