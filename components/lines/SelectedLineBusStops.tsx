import { useLineBusStops } from '@/hooks/useLineBusStops'
import { BusStopLocation } from '@/api/getLineBusStopLocations'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { Ionicons } from '@expo/vector-icons'
import { getRouteDirection } from '@/utils/getRouteDirection'

import { useShallow } from 'zustand/react/shallow'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

import { UiActivityIndicator } from '../ui/UiActivityIndicator'
import { UiText } from '../ui/UiText'
import { UiButton } from '../ui/UiButton'

import { FlashList, FlashListProps, ListRenderItem, ViewToken } from '@shopify/flash-list'
import { Location as BusLocation } from '@/api/getLineBusLocations'
import { useMap } from '@/hooks/useMap'
import { i18n } from '@/translations/i18n'

interface Props {
  code: string
  routeCode?: string
}

const AnimatedFlashList
  = Animated.createAnimatedComponent<FlashListProps<BusStopLocation>>(FlashList)

const ITEM_SIZE = 46
const COLLAPSED = ITEM_SIZE * 3 - (ITEM_SIZE / 2) * 2
const EXPANDED = COLLAPSED * 2

export function SelectedLineBusStops(props: Props) {
  const flashlistRef = useAnimatedRef<FlashList<BusStopLocation>>()
  const currentViewableItems = useRef<ViewToken[]>([])
  const currentTrackedBus = useRef<BusLocation>()
  const map = useMap()

  const containerHeight = useSharedValue(COLLAPSED)
  const isScrolling = useSharedValue(false)
  const scrollY = useSharedValue(0)

  const line = useLines(useShallow(state => state.lines[props.code]))
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))

  const direction = props.routeCode ? getRouteDirection(props.routeCode) : 'G'
  const { filteredStops, query, closestStop } = useLineBusStops(props.code, direction, true)
  const { getSchemeColorHex } = useTheme(lineTheme)

  const busses = useMemo(
    () => line?.filter(bus => bus.guzergahkodu === props.routeCode),
    [line, props.routeCode],
  )

  const scrollToTrackedBus = useCallback(() => {
    if (!currentTrackedBus.current) return

    const updatedBus = busses?.find(bus => bus.kapino === currentTrackedBus.current?.kapino)
    if (!updatedBus) return

    const stopIndex = filteredStops?.findIndex(stop => stop.durakKodu === updatedBus.yakinDurakKodu)

    if (stopIndex === undefined || stopIndex === -1) {
      currentTrackedBus.current = undefined
    }
    else {
      flashlistRef.current?.scrollToIndex({
        animated: true,
        index: stopIndex,
        viewPosition: 0.5,
      })
    }
  }, [busses, filteredStops, flashlistRef])

  const snapToBus = useCallback(() => {
    if (isScrolling.value) return

    const trackedBus = busses?.find((bus) => {
      return currentViewableItems.current.find(({ item }: { item: BusStopLocation }) => {
        return item.durakKodu === bus.yakinDurakKodu
      })
    })

    if (!trackedBus) {
      currentTrackedBus.current = undefined
      containerHeight.value = withDelay(1000, withTiming(COLLAPSED))
    }
    else {
      currentTrackedBus.current = trackedBus
      containerHeight.value = withTiming(COLLAPSED)

      setTimeout(() => {
        scrollToTrackedBus()
      }, 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busses, scrollToTrackedBus])

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: containerHeight.value,
    }
  }, [])

  useEffect(() => {
    scrollToTrackedBus()
  }, [line, scrollToTrackedBus])

  useAnimatedReaction(
    () => isScrolling.value,
    () => {
      if (!isScrolling.value) {
        runOnJS(snapToBus)()
      }
    },
    [snapToBus],
  )

  const handleOnScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    scrollY.value = contentOffset.y
  }, [])

  const renderItem: ListRenderItem<BusStopLocation> = useCallback(
    ({ item }) => {
      const closestBus = busses?.find(bus => bus.yakinDurakKodu === item.durakKodu)

      const colorStyle: ViewStyle = {
        borderColor: getSchemeColorHex('primaryContainer'),
        backgroundColor: closestBus ? getSchemeColorHex('primaryContainer') : undefined,
      }

      const handleZoomBus = () => {
        map?.current?.animateCamera({
          center: {
            latitude: parseFloat(item.yKoordinati),
            longitude: parseFloat(item.xKoordinati),
          },
        })
      }

      return (
        <View style={styles.item}>
          <View style={styles.itemTitle}>
            <View style={[styles.itemCircle, colorStyle]}>
              {closestBus && (
                <Ionicons
                  name="bus-outline"
                  color={getSchemeColorHex('onPrimaryContainer')}
                  size={20}
                />
              )}
            </View>

            <View>
              <UiText style={{ color: getSchemeColorHex('onPrimary') }} numberOfLines={1}>
                {item.durakAdi}
              </UiText>

              {closestStop?.durakKodu === item.durakKodu && (
                <UiText info style={{ color: getSchemeColorHex('onPrimary'), fontSize: 12 }}>
                  {i18n.t('closeToThisStop')}
                </UiText>
              )}
            </View>
          </View>

          {closestBus && map && (
            <UiButton
              icon="locate"
              onPress={handleZoomBus}
              textStyle={{ color: getSchemeColorHex('onPrimaryContainer') }}
              style={{ backgroundColor: getSchemeColorHex('primaryContainer') }}
            />
          )}
        </View>
      )
    },
    [busses, closestStop, getSchemeColorHex, map],
  )

  const handleScrollDragStart = () => {
    isScrolling.value = true
    containerHeight.value = withTiming(EXPANDED)
  }

  const handleScrollMomentumEnd = () => {
    isScrolling.value = false
  }

  const handleViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    currentViewableItems.current = viewableItems
  }

  if (query.isPending) {
    return <UiActivityIndicator />
  }

  if (!filteredStops) {
    return null
  }

  const overrideItemLayout = (layout: { size?: number }): void => {
    layout.size = ITEM_SIZE
  }

  return (
    <Animated.View style={animatedContainerStyle}>
      <AnimatedFlashList
        ref={flashlistRef}
        data={filteredStops}
        renderItem={renderItem}
        estimatedItemSize={ITEM_SIZE}
        keyExtractor={item => item.durakKodu}
        overrideItemLayout={overrideItemLayout}
        fadingEdgeLength={40}
        onScrollBeginDrag={handleScrollDragStart}
        onMomentumScrollEnd={handleScrollMomentumEnd}
        onViewableItemsChanged={handleViewableItemsChanged}
        onScroll={handleOnScroll}
        viewabilityConfig={{
          minimumViewTime: 200,
          waitForInteraction: true,
          itemVisiblePercentThreshold: 100,
        }}
        snapToInterval={ITEM_SIZE}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    padding: 4,
    paddingRight: 8,
  },
  itemTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemCircle: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
