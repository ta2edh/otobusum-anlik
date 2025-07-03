import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { useQuery } from '@tanstack/react-query'
import { RefObject, useEffect, useRef } from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { LineGroups } from './lines/line/LineGroups'
import { TheMap, type TheMapRef } from './map/Map'
import { MarkersStopItem } from './markers/stop/MarkersStopItem'
import { UiSheetModal } from './ui/sheet/UiSheetModal'
import { UiActivityIndicator } from './ui/UiActivityIndicator'
import { UiButton } from './ui/UiButton'
import { UiText } from './ui/UiText'

import { getStop } from '@/api/getStop'
import { addLine } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { useSettingsStore } from '@/stores/settings'
import { i18n } from '@/translations/i18n'
import { openDirectionsFromCurrentLocation } from '@/utils/navigation'

interface TheStopInfoProps {
  ref: RefObject<TheMapRef | null>
}

const StopLine = ({ lineCode }: { lineCode: string }) => {
  const bottomSheetModal = useRef<BottomSheetModal>(null)

  const handlePress = (lineCode: string) => {
    addLine(lineCode)
  }

  const handleLongPress = () => {
    bottomSheetModal.current?.present()
  }

  return (
    <LineGroups cRef={bottomSheetModal} lineCodeToAdd={lineCode}>
      <UiButton
        key={lineCode}
        title={lineCode}
        variant="soft"
        onPress={() => handlePress(lineCode)}
        onLongPress={() => handleLongPress()}
      />
    </LineGroups>
  )
}

export const TheStopInfo = ({ ref }: TheStopInfoProps) => {
  const selectedStopId = useMiscStore(useShallow(state => state.selectedStopId))

  const bottomSheetModal = useRef<BottomSheetModalMethods>(null)
  const savedRegion = useRef<any | undefined>(undefined)

  const query = useQuery({
    queryKey: ['stop', selectedStopId],
    queryFn: () => getStop(selectedStopId!),
    staleTime: 60_000 * 30,
    enabled: !!selectedStopId,
  })

  useEffect(() => {
    const unsub = useMiscStore.subscribe(
      state => state.selectedStopId,
      (selectedId) => {
        if (!selectedId) return

        savedRegion.current = useSettingsStore.getState().initialMapLocation
      }, {
        equalityFn: () => false,
      },
    )

    return unsub
  }, [ref])

  useEffect(() => {
    if (!query.data) return

    ref.current?.animateCamera({
      latitude: query.data.stop.y_coord + 0.005,
      longitude: query.data.stop.x_coord,
      latitudeDelta: 0.010,
      longitudeDelta: 0.010,
    })

    bottomSheetModal.current?.present()
  }, [ref, query.data])

  useEffect(() => {
    if (!query.data) return
  }, [query.data])

  const openStopDirections = async () => {
    if (!query.data?.stop) {
      console.log('❌ No stop data for directions')
      return
    }

    console.log('🗺️ Opening directions to stop:', query.data.stop.stop_name)
    
    try {
      await openDirectionsFromCurrentLocation({
        latitude: query.data.stop.y_coord,
        longitude: query.data.stop.x_coord,
        label: query.data.stop.stop_name,
        address: query.data.stop.stop_name
      })
    } catch (error) {
      console.error('🚨 Error opening stop directions:', error)
    }
  }

  const handleOnDismiss = () => {
    useMiscStore.setState(() => ({
      selectedStopId: undefined,
    }))

    ref.current?.animateCamera(savedRegion.current)
  }

  return (
    <UiSheetModal
      cRef={bottomSheetModal}
      onDismiss={handleOnDismiss}
      enableDynamicSizing={true}
    >
      {query.isPending
        ? (
            <View style={styles.loadingContainer}>
              <UiActivityIndicator size="large" />
            </View>
          )
        : (
            <>
              <View style={styles.mapContainer}>
                {query.data && (
                  <TheMap
                    initialRegion={{
                      longitude: query.data.stop.x_coord,
                      latitude: query.data.stop.y_coord,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }}
                  >
                    <MarkersStopItem
                      type="point"
                      stop={query.data.stop}
                    />
                  </TheMap>
                )}
              </View>

              <UiButton
                title={i18n.t('stopDirections')}
                onPress={openStopDirections}
                variant="solid"
                icon="location-outline"
                square
                containerStyle={{
                  minHeight: 48,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                }}
              />

              {query.data && (
                <View style={styles.content}>
                  <View>
                    <UiText>{query.data.stop.stop_code}</UiText>
                    <UiText size="lg" style={styles.title}>
                      {query.data.stop.stop_name}
                    </UiText>
                    <UiText>{query.data.stop.province}</UiText>
                  </View>

                  <View style={styles.linesContainer}>
                    <UiText>{i18n.t('linesThatUseStop')}</UiText>

                    <View style={styles.codeOuter}>
                      {query.data?.buses.map(lineCode => (
                        <StopLine key={lineCode} lineCode={lineCode} />
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
    </UiSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 8,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
