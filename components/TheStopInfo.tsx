import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { RefObject, useEffect, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import MapView from 'react-native-maps'

import { useTheme } from '@/hooks/useTheme'

import { LineBusStopMarkersItem } from './markers/BusStopMarkers'
import { TheMapFr } from './TheMap'
import { UiSheetModal } from './ui/sheet/UiSheetModal'
import { UiActivityIndicator } from './ui/UiActivityIndicator'
import { UiText } from './ui/UiText'

import { getStop } from '@/api/getStop'
import { i18n } from '@/translations/i18n'

interface TheStopInfoProps {
  cRef: RefObject<MapView>
}

export const TheStopInfo = ({ cRef }: TheStopInfoProps) => {
  const { colorsTheme } = useTheme()
  const { stopId } = useLocalSearchParams<{ stopId?: string }>()
  const bottomSheetModal = useRef<BottomSheetModal>(null)

  const query = useQuery({
    queryKey: ['stop', stopId],
    queryFn: () => getStop(stopId!),
    staleTime: 60_000 * 30,
    enabled: !!stopId,
  })

  useEffect(() => {
    bottomSheetModal.current?.present()

    if (query.data) {
      cRef.current?.animateCamera({
        center: {
          latitude: query.data.stop.y_coord,
          longitude: query.data.stop.x_coord,
        },
        zoom: 16,
      })
    }
  }, [query.data, stopId, cRef])

  if (bottomSheetModal.current && stopId) {
    bottomSheetModal.current.present()
  }

  if (!stopId) return null

  const lineCodeStyle: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainer,
  }

  if (query.isPending) {
    return (
      <UiSheetModal
        ref={bottomSheetModal}
        enableDynamicSizing
      >
        <UiActivityIndicator />
      </UiSheetModal>
    )
  }

  return (
    <UiSheetModal
      ref={bottomSheetModal}
      enableDynamicSizing={true}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.mapContainer}>
          {query.data && (
            <TheMapFr
              liteMode
              style={styles.map}
              initialCamera={{
                center: {
                  latitude: query.data?.stop.y_coord,
                  longitude: query.data?.stop.x_coord,
                },
                heading: 0,
                pitch: 0,
                zoom: 16,
              }}
            >
              <LineBusStopMarkersItem type="point" stop={query.data.stop} />
            </TheMapFr>
          )}

        </View>

        {query.data && (
          <View style={styles.content}>
            <View>
              <UiText>{query.data.stop.stop_code}</UiText>
              <UiText size="lg" style={styles.title}>{query.data.stop.stop_name}</UiText>
              <UiText>{query.data.stop.province}</UiText>
            </View>

            <View style={styles.linesContainer}>
              <UiText info>{i18n.t('linesThatUseStop')}</UiText>

              <View style={styles.codeOuter}>
                {query.data?.buses.map(lineCode => (
                  <View key={lineCode} style={[styles.code, lineCodeStyle]}>
                    <UiText>{lineCode}</UiText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

      </BottomSheetView>
    </UiSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 8,
  },
  map: {
    flex: 1,
    borderRadius: 14,
  },
  mapContainer: {
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    padding: 4,
    gap: 8,
  },
  linesContainer: {
    gap: 4,
  },
  codeOuter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  code: {
    padding: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
})
